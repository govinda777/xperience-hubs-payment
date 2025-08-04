import { Product } from '../../entities/Product';
import { IProductRepository } from '../../repositories/IProductRepository';
import { IMerchantRepository } from '../../repositories/IMerchantRepository';

export interface GetProductCatalogRequest {
  merchantId?: string;
  contractAddress?: string;
  category?: string;
  isActive?: boolean;
  availability?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  searchTerm?: string;
}

export interface GetProductCatalogResponse {
  success: boolean;
  products?: Product[];
  total?: number;
  page?: number;
  totalPages?: number;
  error?: string;
}

export class GetProductCatalogUseCase {
  constructor(
    private productRepository: IProductRepository,
    private merchantRepository: IMerchantRepository
  ) {}

  async execute(request: GetProductCatalogRequest): Promise<GetProductCatalogResponse> {
    try {
      let merchantId = request.merchantId;

      // If contract address is provided, get merchant ID
      if (request.contractAddress && !merchantId) {
        const merchant = await this.merchantRepository.findByContractAddress(request.contractAddress);
        if (!merchant) {
          return {
            success: false,
            error: 'Merchant not found for the provided contract address'
          };
        }
        merchantId = merchant.id;
      }

      if (!merchantId) {
        return {
          success: false,
          error: 'Merchant ID or contract address is required'
        };
      }

      // Set defaults for pagination
      const page = request.page || 1;
      const limit = request.limit || 20;
      const offset = (page - 1) * limit;

      // Build filter criteria
      const filters: any = {
        merchantId,
        isActive: request.isActive,
        category: request.category,
        availability: request.availability
      };

      // Remove undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key] === undefined) {
          delete filters[key];
        }
      });

      // Get products from repository
      const { products, total } = await this.productRepository.findMany({
        filters,
        searchTerm: request.searchTerm,
        sortBy: request.sortBy || 'createdAt',
        sortOrder: request.sortOrder || 'desc',
        limit,
        offset
      });

      // Filter products based on additional criteria
      let filteredProducts = products;

      // Apply search term filtering if not handled by repository
      if (request.searchTerm && filteredProducts.length > 0) {
        const searchLower = request.searchTerm.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
        );
      }

      // Sort products if not handled by repository
      if (request.sortBy && filteredProducts.length > 0) {
        filteredProducts = this.sortProducts(filteredProducts, request.sortBy, request.sortOrder || 'desc');
      }

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        products: filteredProducts,
        total,
        page,
        totalPages
      };

    } catch (error) {
      return {
        success: false,
        error: `Failed to get product catalog: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private sortProducts(products: Product[], sortBy: string, sortOrder: string): Product[] {
    return products.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price.amount;
          bValue = b.price.amount;
          break;
        case 'createdAt':
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case 'updatedAt':
          aValue = a.updatedAt.getTime();
          bValue = b.updatedAt.getTime();
          break;
        default:
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }
}