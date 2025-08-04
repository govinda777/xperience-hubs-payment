import { MintNFTUseCase, MintNFTRequest } from '../nft/MintNFTUseCase';
import { INFTService } from '../../services/INFTService';
import { IOrderRepository } from '../../repositories/IOrderRepository';
import { IBlockchainService } from '../../services/IBlockchainService';
import { Order } from '../../entities/Order';

enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}
import { TestDataBuilder } from '../../../lib/bdd/helpers';

// Mock implementations
const mockNFTService: jest.Mocked<INFTService> = {
  mintNFT: jest.fn(),
  validateNFTOwnership: jest.fn(),
  getNFTMetadata: jest.fn(),
};

const mockOrderRepository: jest.Mocked<IOrderRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
  findByMerchantId: jest.fn(),
  findByUserId: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findAll: jest.fn(),
};

const mockBlockchainService: jest.Mocked<IBlockchainService> = {
  deployMerchantContract: jest.fn(),
  addProduct: jest.fn(),
  confirmOrder: jest.fn(),
  getMerchantData: jest.fn(),
  getProductData: jest.fn(),
  getGasPrice: jest.fn(),
  estimateGas: jest.fn(),
};

describe('MintNFTUseCase', () => {
  let useCase: MintNFTUseCase;
  let validRequest: MintNFTRequest;
  let mockOrder: Order;

  beforeEach(() => {
    useCase = new MintNFTUseCase(
      mockNFTService,
      mockOrderRepository,
      mockBlockchainService
    );

    mockOrder = new Order({
      id: 'order-1',
      merchantId: 'merchant-1',
      userId: 'user-1',
      items: [
        {
          productId: 'product-1',
          productName: 'Test Product',
          quantity: 1,
          unitPrice: TestDataBuilder.createMoney(10000),
          totalPrice: TestDataBuilder.createMoney(10000)
        }
      ],
      total: TestDataBuilder.createMoney(10000),
      status: 'paid' as const,
      paymentMethod: 'pix'
    });

    validRequest = {
      orderId: 'order-1',
      userWalletAddress: '0x123456789abcdef123456789abcdef123456789a',
      merchantContractAddress: '0x987654321fedcba987654321fedcba987654321f'
    };

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('GIVEN a valid NFT minting request', () => {
    beforeEach(() => {
      mockOrderRepository.findById.mockResolvedValue(mockOrder);
      mockNFTService.mintNFT.mockResolvedValue({
        success: true,
        tokenId: 'token-123',
        transactionHash: '0xabc123def456'
      });
      mockOrderRepository.update.mockResolvedValue(undefined);
    });

    it('WHEN minting NFT for paid order THEN should successfully mint and return token data', async () => {
      const result = await useCase.execute(validRequest);

      expect(result.success).toBe(true);
      expect(result.tokenId).toBe('token-123');
      expect(result.transactionHash).toBe('0xabc123def456');
      expect(result.error).toBeUndefined();
    });

    it('WHEN minting NFT THEN should call NFT service with correct metadata', async () => {
      await useCase.execute(validRequest);

      expect(mockNFTService.mintNFT).toHaveBeenCalledTimes(1);
      expect(mockNFTService.mintNFT).toHaveBeenCalledWith({
        contractAddress: validRequest.merchantContractAddress,
        to: validRequest.userWalletAddress,
        metadata: expect.stringContaining('Test Product'),
        quantity: 1
      });

      // Verify metadata structure
      const callArgs = mockNFTService.mintNFT.mock.calls[0][0];
      const metadata = JSON.parse(callArgs.metadata);
      expect(metadata.name).toContain('Test Product');
      expect(metadata.description).toContain('NFT ticket');
      expect(metadata.attributes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ trait_type: 'Order ID', value: 'order-1' }),
          expect.objectContaining({ trait_type: 'Product ID', value: 'product-1' }),
          expect.objectContaining({ trait_type: 'Quantity', value: 1 }),
          expect.objectContaining({ trait_type: 'Merchant', value: 'merchant-1' })
        ])
      );
    });

    it('WHEN minting NFT THEN should update order status to completed', async () => {
      await useCase.execute(validRequest);

      expect(mockOrderRepository.update).toHaveBeenCalledTimes(1);
      expect(mockOrderRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'completed',
          nftTokens: ['token-123'],
          completedAt: expect.any(Date)
        })
      );
    });
  });

  describe('GIVEN invalid request data', () => {
    it('WHEN missing required fields THEN should return validation error', async () => {
      const invalidRequest = { ...validRequest, orderId: '' };

      const result = await useCase.execute(invalidRequest);

      expect(result.success).toBe(false);
      expect(result.error).toContain('required');
      expect(result.tokenId).toBeUndefined();
      expect(mockNFTService.mintNFT).not.toHaveBeenCalled();
    });

    it('WHEN wallet address is missing THEN should return validation error', async () => {
      const invalidRequest = { ...validRequest, userWalletAddress: '' };

      const result = await useCase.execute(invalidRequest);

      expect(result.success).toBe(false);
      expect(result.error).toContain('required');
      expect(result.tokenId).toBeUndefined();
    });

    it('WHEN contract address is missing THEN should return validation error', async () => {
      const invalidRequest = { ...validRequest, merchantContractAddress: '' };

      const result = await useCase.execute(invalidRequest);

      expect(result.success).toBe(false);
      expect(result.error).toContain('required');
      expect(result.tokenId).toBeUndefined();
    });
  });

  describe('GIVEN order validation scenarios', () => {
    it('WHEN order does not exist THEN should return order not found error', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      const result = await useCase.execute(validRequest);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Order not found');
      expect(result.tokenId).toBeUndefined();
      expect(mockNFTService.mintNFT).not.toHaveBeenCalled();
    });

    it('WHEN order is not paid THEN should return order status error', async () => {
      const unpaidOrder = new Order({
        ...mockOrder,
        status: 'pending' as const
      });
      mockOrderRepository.findById.mockResolvedValue(unpaidOrder);

      const result = await useCase.execute(validRequest);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Order must be paid');
      expect(result.tokenId).toBeUndefined();
      expect(mockNFTService.mintNFT).not.toHaveBeenCalled();
    });

    it('WHEN NFT already minted for order THEN should return already minted error', async () => {
      const orderWithNFT = new Order({
        ...mockOrder,
        nftTokens: ['existing-token-123']
      });
      mockOrderRepository.findById.mockResolvedValue(orderWithNFT);

      const result = await useCase.execute(validRequest);

      expect(result.success).toBe(false);
      expect(result.error).toContain('already minted');
      expect(result.tokenId).toBeUndefined();
      expect(mockNFTService.mintNFT).not.toHaveBeenCalled();
    });
  });

  describe('GIVEN multiple items in order', () => {
    beforeEach(() => {
      const multiItemOrder = new Order({
        ...mockOrder,
        items: [
          {
            productId: 'product-1',
            productName: 'Test Product 1',
            quantity: 2,
            unitPrice: TestDataBuilder.createMoney(10000),
            totalPrice: TestDataBuilder.createMoney(20000)
          },
          {
            productId: 'product-2',
            productName: 'Test Product 2',
            quantity: 1,
            unitPrice: TestDataBuilder.createMoney(5000),
            totalPrice: TestDataBuilder.createMoney(5000)
          }
        ]
      });
      mockOrderRepository.findById.mockResolvedValue(multiItemOrder);
    });

    it('WHEN order has multiple items THEN should mint NFT for each item', async () => {
      mockNFTService.mintNFT
        .mockResolvedValueOnce({
          success: true,
          tokenId: 'token-1',
          transactionHash: '0xabc123'
        })
        .mockResolvedValueOnce({
          success: true,
          tokenId: 'token-2',
          transactionHash: '0xdef456'
        });
      mockOrderRepository.update.mockResolvedValue(undefined);

      const result = await useCase.execute(validRequest);

      expect(result.success).toBe(true);
      expect(mockNFTService.mintNFT).toHaveBeenCalledTimes(2);
      
      // Check first mint call (quantity 2)
      expect(mockNFTService.mintNFT).toHaveBeenNthCalledWith(1, expect.objectContaining({
        quantity: 2
      }));
      
      // Check second mint call (quantity 1)
      expect(mockNFTService.mintNFT).toHaveBeenNthCalledWith(2, expect.objectContaining({
        quantity: 1
      }));
    });
  });

  describe('GIVEN NFT service failures', () => {
    beforeEach(() => {
      mockOrderRepository.findById.mockResolvedValue(mockOrder);
    });

    it('WHEN NFT minting fails THEN should return minting error', async () => {
      mockNFTService.mintNFT.mockResolvedValue({
        success: false,
        error: 'Blockchain network error'
      });

      const result = await useCase.execute(validRequest);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Blockchain network error');
      expect(result.tokenId).toBeUndefined();
      expect(mockOrderRepository.update).not.toHaveBeenCalled();
    });

    it('WHEN partial minting failure occurs THEN should return partial failure error', async () => {
      const multiItemOrder = new Order({
        ...mockOrder,
        items: [
          {
            productId: 'product-1',
            productName: 'Test Product 1',
            quantity: 1,
            unitPrice: TestDataBuilder.createMoney(10000),
            totalPrice: TestDataBuilder.createMoney(10000)
          },
          {
            productId: 'product-2',
            productName: 'Test Product 2',
            quantity: 1,
            unitPrice: TestDataBuilder.createMoney(5000),
            totalPrice: TestDataBuilder.createMoney(5000)
          }
        ]
      });
      mockOrderRepository.findById.mockResolvedValue(multiItemOrder);

      mockNFTService.mintNFT
        .mockResolvedValueOnce({
          success: true,
          tokenId: 'token-1',
          transactionHash: '0xabc123'
        })
        .mockResolvedValueOnce({
          success: false,
          error: 'Gas limit exceeded'
        });

      const result = await useCase.execute(validRequest);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Gas limit exceeded');
      expect(result.tokenId).toBeUndefined();
    });
  });

  describe('GIVEN repository failures', () => {
    beforeEach(() => {
      mockOrderRepository.findById.mockResolvedValue(mockOrder);
      mockNFTService.mintNFT.mockResolvedValue({
        success: true,
        tokenId: 'token-123',
        transactionHash: '0xabc123def456'
      });
    });

    it('WHEN order update fails THEN should still return success but log error', async () => {
      mockOrderRepository.update.mockRejectedValue(new Error('Database update failed'));

      const result = await useCase.execute(validRequest);

      // NFT was minted successfully, so we return success
      // The order update failure is logged but doesn't fail the operation
      expect(result.success).toBe(true);
      expect(result.tokenId).toBe('token-123');
    });
  });

  describe('GIVEN error handling scenarios', () => {
    it('WHEN unexpected error occurs THEN should handle gracefully', async () => {
      mockOrderRepository.findById.mockRejectedValue(new Error('Unexpected database error'));

      const result = await useCase.execute(validRequest);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unexpected database error');
      expect(result.tokenId).toBeUndefined();
    });
  });
});