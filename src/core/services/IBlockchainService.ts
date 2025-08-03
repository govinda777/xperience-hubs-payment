import { Network, Transaction, WalletInfo } from '@/types/blockchain';

export interface SmartContractCall {
  contractAddress: string;
  abi: any[];
  method: string;
  params: any[];
  value?: string;
  gasLimit?: number;
}

export interface SmartContractDeploy {
  abi: any[];
  bytecode: string;
  params: any[];
  value?: string;
  gasLimit?: number;
}

export interface IBlockchainService {
  // Network Operations
  getCurrentNetwork(): Promise<Network>;
  
  switchNetwork(network: Network): Promise<boolean>;
  
  getSupportedNetworks(): Network[];
  
  // Wallet Operations
  connectWallet(): Promise<WalletInfo>;
  
  disconnectWallet(): Promise<void>;
  
  getWalletInfo(): Promise<WalletInfo | null>;
  
  signMessage(message: string): Promise<string>;
  
  signTransaction(transaction: any): Promise<string>;
  
  // Balance Operations
  getBalance(address: string): Promise<string>;
  
  getTokenBalance(
    tokenAddress: string,
    walletAddress: string
  ): Promise<string>;
  
  // Transaction Operations
  sendTransaction(transaction: {
    to: string;
    value: string;
    data?: string;
    gasLimit?: number;
  }): Promise<Transaction>;
  
  getTransaction(hash: string): Promise<Transaction | null>;
  
  getTransactionReceipt(hash: string): Promise<any>;
  
  // Smart Contract Operations
  callContract(call: SmartContractCall): Promise<any>;
  
  sendContractTransaction(call: SmartContractCall): Promise<Transaction>;
  
  deployContract(deploy: SmartContractDeploy): Promise<{
    success: boolean;
    contractAddress?: string;
    transactionHash?: string;
    error?: string;
  }>;
  
  // Gas Operations
  estimateGas(transaction: any): Promise<number>;
  
  getGasPrice(): Promise<string>;
  
  // Block Operations
  getLatestBlock(): Promise<any>;
  
  getBlock(blockNumber: number): Promise<any>;
  
  getBlockNumber(): Promise<number>;
  
  // Event Operations
  getEvents(
    contractAddress: string,
    eventName: string,
    fromBlock?: number,
    toBlock?: number
  ): Promise<any[]>;
  
  listenToEvents(
    contractAddress: string,
    eventName: string,
    callback: (event: any) => void
  ): Promise<void>;
  
  // Validation Operations
  validateAddress(address: string): Promise<boolean>;
  
  validateTransaction(hash: string): Promise<boolean>;
  
  // Analytics
  getNetworkStats(): Promise<{
    blockNumber: number;
    gasPrice: string;
    totalTransactions: number;
    averageBlockTime: number;
  }>;
} 