import { Merchant } from '../../entities/Merchant';
import { IMerchantRepository } from '../../repositories/IMerchantRepository';
import { IBlockchainService } from '../../services/IBlockchainService';

export interface GetMerchantDataRequest {
  contractAddress?: string;
  merchantId?: string;
  cnpj?: string;
  refreshFromBlockchain?: boolean;
}

export interface GetMerchantDataResponse {
  success: boolean;
  merchant?: Merchant;
  error?: string;
}

export class GetMerchantDataUseCase {
  constructor(
    private merchantRepository: IMerchantRepository,
    private blockchainService: IBlockchainService
  ) {}

  async execute(request: GetMerchantDataRequest): Promise<GetMerchantDataResponse> {
    try {
      if (!request.contractAddress && !request.merchantId && !request.cnpj) {
        return {
          success: false,
          error: 'Contract address, merchant ID, or CNPJ is required'
        };
      }

      let merchant: Merchant | null = null;

      // Try to find merchant by different criteria
      if (request.contractAddress) {
        merchant = await this.merchantRepository.findByContractAddress(request.contractAddress);
      } else if (request.merchantId) {
        merchant = await this.merchantRepository.findById(request.merchantId);
      } else if (request.cnpj) {
        merchant = await this.merchantRepository.findByCNPJ(request.cnpj);
      }

      if (!merchant) {
        return {
          success: false,
          error: 'Merchant not found'
        };
      }

      // Refresh data from blockchain if requested
      if (request.refreshFromBlockchain && merchant.contractAddress) {
        const blockchainData = await this.refreshMerchantFromBlockchain(merchant);
        if (blockchainData) {
          merchant = blockchainData;
          // Save updated data
          await this.merchantRepository.save(merchant);
        }
      }

      return {
        success: true,
        merchant
      };

    } catch (error) {
      return {
        success: false,
        error: `Failed to get merchant data: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async refreshMerchantFromBlockchain(merchant: Merchant): Promise<Merchant | null> {
    try {
      // Get merchant data from smart contract
      const contractData = await this.blockchainService.getMerchantData(merchant.contractAddress);
      
      if (!contractData.success || !contractData.data) {
        return null;
      }

      // Update merchant with blockchain data
      const blockchainMerchantData = contractData.data;
      
      merchant.updateProfile({
        name: blockchainMerchantData.name || merchant.name,
        description: blockchainMerchantData.description || merchant.description
      });

      if (blockchainMerchantData.pixKey) {
        merchant.updatePixKey(blockchainMerchantData.pixKey);
      }

      // Update stats from blockchain
      const stats = await this.getStatsFromBlockchain(merchant.contractAddress);
      if (stats) {
        merchant.updateStats(stats);
      }

      return merchant;

    } catch (error) {
      console.error('Failed to refresh merchant from blockchain:', error);
      return null;
    }
  }

  private async getStatsFromBlockchain(contractAddress: string): Promise<any> {
    try {
      // Get sales stats from blockchain events
      const salesData = await this.blockchainService.getSalesStats(contractAddress);
      
      if (!salesData.success) {
        return null;
      }

      return {
        totalSales: salesData.totalSales || { amount: 0, currency: 'BRL', formatted: 'R$ 0,00' },
        totalOrders: salesData.totalOrders || 0,
        averageOrderValue: salesData.averageOrderValue || { amount: 0, currency: 'BRL', formatted: 'R$ 0,00' },
        totalNFTsMinted: salesData.totalNFTsMinted || 0,
        lastOrderDate: salesData.lastOrderDate,
        lastPaymentDate: salesData.lastPaymentDate
      };

    } catch (error) {
      console.error('Failed to get stats from blockchain:', error);
      return null;
    }
  }
}