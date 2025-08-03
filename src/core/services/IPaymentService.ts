import { Money } from '@/types/payment';

export interface PixTransaction {
  id: string;
  amount: Money;
  pixKey: string;
  description: string;
  merchantId: string;
  orderId?: string;
  status: 'pending' | 'completed' | 'failed' | 'expired';
  qrCode: string;
  qrCodeText: string;
  expiresAt: Date;
  createdAt: Date;
  completedAt?: Date;
}

export interface PixSplit {
  merchantAmount: Money;
  platformAmount: Money;
  merchantPercentage: number;
  platformPercentage: number;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  pixTransaction?: PixTransaction;
  split?: PixSplit;
}

export interface IPaymentService {
  // PIX Operations
  createPixTransaction(
    amount: Money,
    pixKey: string,
    description: string,
    merchantId: string,
    orderId?: string
  ): Promise<PixTransaction>;
  
  getPixTransaction(transactionId: string): Promise<PixTransaction | null>;
  
  checkPixStatus(transactionId: string): Promise<'pending' | 'completed' | 'failed' | 'expired'>;
  
  // Split Payment
  calculateSplit(
    totalAmount: Money,
    merchantPercentage: number
  ): Promise<PixSplit>;
  
  processSplitPayment(
    totalAmount: Money,
    merchantPixKey: string,
    platformPixKey: string,
    description: string,
    merchantId: string,
    orderId?: string
  ): Promise<PaymentResult>;
  
  // QR Code Generation
  generatePixQRCode(
    amount: Money,
    pixKey: string,
    description: string,
    merchantName: string
  ): Promise<{
    qrCode: string;
    qrCodeText: string;
  }>;
  
  // Webhook Handling
  handlePixWebhook(webhookData: any): Promise<PaymentResult>;
  
  // Validation
  validatePixKey(pixKey: string): Promise<boolean>;
  validateAmount(amount: Money): Promise<boolean>;
  
  // Analytics
  getPaymentStats(merchantId?: string, period?: string): Promise<{
    totalTransactions: number;
    totalAmount: Money;
    successRate: number;
    averageAmount: Money;
  }>;
} 