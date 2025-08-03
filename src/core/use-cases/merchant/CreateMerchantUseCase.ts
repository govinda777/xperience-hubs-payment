import { Merchant } from '../../entities/Merchant';
import { IMerchantRepository } from '../../repositories/IMerchantRepository';
import { IBlockchainService } from '../../services/IBlockchainService';

export interface CreateMerchantRequest {
  name: string;
  cnpj: string;
  pixKey: string;
  description: string;
  logo?: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    logo?: string;
  };
  contact: {
    email: string;
    phone?: string;
    website?: string;
    socialMedia?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
      linkedin?: string;
    };
  };
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  settings?: {
    isActive?: boolean;
    autoApproveOrders?: boolean;
    requireNFTValidation?: boolean;
    allowRefunds?: boolean;
    maxRefundDays?: number;
    notificationEmail?: boolean;
    notificationSMS?: boolean;
    webhookUrl?: string;
  };
}

export interface CreateMerchantResponse {
  success: boolean;
  merchant?: Merchant;
  error?: string;
}

export class CreateMerchantUseCase {
  constructor(
    private merchantRepository: IMerchantRepository,
    private blockchainService: IBlockchainService
  ) {}

  async execute(request: CreateMerchantRequest): Promise<CreateMerchantResponse> {
    try {
      // Validate input
      const validationResult = this.validateRequest(request);
      if (!validationResult.isValid) {
        return {
          success: false,
          error: validationResult.error
        };
      }

      // Check if merchant already exists
      const existingMerchant = await this.merchantRepository.findByCnpj(request.cnpj);
      if (existingMerchant) {
        return {
          success: false,
          error: 'Merchant with this CNPJ already exists'
        };
      }

      // Check if PIX key is already in use
      const existingPixKey = await this.merchantRepository.findByPixKey(request.pixKey);
      if (existingPixKey) {
        return {
          success: false,
          error: 'PIX key is already in use by another merchant'
        };
      }

      // Deploy smart contract for merchant
      const contractResult = await this.deployMerchantContract(request);
      if (!contractResult.success) {
        return {
          success: false,
          error: `Failed to deploy smart contract: ${contractResult.error}`
        };
      }

      // Create merchant entity
      const merchant = new Merchant({
        id: this.generateMerchantId(),
        contractAddress: contractResult.contractAddress!,
        name: request.name,
        cnpj: request.cnpj,
        pixKey: request.pixKey,
        description: request.description,
        logo: request.logo,
        theme: request.theme,
        contact: request.contact,
        address: request.address,
        settings: {
          isActive: true,
          autoApproveOrders: false,
          requireNFTValidation: true,
          allowRefunds: true,
          maxRefundDays: 7,
          notificationEmail: true,
          notificationSMS: false,
          ...request.settings
        },
        stats: {
          totalSales: { amount: 0, currency: 'BRL', formatted: 'R$ 0,00' },
          totalOrders: 0,
          averageOrderValue: { amount: 0, currency: 'BRL', formatted: 'R$ 0,00' },
          totalCustomers: 0,
          totalProducts: 0,
          totalNFTsMinted: 0
        }
      });

      // Save merchant to repository
      const savedMerchant = await this.merchantRepository.create(merchant);

      return {
        success: true,
        merchant: savedMerchant
      };

    } catch (error) {
      return {
        success: false,
        error: `Failed to create merchant: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private validateRequest(request: CreateMerchantRequest): { isValid: boolean; error?: string } {
    // Validate required fields
    if (!request.name || request.name.trim().length < 2) {
      return { isValid: false, error: 'Name must be at least 2 characters long' };
    }

    if (!request.cnpj || !this.isValidCNPJ(request.cnpj)) {
      return { isValid: false, error: 'Invalid CNPJ format' };
    }

    if (!request.pixKey || !this.isValidPixKey(request.pixKey)) {
      return { isValid: false, error: 'Invalid PIX key format' };
    }

    if (!request.description || request.description.trim().length < 10) {
      return { isValid: false, error: 'Description must be at least 10 characters long' };
    }

    if (!request.contact.email || !this.isValidEmail(request.contact.email)) {
      return { isValid: false, error: 'Invalid email format' };
    }

    // Validate theme colors
    if (!this.isValidColor(request.theme.primaryColor)) {
      return { isValid: false, error: 'Invalid primary color format' };
    }

    if (!this.isValidColor(request.theme.secondaryColor)) {
      return { isValid: false, error: 'Invalid secondary color format' };
    }

    return { isValid: true };
  }

  private async deployMerchantContract(request: CreateMerchantRequest): Promise<{
    success: boolean;
    contractAddress?: string;
    error?: string;
  }> {
    try {
      // This would contain the actual smart contract deployment logic
      // For now, we'll simulate it
      const mockContractAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
      
      return {
        success: true,
        contractAddress: mockContractAddress
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private generateMerchantId(): string {
    return `merchant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private isValidCNPJ(cnpj: string): boolean {
    // Remove non-numeric characters
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    
    // Check if it has 14 digits
    if (cleanCNPJ.length !== 14) return false;
    
    // Check if all digits are the same
    if (/^(\d)\1+$/.test(cleanCNPJ)) return false;
    
    // Validate CNPJ algorithm
    let sum = 0;
    let weight = 2;
    
    for (let i = 11; i >= 0; i--) {
      sum += parseInt(cleanCNPJ[i]) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    
    const digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    
    sum = 0;
    weight = 2;
    
    for (let i = 12; i >= 0; i--) {
      sum += parseInt(cleanCNPJ[i]) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    
    const digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    
    return parseInt(cleanCNPJ[12]) === digit1 && parseInt(cleanCNPJ[13]) === digit2;
  }

  private isValidPixKey(pixKey: string): boolean {
    // PIX key can be email, CPF, CNPJ, phone, or random key
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;
    const cnpjRegex = /^\d{2}\.?\d{3}\.?\d{3}\/?0001-?\d{2}$/;
    const phoneRegex = /^\+55\d{10,11}$/;
    const randomKeyRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    return emailRegex.test(pixKey) ||
           cpfRegex.test(pixKey) ||
           cnpjRegex.test(pixKey) ||
           phoneRegex.test(pixKey) ||
           randomKeyRegex.test(pixKey);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidColor(color: string): boolean {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const rgbRegex = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
    const rgbaRegex = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[0-9.]+\s*\)$/;
    
    return hexRegex.test(color) || rgbRegex.test(color) || rgbaRegex.test(color);
  }
} 