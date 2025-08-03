import { NFT, NFTMetadata } from '@/types/nft';

export interface NFTMintRequest {
  productId: string;
  merchantId: string;
  userId: string;
  orderId: string;
  metadata: NFTMetadata;
  tokenType: 'ERC-721' | 'ERC-1155';
  quantity?: number;
}

export interface NFTMintResult {
  success: boolean;
  tokenId?: string;
  contractAddress?: string;
  transactionHash?: string;
  error?: string;
  nft?: NFT;
}

export interface NFTTransferRequest {
  tokenId: string;
  contractAddress: string;
  fromAddress: string;
  toAddress: string;
  quantity?: number;
}

export interface INFTService {
  // Minting Operations
  mintNFT(request: NFTMintRequest): Promise<NFTMintResult>;
  
  mintBatchNFTs(requests: NFTMintRequest[]): Promise<NFTMintResult[]>;
  
  // Transfer Operations
  transferNFT(request: NFTTransferRequest): Promise<{
    success: boolean;
    transactionHash?: string;
    error?: string;
  }>;
  
  // Query Operations
  getNFT(tokenId: string, contractAddress: string): Promise<NFT | null>;
  
  getNFTsByOwner(ownerAddress: string): Promise<NFT[]>;
  
  getNFTsByProduct(productId: string): Promise<NFT[]>;
  
  getNFTsByOrder(orderId: string): Promise<NFT[]>;
  
  getNFTsByMerchant(merchantId: string): Promise<NFT[]>;
  
  // Metadata Operations
  updateNFTMetadata(
    tokenId: string,
    contractAddress: string,
    metadata: Partial<NFTMetadata>
  ): Promise<boolean>;
  
  getNFTMetadata(tokenId: string, contractAddress: string): Promise<NFTMetadata | null>;
  
  // Validation Operations
  validateNFTOwnership(
    tokenId: string,
    contractAddress: string,
    ownerAddress: string
  ): Promise<boolean>;
  
  validateNFTAccess(
    tokenId: string,
    contractAddress: string,
    userAddress: string
  ): Promise<boolean>;
  
  // Analytics
  getNFTStats(merchantId?: string): Promise<{
    totalMinted: number;
    totalTransferred: number;
    uniqueOwners: number;
    averagePrice: number;
  }>;
  
  // Contract Operations
  deployNFTContract(
    name: string,
    symbol: string,
    baseURI: string,
    merchantId: string
  ): Promise<{
    success: boolean;
    contractAddress?: string;
    transactionHash?: string;
    error?: string;
  }>;
  
  // Events
  listenToNFTEvents(contractAddress: string): Promise<void>;
  
  getNFTEvents(
    contractAddress: string,
    eventType?: string,
    fromBlock?: number,
    toBlock?: number
  ): Promise<any[]>;
} 