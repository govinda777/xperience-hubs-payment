import { Order, OrderStatus, OrderItem } from '../../entities/Order';
import { IOrderRepository } from '../../repositories/IOrderRepository';
import { IProductRepository } from '../../repositories/IProductRepository';
import { IPaymentService } from '../../services/IPaymentService';
import { Money } from '../../../types/payment';

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  merchantId: string;
  userId: string;
  items: CartItem[];
  paymentMethod: 'pix' | 'credit_card' | 'crypto';
  userWalletAddress?: string;
  customerInfo?: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface CreateOrderResponse {
  success: boolean;
  order?: Order;
  paymentData?: {
    pixQrCode?: string;
    paymentId: string;
    expiresAt: Date;
  };
  error?: string;
}

export class CreateOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private productRepository: IProductRepository,
    private paymentService: IPaymentService
  ) {}

  async execute(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      // Validate required fields
      if (!request.merchantId || !request.userId || !request.items || request.items.length === 0) {
        return {
          success: false,
          error: 'Merchant ID, user ID, and items are required'
        };
      }

      // Validate and prepare order items
      const orderItems: OrderItem[] = [];
      let totalAmount = 0;

      for (const cartItem of request.items) {
        const product = await this.productRepository.findById(cartItem.productId);
        if (!product) {
          return {
            success: false,
            error: `Product ${cartItem.productId} not found`
          };
        }

        if (!product.isActive) {
          return {
            success: false,
            error: `Product ${product.name} is not available`
          };
        }

        if (product.stock !== undefined && product.stock < cartItem.quantity) {
          return {
            success: false,
            error: `Insufficient stock for product ${product.name}`
          };
        }

        const orderItem: OrderItem = {
          productId: product.id,
          productName: product.name,
          quantity: cartItem.quantity,
          unitPrice: product.price,
          totalPrice: {
            amount: product.price.amount * cartItem.quantity,
            currency: product.price.currency,
            formatted: this.formatMoney(product.price.amount * cartItem.quantity, product.price.currency)
          }
        };

        orderItems.push(orderItem);
        totalAmount += orderItem.totalPrice.amount;
      }

      // Calculate total
      const total: Money = {
        amount: totalAmount,
        currency: 'BRL',
        formatted: this.formatMoney(totalAmount, 'BRL')
      };

      // Generate order ID
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create order entity
      const order = new Order({
        id: orderId,
        merchantId: request.merchantId,
        userId: request.userId,
        items: orderItems,
        total,
        status: 'pending' as OrderStatus,
        paymentMethod: request.paymentMethod,
        userWalletAddress: request.userWalletAddress,
        customerInfo: request.customerInfo
      });

      // Save order
      const savedOrder = await this.orderRepository.save(order);

      // Generate payment data
      let paymentData;
      if (request.paymentMethod === 'pix') {
        const pixResult = await this.paymentService.generatePixQRCode({
          orderId: savedOrder.id,
          amount: total.amount,
          merchantId: request.merchantId,
          description: `Order ${savedOrder.id}`,
          expiresInMinutes: 15
        });

        if (!pixResult.success) {
          return {
            success: false,
            error: `Failed to generate PIX payment: ${pixResult.error}`
          };
        }

        paymentData = {
          pixQrCode: pixResult.qrCode,
          paymentId: pixResult.paymentId,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
        };
      }

      return {
        success: true,
        order: savedOrder,
        paymentData
      };

    } catch (error) {
      return {
        success: false,
        error: `Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private formatMoney(amount: number, currency: string): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(amount / 100); // Convert from cents
  }
}