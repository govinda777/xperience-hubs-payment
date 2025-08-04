import { Order } from '../../entities/Order';
import { Merchant } from '../../entities/Merchant';
import { IPaymentService } from '../../services/IPaymentService';
import { IOrderRepository } from '../../repositories/IOrderRepository';
import { IMerchantRepository } from '../../repositories/IMerchantRepository';
import { INFTService } from '../../services/INFTService';
import { Money } from '@/types/payment';

export interface ProcessPaymentRequest {
  orderId: string;
  paymentMethod: 'PIX' | 'CRYPTO';
  userWalletAddress?: string;
  cryptoAmount?: string;
  cryptoToken?: string;
}

export interface ProcessPaymentResponse {
  success: boolean;
  transactionId?: string;
  qrCode?: string;
  qrCodeText?: string;
  pixKey?: string;
  expiresAt?: Date;
  error?: string;
  nftTokens?: Array<{
    tokenId: string;
    contractAddress: string;
  }>;
}

export class ProcessPaymentUseCase {
  constructor(
    private paymentService: IPaymentService,
    private orderRepository: IOrderRepository,
    private merchantRepository: IMerchantRepository,
    private nftService: INFTService
  ) {}

  async execute(request: ProcessPaymentRequest): Promise<ProcessPaymentResponse> {
    try {
      // Get order
      const order = await this.orderRepository.findById(request.orderId);
      if (!order) {
        return {
          success: false,
          error: 'Order not found'
        };
      }

      // Get merchant
      const merchant = await this.merchantRepository.findById(order.merchantId);
      if (!merchant) {
        return {
          success: false,
          error: 'Merchant not found'
        };
      }

      // Validate order status
      if (order.status !== 'pending') {
        return {
          success: false,
          error: `Order is not in pending status. Current status: ${order.status}`
        };
      }

      // Process payment based on method
      if (request.paymentMethod === 'PIX') {
        return await this.processPixPayment(order, merchant);
      } else if (request.paymentMethod === 'CRYPTO') {
        return await this.processCryptoPayment(order, merchant, request);
      } else {
        return {
          success: false,
          error: 'Unsupported payment method'
        };
      }

    } catch (error) {
      return {
        success: false,
        error: `Payment processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async processPixPayment(order: Order, merchant: Merchant): Promise<ProcessPaymentResponse> {
    try {
      // Calculate split payment
      const split = await this.paymentService.calculateSplit(
        order.total,
        merchant.settings.splitPercentage || 0.05
      );

      // Create PIX transaction
      const pixTransaction = await this.paymentService.createPixTransaction(
        order.total,
        merchant.pixKey,
        `Pedido ${order.id} - ${merchant.name}`,
        merchant.id,
        order.id
      );

      // Generate QR Code
      const qrCodeData = await this.paymentService.generatePixQRCode(
        order.total,
        merchant.pixKey,
        `Pedido ${order.id} - ${merchant.name}`,
        merchant.name
      );

      // Update order status
      await this.orderRepository.updateStatus(order.id, 'payment_pending');

      return {
        success: true,
        transactionId: pixTransaction.id,
        qrCode: qrCodeData.qrCode,
        qrCodeText: qrCodeData.qrCodeText,
        pixKey: merchant.pixKey,
        expiresAt: pixTransaction.expiresAt
      };

    } catch (error) {
      return {
        success: false,
        error: `PIX payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async processCryptoPayment(
    order: Order,
    merchant: Merchant,
    request: ProcessPaymentRequest
  ): Promise<ProcessPaymentResponse> {
    try {
      if (!request.userWalletAddress || !request.cryptoAmount || !request.cryptoToken) {
        return {
          success: false,
          error: 'Missing required crypto payment information'
        };
      }

      // Validate crypto payment
      const isValidPayment = await this.validateCryptoPayment(
        request.userWalletAddress,
        request.cryptoAmount,
        request.cryptoToken,
        order.total
      );

      if (!isValidPayment) {
        return {
          success: false,
          error: 'Invalid crypto payment'
        };
      }

      // Process crypto payment (this would integrate with blockchain service)
      const cryptoTransaction = await this.processCryptoTransaction(
        request.userWalletAddress,
        merchant.contractAddress,
        request.cryptoAmount,
        request.cryptoToken,
        order.id
      );

      if (!cryptoTransaction.success) {
        return {
          success: false,
          error: cryptoTransaction.error
        };
      }

      // Mint NFTs if required
      const nftTokens = await this.mintOrderNFTs(order, merchant);

      // Update order status
      await this.orderRepository.updateStatus(order.id, 'paid');

      return {
        success: true,
        transactionId: cryptoTransaction.transactionHash,
        nftTokens
      };

    } catch (error) {
      return {
        success: false,
        error: `Crypto payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async validateCryptoPayment(
    walletAddress: string,
    amount: string,
    token: string,
    requiredAmount: Money
  ): Promise<boolean> {
    try {
      // This would validate the crypto payment on the blockchain
      // For now, we'll do basic validation
      
      if (!walletAddress || walletAddress.length !== 42) {
        return false;
      }

      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        return false;
      }

      // Convert required amount to crypto equivalent (simplified)
      // Assuming 1 BRL = 0.001 ETH (for testing purposes)
      const requiredCryptoAmount = requiredAmount.amount * 0.001; // Convert from centavos to ETH
      
      if (numericAmount < requiredCryptoAmount) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  private async processCryptoTransaction(
    fromAddress: string,
    toAddress: string,
    amount: string,
    token: string,
    orderId: string
  ): Promise<{
    success: boolean;
    transactionHash?: string;
    error?: string;
  }> {
    try {
      // This would integrate with the blockchain service
      // For now, we'll simulate the transaction
      const mockTransactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      return {
        success: true,
        transactionHash: mockTransactionHash
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async mintOrderNFTs(order: Order, merchant: Merchant): Promise<Array<{
    tokenId: string;
    contractAddress: string;
  }>> {
    try {
      const nftTokens: Array<{ tokenId: string; contractAddress: string }> = [];

      for (const item of order.items) {
        // Check if item has NFT configuration in attributes
        const nftConfig = item.attributes.nftConfig as any;
        if (nftConfig && nftConfig.enabled) {
          const mintRequest = {
            productId: item.productId,
            merchantId: merchant.id,
            userId: order.userId,
            orderId: order.id,
            metadata: {
              name: `${item.productName} - Order ${order.id}`,
              description: `NFT for ${item.productName} purchased in order ${order.id}`,
              image: item.productImage || '',
              attributes: [
                {
                  trait_type: 'orderId',
                  value: order.id,
                },
                {
                  trait_type: 'productId',
                  value: item.productId,
                },
                {
                  trait_type: 'merchantId',
                  value: merchant.id,
                },
                {
                  trait_type: 'purchaseDate',
                  value: order.createdAt.toISOString(),
                  display_type: 'date' as const,
                },
                ...Object.entries(item.attributes).map(([key, value]) => ({
                  trait_type: key,
                  value: value,
                }))
              ]
            },
            tokenType: (nftConfig.tokenType as 'ERC-721' | 'ERC-1155') || 'ERC-721',
            quantity: item.quantity
          };

          const mintResult = await this.nftService.mintNFT(mintRequest);
          
          if (mintResult.success && mintResult.tokenId && mintResult.contractAddress) {
            nftTokens.push({
              tokenId: mintResult.tokenId,
              contractAddress: mintResult.contractAddress
            });

            // Add NFT to order
            await this.orderRepository.addNFTToken(
              order.id,
              mintResult.tokenId,
              mintResult.contractAddress
            );
          }
        }
      }

      return nftTokens;
    } catch (error) {
      console.error('Failed to mint NFTs:', error);
      return [];
    }
  }
} 