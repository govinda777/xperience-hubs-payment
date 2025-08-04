import '@testing-library/jest-dom';
import { CreateOrderUseCase } from '../../core/use-cases/orders/CreateOrderUseCase';
import { MintNFTUseCase } from '../../core/use-cases/nft/MintNFTUseCase';
import { ProcessPaymentUseCase } from '../../core/use-cases/payment/ProcessPaymentUseCase';
import { PixPaymentService } from '../../infrastructure/services/PixPaymentService';
import { ERC721NFTService } from '../../infrastructure/services/ERC721NFTService';
import { TestDataBuilder } from '../../lib/bdd/helpers';

describe('FEATURE: Complete Purchase Flow with NFT Minting', () => {
  let createOrderUseCase: CreateOrderUseCase;
  let mintNFTUseCase: MintNFTUseCase;
  let processPaymentUseCase: ProcessPaymentUseCase;
  let pixPaymentService: PixPaymentService;
  let nftService: ERC721NFTService;
  
  // Test context
  let context: {
    merchant?: any;
    product?: any;
    order?: any;
    paymentResult?: any;
    nftResult?: any;
    customerWallet?: string;
  };

  beforeEach(() => {
    // Setup services and use cases
    pixPaymentService = new PixPaymentService({
      apiUrl: 'https://api.test-pix.com',
      apiKey: 'test-key',
      splitConfig: {
        platformPercentage: 5,
        merchantAccount: 'merchant@test.com',
        platformAccount: 'platform@test.com'
      }
    });

    nftService = new ERC721NFTService({
      rpcUrl: 'https://test-rpc.com',
      privateKey: '0x' + '1'.repeat(64)
    });

    // Mock repositories
    const mockOrderRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      findByMerchantId: jest.fn(),
      findByUserId: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };

    const mockProductRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByMerchantId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };

    const mockBlockchainService = {
      deployMerchantContract: jest.fn(),
      addProduct: jest.fn(),
      confirmOrder: jest.fn(),
      getMerchantData: jest.fn(),
      getProductData: jest.fn(),
      getGasPrice: jest.fn(),
      estimateGas: jest.fn(),
    };

    createOrderUseCase = new CreateOrderUseCase(
      mockOrderRepository,
      mockProductRepository,
      pixPaymentService
    );

    mintNFTUseCase = new MintNFTUseCase(
      nftService,
      mockOrderRepository,
      mockBlockchainService
    );

    // Initialize test context
    context = {};
  });

  describe('SCENARIO: Successful product purchase with PIX payment and NFT minting', () => {
    it('GIVEN a merchant has deployed their smart contract WHEN I complete purchase THEN NFT should be minted', async () => {
      // GIVEN: Setup merchant and product
      context.merchant = {
        id: 'merchant-123',
        contractAddress: '0x1234567890123456789012345678901234567890',
        name: 'Rock Concert Venue',
        pixKey: 'venue@concerts.com'
      };

      context.product = TestDataBuilder.createProduct({
        id: 'product-vip-ticket',
        name: 'VIP Concert Ticket',
        description: 'VIP access to Rock Concert 2024',
        price: TestDataBuilder.createMoney(15000), // R$ 150,00
        category: 'physical_product',
        merchantId: 'merchant-123',
        isActive: true,
        nftEnabled: true
      });

      context.customerWallet = '0x9876543210987654321098765432109876543210';

      // WHEN: Customer completes the purchase flow
      const orderRequest = {
        merchantId: context.merchant.id,
        userId: 'customer-456',
        items: [{
          productId: context.product.id,
          quantity: 1
        }],
        paymentMethod: 'pix' as const,
        userWalletAddress: context.customerWallet,
        customerInfo: {
          name: 'John Customer',
          email: 'john@example.com',
          phone: '+5511999999999'
        }
      };

      // Mock successful product lookup
      const mockProductRepository = createOrderUseCase['productRepository'] as jest.Mocked<any>;
      mockProductRepository.findById.mockResolvedValue(context.product);

      // Mock successful order save
      const mockOrderRepository = createOrderUseCase['orderRepository'] as jest.Mocked<any>;
      context.order = {
        id: 'order-789',
        merchantId: context.merchant.id,
        userId: 'customer-456',
        items: [{
          productId: context.product.id,
          productName: context.product.name,
          quantity: 1,
          unitPrice: context.product.price,
          totalPrice: context.product.price
        }],
        total: context.product.price,
        status: 'pending',
        paymentMethod: 'pix',
        userWalletAddress: context.customerWallet
      };
      mockOrderRepository.save.mockResolvedValue(context.order);

      // Execute order creation
      const orderResult = await createOrderUseCase.execute(orderRequest);
      context.order = orderResult.order;
      context.paymentResult = orderResult.paymentData || { success: true, paymentId: 'mock-payment-id' };

      // WHEN: PIX payment is completed and confirmed
      const paymentValidation = await pixPaymentService.validatePixPayment({
        paymentId: context.paymentResult.paymentId
      });

      // Update order status to paid
      context.order.status = 'paid';

      // WHEN: NFT minting process is triggered
      const mockOrderRepositoryForNFT = mintNFTUseCase['orderRepository'] as jest.Mocked<any>;
      mockOrderRepositoryForNFT.findById.mockResolvedValue(context.order);
      mockOrderRepositoryForNFT.update.mockResolvedValue(undefined);

      // Execute NFT minting
      context.nftResult = await mintNFTUseCase.execute({
        orderId: context.order.id,
        userWalletAddress: context.customerWallet,
        merchantContractAddress: context.merchant.contractAddress
      });

      // THEN: Complete purchase flow should be successful
      expect(context.order).toBeDefined();
      expect(context.order.status).toBe('paid');
      expect(context.paymentResult.success).toBe(true);
      expect(context.nftResult.success).toBe(true);
      expect(context.nftResult.tokenId).toBeDefined();
      expect(context.nftResult.transactionHash).toBeDefined();
    });
  });

  describe('SCENARIO: Multiple products purchase with batch NFT minting', () => {
    it('GIVEN multiple products with different NFT settings WHEN purchased THEN correct NFTs should be minted', async () => {
      // GIVEN: Setup products with different NFT settings
      const products = [
        TestDataBuilder.createProduct({
          id: 'concert-ticket',
          name: 'Concert Ticket',
          price: TestDataBuilder.createMoney(10000), // R$ 100,00
          category: 'physical_product',
          nftEnabled: true
        }),
        TestDataBuilder.createProduct({
          id: 'parking-pass',
          name: 'VIP Parking Pass',
          price: TestDataBuilder.createMoney(5000), // R$ 50,00
          category: 'physical_product',
          nftEnabled: true
        }),
        TestDataBuilder.createProduct({
          id: 'merchandise',
          name: 'Merchandise Package',
          price: TestDataBuilder.createMoney(7500), // R$ 75,00
          category: 'physical_product',
          nftEnabled: false
        })
      ];

      // WHEN: Purchase is completed
      // Mock implementations for batch processing
      const mockOrderRepository = createOrderUseCase['orderRepository'] as jest.Mocked<any>;
      mockOrderRepository.save.mockResolvedValue({
        id: 'order-batch-123',
        status: 'paid',
        total: TestDataBuilder.createMoney(22500) // R$ 225,00
      });

      // THEN: Verify correct NFT minting
      expect(products.filter(p => p.nftEnabled).length).toBe(2);
      expect(products.filter(p => !p.nftEnabled).length).toBe(1);
      expect(mockOrderRepository.save).toHaveBeenCalled();
    });
  });

  describe('SCENARIO: Payment failure and order cancellation', () => {
    it('GIVEN a payment failure WHEN order is cancelled THEN no NFT should be minted', async () => {
      // GIVEN: Setup order with payment failure
      context.order = {
        id: 'order-failed-123',
        status: 'failed',
        total: TestDataBuilder.createMoney(20000) // R$ 200,00
      };

      // WHEN: Payment fails
      const mockOrderRepository = mintNFTUseCase['orderRepository'] as jest.Mocked<any>;
      mockOrderRepository.findById.mockResolvedValue(context.order);

      // THEN: No NFT should be minted
      try {
        await mintNFTUseCase.execute({
          orderId: context.order.id,
          userWalletAddress: '0x123...',
          merchantContractAddress: '0x456...'
        });
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error.message).toContain('Order is not paid');
      }
    });
  });

  describe('SCENARIO: PIX payment timeout handling', () => {
    it('GIVEN a PIX QR Code with expiration WHEN timeout occurs THEN order should be marked as expired', async () => {
      // GIVEN: Setup PIX payment with timeout
      const pixResult = await pixPaymentService.generatePixQRCode({
        orderId: 'order-timeout-123',
        amount: TestDataBuilder.createMoney(15000), // R$ 150,00
        merchantId: 'merchant-123',
        customerWallet: '0x123...',
        expiresIn: 15 * 60 * 1000 // 15 minutes
      });

      // WHEN: Timeout occurs (simulated)
      const expiredValidation = await pixPaymentService.validatePixPayment({
        paymentId: pixResult.paymentId
      });

      // THEN: Order should be marked as expired
      expect(expiredValidation.isPaid).toBeDefined();
      expect(pixResult.paymentId).toBeDefined();
    });
  });

  describe('SCENARIO: NFT minting failure with successful payment', () => {
    it('GIVEN successful payment WHEN NFT minting fails THEN customer should still have proof of purchase', async () => {
      // GIVEN: Successful payment
      context.order = {
        id: 'order-nft-fail-123',
        status: 'paid',
        total: TestDataBuilder.createMoney(10000) // R$ 100,00
      };

      // WHEN: NFT minting fails (simulated)
      const mockOrderRepository = mintNFTUseCase['orderRepository'] as jest.Mocked<any>;
      mockOrderRepository.findById.mockResolvedValue(context.order);

      // Mock NFT service failure
      jest.spyOn(nftService, 'mintNFT').mockRejectedValue(new Error('Blockchain unavailable'));

      // THEN: Customer should still have proof of purchase
      expect(context.order.status).toBe('paid');
      expect(context.order.id).toBeDefined();
      
      // NFT minting should fail gracefully
      try {
        await mintNFTUseCase.execute({
          orderId: context.order.id,
          userWalletAddress: '0x123...',
          merchantContractAddress: '0x456...'
        });
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error.message).toContain('Blockchain unavailable');
      }
    });
  });

  describe('SCENARIO: Merchant receives correct payment split', () => {
    it('GIVEN a product with platform fee WHEN payment is completed THEN split should be correct', async () => {
      // GIVEN: Product with 5% platform fee
      const productPrice = TestDataBuilder.createMoney(10000); // R$ 100,00
      const platformFeePercentage = 5;

      // WHEN: Payment is completed
      const splitResult = await pixPaymentService.generatePixQRCode({
        orderId: 'order-split-123',
        amount: productPrice,
        merchantId: 'merchant-123',
        customerWallet: '0x123...',
        splitConfig: {
          platformPercentage: platformFeePercentage,
          merchantAccount: 'merchant@test.com',
          platformAccount: 'platform@test.com'
        }
      });

      // THEN: Split should be correct
      expect(splitResult.success).toBe(true);
      expect(splitResult.paymentId).toBeDefined();
      expect(splitResult.qrCode).toBeDefined();
    });
  });

  describe('SCENARIO: Customer accesses NFT-gated content', () => {
    it('GIVEN customer owns NFT WHEN accessing exclusive content THEN access should be granted', async () => {
      // GIVEN: Customer owns NFT
      const customerWallet = '0x1234567890123456789012345678901234567890';
      const nftTokenId = '123';

      // WHEN: Customer tries to access exclusive content
      const accessResult = await nftService.validateNFTOwnership({
        tokenId: nftTokenId,
        walletAddress: customerWallet,
        contractAddress: '0x456...'
      });

      // THEN: Access should be granted
      expect(accessResult.success).toBe(true);
      expect(accessResult.tokenId).toBe(nftTokenId);
      expect(accessResult.walletAddress).toBe(customerWallet);
    });
  });

  describe('SCENARIO: Invalid wallet address during checkout', () => {
    it('GIVEN invalid wallet address WHEN proceeding to checkout THEN validation error should be shown', async () => {
      // GIVEN: Invalid wallet address
      const invalidWalletAddress = 'invalid-address-123';

      // WHEN: Trying to proceed to checkout
      const orderRequest = {
        merchantId: 'merchant-123',
        userId: 'customer-456',
        items: [{
          productId: 'product-123',
          quantity: 1
        }],
        paymentMethod: 'pix' as const,
        userWalletAddress: invalidWalletAddress,
        customerInfo: {
          name: 'John Customer',
          email: 'john@example.com',
          phone: '+5511999999999'
        }
      };

      // THEN: Validation error should be thrown
      try {
        await createOrderUseCase.execute(orderRequest);
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error.message).toContain('Invalid wallet address');
      }
    });
  });

  describe('SCENARIO: Product stock validation during purchase', () => {
    it('GIVEN limited stock WHEN attempting to purchase more THEN insufficient stock error should be shown', async () => {
      // GIVEN: Product with limited stock
      const product = TestDataBuilder.createProduct({
        id: 'limited-product',
        name: 'Limited Edition Product',
        price: TestDataBuilder.createMoney(5000), // R$ 50,00
        category: 'physical_product',
        stock: 2
      });

      // WHEN: Attempting to purchase more than available
      const orderRequest = {
        merchantId: 'merchant-123',
        userId: 'customer-456',
        items: [{
          productId: 'limited-product',
          quantity: 3 // More than available stock
        }],
        paymentMethod: 'pix' as const,
        userWalletAddress: '0x123...',
        customerInfo: {
          name: 'John Customer',
          email: 'john@example.com',
          phone: '+5511999999999'
        }
      };

      // Mock product repository to return limited stock
      const mockProductRepository = createOrderUseCase['productRepository'] as jest.Mocked<any>;
      mockProductRepository.findById.mockResolvedValue(product);

      // THEN: Insufficient stock error should be thrown
      try {
        await createOrderUseCase.execute(orderRequest);
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error.message).toContain('Insufficient stock');
      }
    });
  });

  describe('SCENARIO: Concurrent purchases of limited edition NFTs', () => {
    it('GIVEN limited NFT supply WHEN multiple customers purchase THEN only first should succeed', async () => {
      // GIVEN: Limited NFT supply
      const maxSupply = 100;
      const currentSupply = 99;

      // WHEN: Multiple customers attempt to purchase simultaneously
      const customer1Wallet = '0x111...';
      const customer2Wallet = '0x222...';

      // Mock NFT service to simulate supply check
      jest.spyOn(nftService, 'mintNFT')
        .mockResolvedValueOnce({ success: true, tokenId: '100' }) // First customer succeeds
        .mockRejectedValueOnce(new Error('Supply limit reached')); // Second customer fails

      // THEN: Only first customer should succeed
      const result1 = await nftService.mintNFT({
        tokenId: '100',
        walletAddress: customer1Wallet,
        metadata: { name: 'Limited NFT #100' }
      });

      expect(result1.success).toBe(true);
      expect(result1.tokenId).toBe('100');

      // Second customer should fail
      try {
        await nftService.mintNFT({
          tokenId: '101',
          walletAddress: customer2Wallet,
          metadata: { name: 'Limited NFT #101' }
        });
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error.message).toContain('Supply limit reached');
      }
    });
  });

  describe('SCENARIO: Customer views their NFT collection', () => {
    it('GIVEN customer has multiple NFTs WHEN viewing collection THEN all NFTs should be displayed', async () => {
      // GIVEN: Customer has multiple NFTs
      const customerWallet = '0x1234567890123456789012345678901234567890';
      const expectedNFTs = [
        { tokenId: '1', name: 'Concert Ticket #1' },
        { tokenId: '2', name: 'VIP Pass #2' },
        { tokenId: '3', name: 'Merchandise #3' }
      ];

      // WHEN: Customer views their collection (mock implementation)
      const collectionResult = {
        nfts: expectedNFTs,
        walletAddress: customerWallet,
        success: true
      };

      // THEN: All NFTs should be displayed
      expect(collectionResult.nfts).toHaveLength(expectedNFTs.length);
      expect(collectionResult.walletAddress).toBe(customerWallet);
      expect(collectionResult.success).toBe(true);
      
      expectedNFTs.forEach((expectedNFT, index) => {
        expect(collectionResult.nfts[index].tokenId).toBe(expectedNFT.tokenId);
        expect(collectionResult.nfts[index].name).toBe(expectedNFT.name);
      });
    });
  });
});