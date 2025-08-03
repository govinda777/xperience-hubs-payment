import { Merchant } from '../entities/Merchant';

export interface IMerchantRepository {
  // CRUD Operations
  create(merchant: Merchant): Promise<Merchant>;
  findById(id: string): Promise<Merchant | null>;
  findByContractAddress(address: string): Promise<Merchant | null>;
  findByPixKey(pixKey: string): Promise<Merchant | null>;
  update(id: string, updates: Partial<Merchant>): Promise<Merchant>;
  delete(id: string): Promise<boolean>;
  
  // Query Operations
  findAll(): Promise<Merchant[]>;
  findActive(): Promise<Merchant[]>;
  findByStatus(isActive: boolean): Promise<Merchant[]>;
  findByCategory(category: string): Promise<Merchant[]>;
  
  // Search Operations
  search(query: string): Promise<Merchant[]>;
  findByLocation(city: string, state?: string): Promise<Merchant[]>;
  
  // Analytics Operations
  getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    totalSales: number;
    averageSales: number;
  }>;
  
  // Pagination
  findWithPagination(
    page: number,
    limit: number,
    filters?: {
      isActive?: boolean;
      category?: string;
      city?: string;
      state?: string;
    }
  ): Promise<{
    merchants: Merchant[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
} 