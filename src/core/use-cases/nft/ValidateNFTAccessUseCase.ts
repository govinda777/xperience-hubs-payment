import { INFTService } from '../../services/INFTService';
import { IWalletService } from '../../services/IWalletService';
import { IMerchantRepository } from '../../repositories/IMerchantRepository';
import { IProductRepository } from '../../repositories/IProductRepository';

export interface ValidateNFTAccessRequest {
  walletAddress: string;
  contractAddress?: string;
  merchantId?: string;
  productId?: string;
  tokenId?: string;
  requiredTokenType?: 'ERC-721' | 'ERC-1155';
  minBalance?: number;
  challenge?: string;
  signature?: string;
}

export interface ValidateNFTAccessResponse {
  success: boolean;
  hasAccess: boolean;
  ownedTokens?: Array<{
    tokenId: string;
    contractAddress: string;
    balance: number;
    metadata?: any;
  }>;
  challenge?: string;
  error?: string;
}

export class ValidateNFTAccessUseCase {
  constructor(
    private nftService: INFTService,
    private walletService: IWalletService,
    private merchantRepository: IMerchantRepository,
    private productRepository: IProductRepository
  ) {}

  async execute(request: ValidateNFTAccessRequest): Promise<ValidateNFTAccessResponse> {
    try {
      // Validate required fields
      if (!request.walletAddress) {
        return {
          success: false,
          hasAccess: false,
          error: 'Wallet address is required'
        };
      }

      // Validate wallet address format
      if (!this.walletService.isValidAddress(request.walletAddress)) {
        return {
          success: false,
          hasAccess: false,
          error: 'Invalid wallet address format'
        };
      }

      // If signature validation is required
      if (request.challenge && request.signature) {
        const isValidSignature = await this.validateSignature(
          request.walletAddress,
          request.challenge,
          request.signature
        );

        if (!isValidSignature) {
          return {
            success: false,
            hasAccess: false,
            error: 'Invalid signature'
          };
        }
      } else if (request.challenge && !request.signature) {
        // Return challenge for signing
        return {
          success: true,
          hasAccess: false,
          challenge: request.challenge
        };
      }

      let contractAddress = request.contractAddress;

      // Get contract address from merchant if not provided
      if (!contractAddress && request.merchantId) {
        const merchant = await this.merchantRepository.findById(request.merchantId);
        if (!merchant) {
          return {
            success: false,
            hasAccess: false,
            error: 'Merchant not found'
          };
        }
        contractAddress = merchant.contractAddress;
      }

      if (!contractAddress) {
        return {
          success: false,
          hasAccess: false,
          error: 'Contract address or merchant ID is required'
        };
      }

      // Validate specific token if provided
      if (request.tokenId) {
        return await this.validateSpecificToken(
          request.walletAddress,
          contractAddress,
          request.tokenId,
          request.requiredTokenType,
          request.minBalance
        );
      }

      // Validate product-specific NFT if provided
      if (request.productId) {
        return await this.validateProductAccess(
          request.walletAddress,
          contractAddress,
          request.productId,
          request.requiredTokenType,
          request.minBalance
        );
      }

      // General merchant NFT validation
      return await this.validateMerchantAccess(
        request.walletAddress,
        contractAddress,
        request.requiredTokenType,
        request.minBalance
      );

    } catch (error) {
      return {
        success: false,
        hasAccess: false,
        error: `Failed to validate NFT access: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async validateSignature(
    walletAddress: string,
    challenge: string,
    signature: string
  ): Promise<boolean> {
    try {
      const signatureResult = await this.walletService.signMessage({
        message: challenge,
        address: walletAddress
      });

      return signatureResult.success && signatureResult.signature === signature;
    } catch (error) {
      console.error('Failed to validate signature:', error);
      return false;
    }
  }

  private async validateSpecificToken(
    walletAddress: string,
    contractAddress: string,
    tokenId: string,
    tokenType?: 'ERC-721' | 'ERC-1155',
    minBalance: number = 1
  ): Promise<ValidateNFTAccessResponse> {
    const ownershipResult = await this.nftService.checkNFTOwnership({
      walletAddress,
      contractAddress,
      tokenId,
      tokenType: tokenType || 'ERC-721'
    });

    if (!ownershipResult.success) {
      return {
        success: false,
        hasAccess: false,
        error: ownershipResult.error
      };
    }

    const hasAccess = (ownershipResult.balance || 0) >= minBalance;

    return {
      success: true,
      hasAccess,
      ownedTokens: hasAccess ? [{
        tokenId,
        contractAddress,
        balance: ownershipResult.balance || 0,
        metadata: ownershipResult.metadata
      }] : []
    };
  }

  private async validateProductAccess(
    walletAddress: string,
    contractAddress: string,
    productId: string,
    tokenType?: 'ERC-721' | 'ERC-1155',
    minBalance: number = 1
  ): Promise<ValidateNFTAccessResponse> {
    // Get product to validate NFT requirements
    const product = await this.productRepository.findById(productId);
    if (!product) {
      return {
        success: false,
        hasAccess: false,
        error: 'Product not found'
      };
    }

    if (!product.hasNFTEnabled()) {
      return {
        success: false,
        hasAccess: false,
        error: 'NFT is not enabled for this product'
      };
    }

    // Get user's NFTs for this contract
    const userNFTsResult = await this.nftService.getUserNFTs({
      walletAddress,
      contractAddress,
      tokenType: tokenType || 'ERC-721'
    });

    if (!userNFTsResult.success) {
      return {
        success: false,
        hasAccess: false,
        error: userNFTsResult.error
      };
    }

    // Check if user has NFTs for this specific product
    const productNFTs = (userNFTsResult.nfts || []).filter(nft => 
      nft.metadata?.attributes?.some((attr: any) => 
        attr.trait_type === 'Product ID' && attr.value === productId
      )
    );

    const totalBalance = productNFTs.reduce((sum, nft) => sum + (nft.balance || 1), 0);
    const hasAccess = totalBalance >= minBalance;

    return {
      success: true,
      hasAccess,
      ownedTokens: hasAccess ? productNFTs.map(nft => ({
        tokenId: nft.tokenId,
        contractAddress: nft.contractAddress,
        balance: nft.balance || 1,
        metadata: nft.metadata
      })) : []
    };
  }

  private async validateMerchantAccess(
    walletAddress: string,
    contractAddress: string,
    tokenType?: 'ERC-721' | 'ERC-1155',
    minBalance: number = 1
  ): Promise<ValidateNFTAccessResponse> {
    // Get all user's NFTs for this merchant contract
    const userNFTsResult = await this.nftService.getUserNFTs({
      walletAddress,
      contractAddress,
      tokenType: tokenType || 'ERC-721'
    });

    if (!userNFTsResult.success) {
      return {
        success: false,
        hasAccess: false,
        error: userNFTsResult.error
      };
    }

    const ownedNFTs = userNFTsResult.nfts || [];
    const totalBalance = ownedNFTs.reduce((sum, nft) => sum + (nft.balance || 1), 0);
    const hasAccess = totalBalance >= minBalance;

    return {
      success: true,
      hasAccess,
      ownedTokens: hasAccess ? ownedNFTs.map(nft => ({
        tokenId: nft.tokenId,
        contractAddress: nft.contractAddress,
        balance: nft.balance || 1,
        metadata: nft.metadata
      })) : []
    };
  }
}