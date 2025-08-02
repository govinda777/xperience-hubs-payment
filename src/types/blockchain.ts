export interface Network {
  chainId: number;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasLimit: string;
  gasPrice: string;
  nonce: number;
  data?: string;
}

export interface TransactionReceipt {
  transactionHash: string;
  blockNumber: number;
  blockHash: string;
  gasUsed: string;
  status: number;
  logs: any[];
}

export interface Block {
  number: number;
  hash: string;
  timestamp: number;
  transactions: string[];
}

export interface GasEstimate {
  gasLimit: string;
  gasPrice: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
}

export interface WalletInfo {
  address: string;
  balance: string;
  nonce: number;
  chainId: number;
}

export interface ContractEvent {
  eventName: string;
  args: any[];
  blockNumber: number;
  transactionHash: string;
  logIndex: number;
}

export interface ContractCall {
  to: string;
  data: string;
  value?: string;
}

export interface ContractReadResult<T = any> {
  data: T;
  error?: string;
}

export interface ContractWriteResult {
  hash?: string;
  error?: string;
  receipt?: TransactionReceipt;
} 