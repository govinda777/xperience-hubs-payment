import { User } from '../entities/User';

export interface IUserRepository {
  // CRUD Operations
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByPrivyId(privyId: string): Promise<User | null>;
  findByWalletAddress(address: string): Promise<User | null>;
  update(id: string, updates: Partial<User>): Promise<User>;
  delete(id: string): Promise<boolean>;
  
  // Query Operations
  findAll(): Promise<User[]>;
  findActive(): Promise<User[]>;
  findByStatus(isActive: boolean): Promise<User[]>;
  
  // Search Operations
  search(query: string): Promise<User[]>;
  searchByEmail(email: string): Promise<User[]>;
  searchByWallet(address: string): Promise<User[]>;
  
  // Wallet Operations
  addWallet(userId: string, walletAddress: string, network: string): Promise<User>;
  removeWallet(userId: string, walletAddress: string): Promise<User>;
  updateWallet(userId: string, walletAddress: string, updates: any): Promise<User>;
  getWallets(userId: string): Promise<any[]>;
  
  // Profile Operations
  updateProfile(userId: string, profile: any): Promise<User>;
  updatePreferences(userId: string, preferences: any): Promise<User>;
  
  // Analytics Operations
  getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    withWallets: number;
    averageWalletsPerUser: number;
  }>;
  
  // Pagination
  findWithPagination(
    page: number,
    limit: number,
    filters?: {
      isActive?: boolean;
      hasWallets?: boolean;
      network?: string;
    }
  ): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  
  // User Activity
  getActiveUsers(limit?: number): Promise<User[]>;
  getRecentUsers(limit?: number): Promise<User[]>;
  
  // Wallet Analytics
  getUsersByNetwork(network: string): Promise<User[]>;
  getUsersWithMultipleWallets(): Promise<User[]>;
} 