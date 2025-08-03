import { Order } from '../entities/Order';

export interface IOrderRepository {
  // CRUD Operations
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findByMerchantId(merchantId: string): Promise<Order[]>;
  findByUserId(userId: string): Promise<Order[]>;
  update(id: string, updates: Partial<Order>): Promise<Order>;
  delete(id: string): Promise<boolean>;
  
  // Query Operations
  findAll(): Promise<Order[]>;
  findByStatus(status: string): Promise<Order[]>;
  findByType(type: string): Promise<Order[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Order[]>;
  findPending(): Promise<Order[]>;
  findCompleted(): Promise<Order[]>;
  findCancelled(): Promise<Order[]>;
  
  // Search Operations
  search(query: string): Promise<Order[]>;
  searchByMerchant(merchantId: string, query: string): Promise<Order[]>;
  searchByUser(userId: string, query: string): Promise<Order[]>;
  
  // Filter Operations
  findByFilters(filters: {
    merchantId?: string;
    userId?: string;
    status?: string;
    type?: string;
    startDate?: Date;
    endDate?: Date;
    minTotal?: number;
    maxTotal?: number;
    hasNFT?: boolean;
  }): Promise<Order[]>;
  
  // Analytics Operations
  getStats(merchantId?: string): Promise<{
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
    totalRevenue: number;
    averageOrderValue: number;
    totalItems: number;
  }>;
  
  // Order Management
  updateStatus(orderId: string, status: string): Promise<Order>;
  addNFTToken(orderId: string, tokenId: string, contractAddress: string): Promise<Order>;
  removeNFTToken(orderId: string, tokenId: string): Promise<Order>;
  
  // Pagination
  findWithPagination(
    page: number,
    limit: number,
    filters?: {
      merchantId?: string;
      userId?: string;
      status?: string;
      type?: string;
      startDate?: Date;
      endDate?: Date;
      minTotal?: number;
      maxTotal?: number;
      hasNFT?: boolean;
    }
  ): Promise<{
    orders: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  
  // Order History
  getOrderHistory(userId: string, limit?: number): Promise<Order[]>;
  getMerchantOrderHistory(merchantId: string, limit?: number): Promise<Order[]>;
  
  // Recent Orders
  getRecentOrders(merchantId?: string, limit?: number): Promise<Order[]>;
  getRecentUserOrders(userId: string, limit?: number): Promise<Order[]>;
} 