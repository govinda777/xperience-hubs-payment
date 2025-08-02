export interface Money {
  amount: number;
  currency: string;
  formatted: string;
}

export interface PixTransaction {
  id: string;
  qrCode: string;
  qrCodeText: string;
  amount: Money;
  description: string;
  expiresAt: Date;
  status: PixStatus;
  payer?: {
    name: string;
    document: string;
  };
  paidAt?: Date;
  transactionId?: string;
}

export type PixStatus = 
  | 'pending'
  | 'paid'
  | 'expired'
  | 'cancelled'
  | 'failed';

export interface PixSplit {
  totalAmount: Money;
  splits: PixSplitItem[];
  merchantAmount: Money;
  platformAmount: Money;
}

export interface PixSplitItem {
  id: string;
  name: string;
  amount: Money;
  percentage: number;
  type: 'merchant' | 'platform';
}

export interface PaymentMethod {
  id: string;
  type: 'pix' | 'credit_card' | 'debit_card' | 'bank_transfer';
  name: string;
  description: string;
  icon: string;
  isEnabled: boolean;
  fees?: {
    percentage: number;
    fixed: Money;
  };
}

export interface PaymentGateway {
  id: string;
  name: string;
  type: 'pix' | 'credit_card' | 'crypto';
  isEnabled: boolean;
  config: Record<string, any>;
  supportedCurrencies: string[];
  supportedNetworks?: string[];
}

export interface PaymentWebhook {
  id: string;
  event: string;
  data: any;
  signature: string;
  timestamp: Date;
  processed: boolean;
  processedAt?: Date;
}

export interface PaymentRefund {
  id: string;
  originalTransactionId: string;
  amount: Money;
  reason: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
}

export interface PaymentFee {
  type: 'percentage' | 'fixed' | 'mixed';
  percentage?: number;
  fixed?: Money;
  minimum?: Money;
  maximum?: Money;
}

export interface PaymentConfig {
  enabledMethods: string[];
  defaultCurrency: string;
  supportedCurrencies: string[];
  fees: Record<string, PaymentFee>;
  webhookUrl?: string;
  webhookSecret?: string;
  splitConfig?: {
    platformPercentage: number;
    platformFixed?: Money;
  };
}

export interface PaymentValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface PaymentReceipt {
  id: string;
  transactionId: string;
  amount: Money;
  method: string;
  status: string;
  createdAt: Date;
  metadata: Record<string, any>;
}

export interface PaymentAnalytics {
  totalTransactions: number;
  totalAmount: Money;
  averageAmount: Money;
  successRate: number;
  methodBreakdown: Record<string, {
    count: number;
    amount: Money;
  }>;
  timeSeries: Array<{
    date: string;
    count: number;
    amount: Money;
  }>;
} 