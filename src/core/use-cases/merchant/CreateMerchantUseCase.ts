import { Merchant, MerchantTheme, MerchantContact, MerchantAddress, MerchantSettings } from '../../entities/Merchant';
import { IMerchantRepository } from '../../repositories/IMerchantRepository';
import { IBlockchainService } from '../../services/IBlockchainService';

export interface CreateMerchantRequest {
  name: string;
  cnpj: string;
  pixKey: string;
  description: string;
  logo?: string;
  theme?: Partial<MerchantTheme>;
  contact: MerchantContact;
  address: MerchantAddress;
  settings?: Partial<MerchantSettings>;
}

export interface CreateMerchantResponse {
  success: boolean;
  merchant?: Merchant;
  contractAddress?: string;
  error?: string;
}

export class CreateMerchantUseCase {
  constructor(
    private merchantRepository: IMerchantRepository,
    private blockchainService: IBlockchainService
  ) {}

  async execute(request: CreateMerchantRequest): Promise<CreateMerchantResponse> {
    try {
      // Validate required fields
      if (!request.name || !request.cnpj || !request.pixKey) {
        return {
          success: false,
          error: 'Name, CNPJ, and PIX key are required'
        };
      }

      // Validate email format
      if (!this.isValidEmail(request.contact.email)) {
        return {
          success: false,
          error: 'Invalid email format'
        };
      }

      // Check if merchant with CNPJ already exists
      const existingMerchant = await this.merchantRepository.findByCNPJ(request.cnpj);
      if (existingMerchant) {
        return {
          success: false,
          error: 'Merchant with this CNPJ already exists'
        };
      }

      // Deploy smart contract for the merchant
      const contractDeployment = await this.blockchainService.deployMerchantContract({
        name: request.name,
        pixKey: request.pixKey,
        description: request.description
      });

      if (!contractDeployment.success || !contractDeployment.contractAddress) {
        return {
          success: false,
          error: `Failed to deploy smart contract: ${contractDeployment.error}`
        };
      }

      // Generate merchant ID
      const merchantId = `merchant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create merchant entity
      const merchant = new Merchant({
        id: merchantId,
        contractAddress: contractDeployment.contractAddress,
        name: request.name,
        cnpj: request.cnpj,
        pixKey: request.pixKey,
        description: request.description,
        logo: request.logo,
        theme: {
          primaryColor: '#3b82f6',
          secondaryColor: '#64748b',
          backgroundColor: '#ffffff',
          textColor: '#1f2937',
          fontFamily: 'Inter, sans-serif',
          ...request.theme
        },
        contact: request.contact,
        address: request.address,
        settings: request.settings
      });

      // Save merchant to repository
      const savedMerchant = await this.merchantRepository.save(merchant);

      return {
        success: true,
        merchant: savedMerchant,
        contractAddress: contractDeployment.contractAddress
      };

    } catch (error) {
      return {
        success: false,
        error: `Failed to create merchant: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}