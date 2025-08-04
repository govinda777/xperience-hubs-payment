import { User } from '../entities/User';

export interface WalletConnectionResult {
  success: boolean;
  address?: string;
  error?: string;
}

export interface SignMessageRequest {
  message: string;
  address: string;
}

export interface SignMessageResult {
  success: boolean;
  signature?: string;
  error?: string;
}

export interface WalletBalance {
  address: string;
  balance: string;
  currency: string;
  usdValue?: number;
}

export interface TransactionRequest {
  to: string;
  value: string;
  data?: string;
  gasLimit?: string;
  gasPrice?: string;
}

export interface TransactionResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export interface IWalletService {
  /**
   * Connect to a wallet
   */
  connect(): Promise<WalletConnectionResult>;

  /**
   * Disconnect from wallet
   */
  disconnect(): Promise<void>;

  /**
   * Check if wallet is connected
   */
  isConnected(): boolean;

  /**
   * Get connected wallet address
   */
  getAddress(): string | null;

  /**
   * Get wallet balance
   */
  getBalance(address: string): Promise<WalletBalance>;

  /**
   * Sign a message with the connected wallet
   */
  signMessage(request: SignMessageRequest): Promise<SignMessageResult>;

  /**
   * Send a transaction
   */
  sendTransaction(request: TransactionRequest): Promise<TransactionResult>;

  /**
   * Get transaction receipt
   */
  getTransactionReceipt(transactionHash: string): Promise<any>;

  /**
   * Switch to a specific network
   */
  switchNetwork(chainId: number): Promise<boolean>;

  /**
   * Get current network
   */
  getCurrentNetwork(): Promise<number>;

  /**
   * Validate wallet address format
   */
  isValidAddress(address: string): boolean;

  /**
   * Get wallet provider
   */
  getProvider(): any;
}