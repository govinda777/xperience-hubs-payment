export interface SmartContract {
  address: string;
  abi: any[];
  bytecode?: string;
  deployedBytecode?: string;
}

export interface ContractConfig {
  address: string;
  abi: any[];
  network: string;
}

export interface ContractDeployment {
  contractName: string;
  address: string;
  network: string;
  deployer: string;
  transactionHash: string;
  blockNumber: number;
  constructorArgs?: any[];
}

export interface ContractFunction {
  name: string;
  inputs: ContractParameter[];
  outputs: ContractParameter[];
  stateMutability: 'pure' | 'view' | 'nonpayable' | 'payable';
  type: 'function' | 'constructor' | 'fallback' | 'receive';
}

export interface ContractEvent {
  name: string;
  inputs: ContractParameter[];
  type: 'event';
  anonymous: boolean;
}

export interface ContractParameter {
  name: string;
  type: string;
  indexed?: boolean;
  components?: ContractParameter[];
}

export interface ContractABI {
  functions: ContractFunction[];
  events: ContractEvent[];
  constructor?: ContractFunction;
  fallback?: ContractFunction;
  receive?: ContractFunction;
}

export interface ContractInstance {
  address: string;
  abi: any[];
  provider: any;
  signer?: any;
  functions: Record<string, (...args: any[]) => Promise<any>>;
  events: Record<string, any>;
}

export interface ContractCallOptions {
  from?: string;
  gasLimit?: string;
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  value?: string;
}

export interface ContractEventFilter {
  address?: string;
  topics?: (string | string[] | null)[];
  fromBlock?: number | string;
  toBlock?: number | string;
}

export interface ContractEventLog {
  eventName: string;
  args: any[];
  blockNumber: number;
  blockHash: string;
  transactionHash: string;
  logIndex: number;
  address: string;
  topics: string[];
  data: string;
}

export interface ContractReadOptions {
  blockTag?: number | string;
  from?: string;
}

export interface ContractWriteOptions extends ContractCallOptions {
  waitForConfirmation?: boolean;
  confirmations?: number;
}

export interface ContractDeployOptions {
  args?: any[];
  gasLimit?: string;
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  value?: string;
}

export interface ContractVerification {
  address: string;
  network: string;
  compilerVersion: string;
  optimization: boolean;
  runs: number;
  constructorArguments: any[];
  sourceCode: string;
} 