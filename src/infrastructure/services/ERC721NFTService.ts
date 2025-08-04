import { INFTService } from '../../core/services/INFTService';

export interface MintNFTRequest {
  contractAddress: string;
  to: string; // Wallet address
  metadata: string; // JSON metadata
  quantity?: number;
}

export interface MintNFTResponse {
  success: boolean;
  tokenId?: string;
  transactionHash?: string;
  error?: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface ValidateNFTOwnershipRequest {
  contractAddress: string;
  walletAddress: string;
  tokenId?: string;
}

export interface ValidateNFTOwnershipResponse {
  success: boolean;
  ownsNFT: boolean;
  tokenIds?: string[];
  error?: string;
}

export class ERC721NFTService implements INFTService {
  private readonly rpcUrl: string;
  private readonly privateKey: string;

  constructor(config: {
    rpcUrl: string;
    privateKey: string;
  }) {
    this.rpcUrl = config.rpcUrl;
    this.privateKey = config.privateKey;
  }

  async mintNFT(request: MintNFTRequest): Promise<MintNFTResponse> {
    try {
      // Validate inputs
      if (!request.contractAddress || !request.to || !request.metadata) {
        return {
          success: false,
          error: 'Contract address, recipient address, and metadata are required'
        };
      }

      // Validate wallet address format
      if (!this.isValidEthereumAddress(request.to)) {
        return {
          success: false,
          error: 'Invalid recipient wallet address'
        };
      }

      // Parse and validate metadata
      let metadata: NFTMetadata;
      try {
        metadata = JSON.parse(request.metadata);
        if (!metadata.name || !metadata.description) {
          throw new Error('Metadata must include name and description');
        }
      } catch (error) {
        return {
          success: false,
          error: 'Invalid metadata format'
        };
      }

      // Upload metadata to IPFS (mock for now)
      const metadataUri = await this.uploadMetadataToIPFS(metadata);

      // Mint NFT(s) - handling both single and batch minting
      const quantity = request.quantity || 1;
      const mintResults: Array<{ tokenId: string; transactionHash: string }> = [];

      for (let i = 0; i < quantity; i++) {
        const result = await this.executeMintTransaction(
          request.contractAddress,
          request.to,
          metadataUri
        );

        if (!result.success) {
          return {
            success: false,
            error: `Failed to mint NFT ${i + 1}/${quantity}: ${result.error}`
          };
        }

        mintResults.push({
          tokenId: result.tokenId!,
          transactionHash: result.transactionHash!
        });
      }

      // Return first minted NFT data for backward compatibility
      return {
        success: true,
        tokenId: mintResults[0].tokenId,
        transactionHash: mintResults[0].transactionHash
      };

    } catch (error) {
      return {
        success: false,
        error: `NFT minting error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async validateNFTOwnership(request: ValidateNFTOwnershipRequest): Promise<ValidateNFTOwnershipResponse> {
    try {
      // Validate inputs
      if (!request.contractAddress || !request.walletAddress) {
        return {
          success: false,
          ownsNFT: false,
          error: 'Contract address and wallet address are required'
        };
      }

      if (!this.isValidEthereumAddress(request.walletAddress)) {
        return {
          success: false,
          ownsNFT: false,
          error: 'Invalid wallet address'
        };
      }

      // Check ownership
      if (request.tokenId) {
        // Check ownership of specific token
        const owner = await this.getTokenOwner(request.contractAddress, request.tokenId);
        const ownsToken = owner?.toLowerCase() === request.walletAddress.toLowerCase();

        return {
          success: true,
          ownsNFT: ownsToken,
          tokenIds: ownsToken ? [request.tokenId] : []
        };
      } else {
        // Check balance and get all tokens owned by address
        const balance = await this.getTokenBalance(request.contractAddress, request.walletAddress);
        const tokenIds = balance > 0 ? await this.getTokensByOwner(request.contractAddress, request.walletAddress) : [];

        return {
          success: true,
          ownsNFT: balance > 0,
          tokenIds
        };
      }

    } catch (error) {
      return {
        success: false,
        ownsNFT: false,
        error: `NFT validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async getNFTMetadata(contractAddress: string, tokenId: string): Promise<{ success: boolean; metadata?: NFTMetadata; error?: string }> {
    try {
      const metadataUri = await this.getTokenURI(contractAddress, tokenId);
      if (!metadataUri) {
        return {
          success: false,
          error: 'Token URI not found'
        };
      }

      const metadata = await this.fetchMetadataFromURI(metadataUri);
      return {
        success: true,
        metadata
      };

    } catch (error) {
      return {
        success: false,
        error: `Failed to get NFT metadata: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async uploadMetadataToIPFS(metadata: NFTMetadata): Promise<string> {
    // Mock IPFS upload - in production, use actual IPFS service
    const mockHash = `QmX${Math.random().toString(36).substr(2, 44)}`;
    const ipfsUri = `ipfs://${mockHash}`;
    
    console.log('Mock IPFS upload:', metadata);
    console.log('Mock IPFS URI:', ipfsUri);
    
    return ipfsUri;
  }

  private async executeMintTransaction(
    contractAddress: string,
    to: string,
    metadataUri: string
  ): Promise<{ success: boolean; tokenId?: string; transactionHash?: string; error?: string }> {
    try {
      // Mock blockchain transaction - in production, use ethers.js or web3.js
      const tokenId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Mock NFT mint transaction:', {
        contractAddress,
        to,
        tokenId,
        metadataUri,
        transactionHash
      });

      return {
        success: true,
        tokenId,
        transactionHash
      };

    } catch (error) {
      return {
        success: false,
        error: `Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async getTokenOwner(contractAddress: string, tokenId: string): Promise<string | null> {
    // Mock implementation - in production, call ownerOf function on contract
    console.log(`Mock getTokenOwner: ${contractAddress}, ${tokenId}`);
    return `0x${Math.random().toString(16).substr(2, 40)}`;
  }

  private async getTokenBalance(contractAddress: string, walletAddress: string): Promise<number> {
    // Mock implementation - in production, call balanceOf function on contract
    console.log(`Mock getTokenBalance: ${contractAddress}, ${walletAddress}`);
    return Math.floor(Math.random() * 5); // Random balance 0-4
  }

  private async getTokensByOwner(contractAddress: string, walletAddress: string): Promise<string[]> {
    // Mock implementation - in production, iterate through tokens or use indexing service
    console.log(`Mock getTokensByOwner: ${contractAddress}, ${walletAddress}`);
    const balance = await this.getTokenBalance(contractAddress, walletAddress);
    return Array.from({ length: balance }, (_, i) => `${Date.now() + i}`);
  }

  private async getTokenURI(contractAddress: string, tokenId: string): Promise<string | null> {
    // Mock implementation - in production, call tokenURI function on contract
    console.log(`Mock getTokenURI: ${contractAddress}, ${tokenId}`);
    return `ipfs://QmX${Math.random().toString(36).substr(2, 44)}`;
  }

  private async fetchMetadataFromURI(uri: string): Promise<NFTMetadata> {
    // Mock implementation - in production, fetch from IPFS or HTTP
    console.log(`Mock fetchMetadataFromURI: ${uri}`);
    return {
      name: 'Mock NFT',
      description: 'This is a mock NFT for testing',
      image: 'ipfs://QmMockImage123',
      attributes: [
        { trait_type: 'Rarity', value: 'Common' },
        { trait_type: 'Type', value: 'Ticket' }
      ]
    };
  }

  private isValidEthereumAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
}