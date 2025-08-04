import { Product, ProductCategory, ProductAvailability } from '../../entities/Product';
import { IProductRepository } from '../../repositories/IProductRepository';
import { IMerchantRepository } from '../../repositories/IMerchantRepository';
import { IBlockchainService } from '../../services/IBlockchainService';
import { Money } from '../../../types/payment';

export interface CreateProductRequest {
  merchantId: string;
  name: string;
  description: string;
  price: Money;
  category: ProductCategory;
  images: string[];
  attributes?: Record<string, any>;
  availability?: ProductAvailability;
  stock?: number;
  maxSupply?: number;
  isActive?: boolean;
  nftConfig?: {
    collectionName: string;
    symbol: string;
    baseURI: string;
    royaltyPercentage: number;
  };
}

export interface CreateProductResponse {
  success: boolean;
  product?: Product;
  error?: string;
}

export class CreateProductUseCase {
  constructor(
    private productRepository: IProductRepository,
    private merchantRepository: IMerchantRepository,
    private blockchainService: IBlockchainService
  ) {}

  async execute(request: CreateProductRequest): Promise<CreateProductResponse> {
    try {
      // Validate required fields
      if (!request.merchantId || !request.name || !request.price || !request.category) {
        return {
          success: false,
          error: 'Merchant ID, name, price, and category are required'
        };
      }

      // Validate price
      if (request.price.amount <= 0) {
        return {
          success: false,
          error: 'Price must be greater than zero'
        };
      }

      // Check if merchant exists
      const merchant = await this.merchantRepository.findById(request.merchantId);
      if (!merchant) {
        return {
          success: false,
          error: 'Merchant not found'
        };
      }

      // Generate product ID
      const productId = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create product entity
      const product = new Product({
        id: productId,
        merchantId: request.merchantId,
        name: request.name,
        description: request.description,
        price: request.price,
        category: request.category,
        images: request.images || [],
        attributes: request.attributes || [],
        availability: request.availability || 'available',
        stock: request.stock,
        maxSupply: request.maxSupply,
        isActive: request.isActive !== false, // Default to true
        variants: [],
        seo: {
          title: request.name,
          description: request.description,
          keywords: []
        }
      });

      // Register product in smart contract if applicable
      if (merchant.contractAddress) {
        const contractResult = await this.blockchainService.addProduct(
          merchant.contractAddress,
          {
            productId: product.id,
            name: product.name,
            price: product.price.amount,
            category: product.category,
            maxSupply: product.maxSupply || 0,
            isActive: product.isActive
          }
        );

        if (!contractResult.success) {
          return {
            success: false,
            error: `Failed to register product in smart contract: ${contractResult.error}`
          };
        }
      }

      // Save product to repository
      const savedProduct = await this.productRepository.save(product);

      return {
        success: true,
        product: savedProduct
      };

    } catch (error) {
      return {
        success: false,
        error: `Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}