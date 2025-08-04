import { INFTService } from '../../services/INFTService';
import { IOrderRepository } from '../../repositories/IOrderRepository';
import { IBlockchainService } from '../../services/IBlockchainService';
import { OrderStatus } from '../../entities/Order';

export interface MintNFTRequest {
  orderId: string;
  userWalletAddress: string;
  merchantContractAddress: string;
}

export interface MintNFTResponse {
  success: boolean;
  tokenId?: string;
  transactionHash?: string;
  error?: string;
}

export class MintNFTUseCase {
  constructor(
    private nftService: INFTService,
    private orderRepository: IOrderRepository,
    private blockchainService: IBlockchainService
  ) {}

  async execute(request: MintNFTRequest): Promise<MintNFTResponse> {
    try {
      // Validate required fields
      if (!request.orderId || !request.userWalletAddress || !request.merchantContractAddress) {
        return {
          success: false,
          error: 'Order ID, user wallet address, and merchant contract address are required'
        };
      }

      // Get order
      const order = await this.orderRepository.findById(request.orderId);
      if (!order) {
        return {
          success: false,
          error: 'Order not found'
        };
      }

      // Validate order status
      if (order.status !== 'paid') {
        return {
          success: false,
          error: 'Order must be paid to mint NFT'
        };
      }

      // Check if NFT already minted for this order
      if (order.nftTokens && order.nftTokens.length > 0) {
        return {
          success: false,
          error: 'NFT already minted for this order'
        };
      }

      // Prepare NFT metadata for each product in the order
      const mintPromises = order.items.map(async (item, index) => {
        const metadata = {
          name: `${item.productName} - Order #${order.id}`,
          description: `NFT ticket for ${item.productName}`,
          image: `ipfs://placeholder-image-${item.productId}`,
          attributes: [
            {
              trait_type: 'Order ID',
              value: order.id
            },
            {
              trait_type: 'Product ID',
              value: item.productId
            },
            {
              trait_type: 'Quantity',
              value: item.quantity
            },
            {
              trait_type: 'Purchase Date',
              value: order.createdAt.toISOString()
            },
            {
              trait_type: 'Merchant',
              value: order.merchantId
            }
          ]
        };

        // Mint NFT
        return await this.nftService.mintNFT({
          contractAddress: request.merchantContractAddress,
          to: request.userWalletAddress,
          metadata: JSON.stringify(metadata),
          quantity: item.quantity
        });
      });

      const mintResults = await Promise.all(mintPromises);

      // Check if all mints were successful
      const failedMints = mintResults.filter(result => !result.success);
      if (failedMints.length > 0) {
        return {
          success: false,
          error: `Failed to mint NFTs: ${failedMints.map(r => r.error).join(', ')}`
        };
      }

      // Extract token IDs and transaction hashes
      const tokenIds = mintResults.map(result => result.tokenId).filter(Boolean) as string[];
      const transactionHashes = mintResults.map(result => result.transactionHash).filter(Boolean) as string[];

      // Update order with NFT data
      order.nftTokens = tokenIds;
      order.status = 'completed';
      order.completedAt = new Date();

      await this.orderRepository.update(order);

      return {
        success: true,
        tokenId: tokenIds[0], // Return first token ID for backward compatibility
        transactionHash: transactionHashes[0] // Return first transaction hash
      };

    } catch (error) {
      return {
        success: false,
        error: `Failed to mint NFT: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}