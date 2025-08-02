export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes?: NFTAttribute[];
  animation_url?: string;
  background_color?: string;
  youtube_url?: string;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
  display_type?: 'number' | 'boost_number' | 'boost_percentage' | 'date';
  max_value?: number;
}

export interface NFT {
  tokenId: string;
  contractAddress: string;
  owner: string;
  metadata: NFTMetadata;
  tokenURI: string;
  mintedAt: Date;
  transactionHash: string;
  blockNumber: number;
}

export interface NFTCollection {
  contractAddress: string;
  name: string;
  symbol: string;
  description: string;
  totalSupply: number;
  owner: string;
  baseURI: string;
  metadata?: NFTMetadata;
}

export interface NFTTransfer {
  from: string;
  to: string;
  tokenId: string;
  contractAddress: string;
  transactionHash: string;
  blockNumber: number;
  timestamp: Date;
}

export interface NFTMintEvent {
  to: string;
  tokenId: string;
  contractAddress: string;
  transactionHash: string;
  blockNumber: number;
  timestamp: Date;
  metadata?: NFTMetadata;
}

export interface NFTApproval {
  owner: string;
  approved: string;
  tokenId: string;
  contractAddress: string;
  transactionHash: string;
  blockNumber: number;
}

export interface NFTApprovalForAll {
  owner: string;
  operator: string;
  approved: boolean;
  contractAddress: string;
  transactionHash: string;
  blockNumber: number;
}

export interface NFTTokenURI {
  tokenId: string;
  contractAddress: string;
  uri: string;
  metadata?: NFTMetadata;
}

export interface NFTBalance {
  contractAddress: string;
  tokenIds: string[];
  balance: number;
}

export interface NFTContractInfo {
  address: string;
  name: string;
  symbol: string;
  totalSupply: number;
  owner: string;
  baseURI: string;
  contractURI?: string;
}

export interface NFTMintOptions {
  to: string;
  tokenURI: string;
  metadata?: NFTMetadata;
  gasLimit?: string;
  gasPrice?: string;
}

export interface NFTTransferOptions {
  from: string;
  to: string;
  tokenId: string;
  gasLimit?: string;
  gasPrice?: string;
}

export interface NFTApprovalOptions {
  to: string;
  tokenId: string;
  gasLimit?: string;
  gasPrice?: string;
}

export interface NFTApprovalForAllOptions {
  operator: string;
  approved: boolean;
  gasLimit?: string;
  gasPrice?: string;
}

export interface NFTQueryOptions {
  owner?: string;
  contractAddress?: string;
  tokenIds?: string[];
  limit?: number;
  offset?: number;
}

export interface NFTEventFilter {
  contractAddress?: string;
  owner?: string;
  fromBlock?: number;
  toBlock?: number;
  eventName?: 'Transfer' | 'Mint' | 'Approval' | 'ApprovalForAll';
} 