import { Product } from '../entities/Product';

export interface IProductRepository {
  // CRUD Operations
  create(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findByMerchantId(merchantId: string): Promise<Product[]>;
  update(id: string, updates: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<boolean>;
  
  // Query Operations
  findAll(): Promise<Product[]>;
  findActive(): Promise<Product[]>;
  findByStatus(isActive: boolean): Promise<Product[]>;
  findByCategory(category: string): Promise<Product[]>;
  findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]>;
  findByNFTEnabled(enabled: boolean): Promise<Product[]>;
  
  // Search Operations
  search(query: string): Promise<Product[]>;
  searchByMerchant(merchantId: string, query: string): Promise<Product[]>;
  
  // Filter Operations
  findByFilters(filters: {
    merchantId?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    isActive?: boolean;
    hasNFT?: boolean;
    inStock?: boolean;
  }): Promise<Product[]>;
  
  // Analytics Operations
  getStats(merchantId?: string): Promise<{
    total: number;
    active: number;
    inactive: number;
    withNFT: number;
    averagePrice: number;
    totalValue: number;
  }>;
  
  // Inventory Operations
  updateStock(productId: string, quantity: number): Promise<Product>;
  checkAvailability(productId: string, requestedQuantity: number): Promise<boolean>;
  
  // Pagination
  findWithPagination(
    page: number,
    limit: number,
    filters?: {
      merchantId?: string;
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      isActive?: boolean;
      hasNFT?: boolean;
      inStock?: boolean;
    }
  ): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  
  // Related Products
  findRelatedProducts(productId: string, limit?: number): Promise<Product[]>;
  findSimilarProducts(productId: string, limit?: number): Promise<Product[]>;
} 