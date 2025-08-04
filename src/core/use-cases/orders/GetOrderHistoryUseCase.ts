import { Order } from '../../entities/Order';
import { IOrderRepository } from '../../repositories/IOrderRepository';
import { IUserRepository } from '../../repositories/IUserRepository';
import { IMerchantRepository } from '../../repositories/IMerchantRepository';

export interface GetOrderHistoryRequest {
  userId?: string;
  merchantId?: string;
  contractAddress?: string;
  status?: string;
  paymentMethod?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'total' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface GetOrderHistoryResponse {
  success: boolean;
  orders?: Order[];
  total?: number;
  page?: number;
  totalPages?: number;
  error?: string;
}

export class GetOrderHistoryUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private userRepository: IUserRepository,
    private merchantRepository: IMerchantRepository
  ) {}

  async execute(request: GetOrderHistoryRequest): Promise<GetOrderHistoryResponse> {
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

      // Validate that either user ID or merchant ID is provided
      if (!request.userId && !merchantId) {
        return {
          success: false,
          error: 'User ID or merchant ID/contract address is required'
        };
      }

      // Validate user exists if user ID is provided
      if (request.userId) {
        const user = await this.userRepository.findById(request.userId);
        if (!user) {
          return {
            success: false,
            error: 'User not found'
          };
        }
      }

      // Validate merchant exists if merchant ID is provided
      if (merchantId) {
        const merchant = await this.merchantRepository.findById(merchantId);
        if (!merchant) {
          return {
            success: false,
            error: 'Merchant not found'
          };
        }
      }

      // Set defaults for pagination
      const page = request.page || 1;
      const limit = request.limit || 20;
      const offset = (page - 1) * limit;

      // Build filter criteria
      const filters: any = {
        userId: request.userId,
        merchantId,
        status: request.status,
        paymentMethod: request.paymentMethod,
        startDate: request.startDate,
        endDate: request.endDate
      };

      // Remove undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key] === undefined) {
          delete filters[key];
        }
      });

      // Get orders from repository
      const { orders, total } = await this.orderRepository.findMany({
        filters,
        sortBy: request.sortBy || 'createdAt',
        sortOrder: request.sortOrder || 'desc',
        limit,
        offset
      });

      // Additional filtering if needed
      let filteredOrders = orders;

      // Filter by date range if not handled by repository
      if (request.startDate || request.endDate) {
        filteredOrders = filteredOrders.filter(order => {
          const orderDate = order.createdAt;
          if (request.startDate && orderDate < request.startDate) {
            return false;
          }
          if (request.endDate && orderDate > request.endDate) {
            return false;
          }
          return true;
        });
      }

      // Sort orders if not handled by repository
      if (request.sortBy && filteredOrders.length > 0) {
        filteredOrders = this.sortOrders(filteredOrders, request.sortBy, request.sortOrder || 'desc');
      }

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        orders: filteredOrders,
        total,
        page,
        totalPages
      };

    } catch (error) {
      return {
        success: false,
        error: `Failed to get order history: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private sortOrders(orders: Order[], sortBy: string, sortOrder: string): Order[] {
    return orders.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'createdAt':
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case 'updatedAt':
          aValue = a.updatedAt.getTime();
          bValue = b.updatedAt.getTime();
          break;
        case 'total':
          aValue = a.total.amount;
          bValue = b.total.amount;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
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