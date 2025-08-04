import { IPaymentService } from '../../core/services/IPaymentService';

export interface PixQRCodeRequest {
  orderId: string;
  amount: number; // Amount in cents
  merchantId: string;
  description: string;
  expiresInMinutes: number;
}

export interface PixQRCodeResponse {
  success: boolean;
  qrCode?: string;
  qrCodeImage?: string;
  paymentId: string;
  error?: string;
}

export interface PixPaymentValidationRequest {
  paymentId: string;
}

export interface PixPaymentValidationResponse {
  success: boolean;
  isPaid: boolean;
  amount?: number;
  paidAt?: Date;
  error?: string;
}

export interface PixSplitConfig {
  platformPercentage: number; // Percentage that goes to the platform
  merchantAccount: string; // Merchant's PIX key or account
  platformAccount: string; // Platform's PIX key or account
}

export class PixPaymentService implements IPaymentService {
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly splitConfig: PixSplitConfig;

  constructor(config: {
    apiUrl: string;
    apiKey: string;
    splitConfig: PixSplitConfig;
  }) {
    this.apiUrl = config.apiUrl;
    this.apiKey = config.apiKey;
    this.splitConfig = config.splitConfig;
  }

  async generatePixQRCode(request: PixQRCodeRequest): Promise<PixQRCodeResponse> {
    try {
      // Calculate split amounts
      const platformAmount = Math.floor(request.amount * (this.splitConfig.platformPercentage / 100));
      const merchantAmount = request.amount - platformAmount;

      // Prepare payment request with split
      const paymentRequest = {
        valor: request.amount / 100, // Convert cents to reais
        descricao: request.description,
        chave_pix: this.splitConfig.merchantAccount,
        txid: `txid_${request.orderId}_${Date.now()}`,
        split: {
          recebedores: [
            {
              chave_pix: this.splitConfig.merchantAccount,
              valor: merchantAmount / 100,
              descricao: `Merchant payment for order ${request.orderId}`
            },
            {
              chave_pix: this.splitConfig.platformAccount,
              valor: platformAmount / 100,
              descricao: `Platform fee for order ${request.orderId}`
            }
          ]
        },
        expires_in: request.expiresInMinutes * 60 // Convert to seconds
      };

      // Mock API call - in production, this would call actual PIX provider
      const response = await this.mockPixApiCall('create_charge', paymentRequest);

      if (response.success) {
        return {
          success: true,
          qrCode: response.qr_code,
          qrCodeImage: response.qr_code_image,
          paymentId: response.charge_id || `pix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
      } else {
        return {
          success: false,
          paymentId: '',
          error: response.error || 'Failed to generate PIX QR Code'
        };
      }

    } catch (error) {
      return {
        success: false,
        paymentId: '',
        error: `PIX service error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async validatePixPayment(request: PixPaymentValidationRequest): Promise<PixPaymentValidationResponse> {
    try {
      // Mock API call to check payment status
      const response = await this.mockPixApiCall('check_payment', { charge_id: request.paymentId });

      if (response.success) {
        return {
          success: true,
          isPaid: response.status === 'paid',
          amount: response.amount ? response.amount * 100 : undefined, // Convert to cents
          paidAt: response.paid_at ? new Date(response.paid_at) : undefined
        };
      } else {
        return {
          success: false,
          isPaid: false,
          error: response.error || 'Failed to validate payment'
        };
      }

    } catch (error) {
      return {
        success: false,
        isPaid: false,
        error: `PIX validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async processWebhook(payload: any): Promise<{ success: boolean; orderId?: string; status?: string }> {
    try {
      // Extract order ID from payment description or metadata
      const orderId = this.extractOrderIdFromPayload(payload);
      
      if (!orderId) {
        return { success: false };
      }

      // Determine payment status
      const status = payload.status || payload.event_type;
      
      return {
        success: true,
        orderId,
        status
      };

    } catch (error) {
      console.error('PIX webhook processing error:', error);
      return { success: false };
    }
  }

  private async mockPixApiCall(endpoint: string, data: any): Promise<any> {
    // Mock implementation for development/testing
    // In production, this would make actual HTTP requests to PIX provider
    
    console.log(`Mock PIX API call to ${endpoint}:`, data);
    
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay

    switch (endpoint) {
      case 'create_charge':
        return {
          success: true,
          qr_code: 'https://mock-pix-qr-code.example.com/abc123',
          qr_code_image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          charge_id: `charge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
      
      case 'check_payment':
        // Mock payment as paid 70% of the time for testing
        const isPaid = Math.random() > 0.3;
        return {
          success: true,
          status: isPaid ? 'paid' : 'pending',
          amount: isPaid ? data.valor : undefined,
          paid_at: isPaid ? new Date().toISOString() : undefined
        };
      
      default:
        return { success: false, error: 'Unknown endpoint' };
    }
  }

  private extractOrderIdFromPayload(payload: any): string | null {
    // Extract order ID from various possible locations in webhook payload
    return payload.order_id || 
           payload.external_id || 
           payload.custom_data?.order_id ||
           (payload.description?.match(/order[_\s]([a-zA-Z0-9_]+)/i)?.[1]) ||
           null;
  }
}