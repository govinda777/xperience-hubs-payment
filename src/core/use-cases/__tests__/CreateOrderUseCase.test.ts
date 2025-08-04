import { CreateOrderUseCase, CreateOrderRequest } from '../orders/CreateOrderUseCase';
import { IOrderRepository } from '../../repositories/IOrderRepository';
import { IProductRepository } from '../../repositories/IProductRepository';
import { IPaymentService } from '../../services/IPaymentService';
import { Order } from '../../entities/Order';

enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}
import { Product } from '../../entities/Product';
import { TestDataBuilder } from '../../../lib/bdd/helpers';

// Mock implementations
const mockOrderRepository: jest.Mocked<IOrderRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
  findByMerchantId: jest.fn(),
  findByUserId: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findAll: jest.fn(),
};

const mockProductRepository: jest.Mocked<IProductRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
  findByMerchantId: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findAll: jest.fn(),
};

const mockPaymentService: jest.Mocked<IPaymentService> = {
  generatePixQRCode: jest.fn(),
  validatePixPayment: jest.fn(),
};

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;
  let validRequest: CreateOrderRequest;
  let mockProduct: Product;

  beforeEach(() => {
    useCase = new CreateOrderUseCase(
      mockOrderRepository,
      mockProductRepository,
      mockPaymentService
    );

    mockProduct = TestDataBuilder.createProduct({
      id: 'product-1',
      name: 'Test Product',
      price: TestDataBuilder.createMoney(10000),
      isActive: true
    });

    validRequest = {
      merchantId: 'merchant-1',
      userId: 'user-1',
      items: [
        { productId: 'product-1', quantity: 2 }
      ],
      paymentMethod: 'pix',
      userWalletAddress: '0x123456789abcdef',
      customerInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+5511999999999'
      }
    };

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('GIVEN a valid order creation request', () => {
    beforeEach(() => {
      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockOrderRepository.save.mockResolvedValue(
        new Order({
          id: 'order-1',
          merchantId: validRequest.merchantId,
          userId: validRequest.userId,
          items: [{
            productId: 'product-1',
            productName: 'Test Product',
            quantity: 2,
            unitPrice: TestDataBuilder.createMoney(10000),
            totalPrice: TestDataBuilder.createMoney(20000)
          }],
          total: TestDataBuilder.createMoney(20000),
          status: 'pending' as const,
          paymentMethod: 'pix'
        })
      );
      mockPaymentService.generatePixQRCode.mockResolvedValue({
        success: true,
        qrCode: 'https://pix.example.com/qr123',
        paymentId: 'pix-123'
      });
    });

    it('WHEN creating an order with PIX payment THEN should successfully create order and generate PIX QR', async () => {
      const result = await useCase.execute(validRequest);

      expect(result.success).toBe(true);
      expect(result.order).toBeDefined();
      expect(result.order?.items).toHaveLength(1);
      expect(result.order?.total.amount).toBe(20000); // 10000 * 2
      expect(result.paymentData).toBeDefined();
      expect(result.paymentData?.pixQrCode).toBe('https://pix.example.com/qr123');
      expect(result.error).toBeUndefined();
    });

    it('WHEN creating an order THEN should validate product availability', async () => {
      await useCase.execute(validRequest);

      expect(mockProductRepository.findById).toHaveBeenCalledWith('product-1');
      expect(mockProductRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('WHEN creating an order THEN should save order to repository', async () => {
      await useCase.execute(validRequest);

      expect(mockOrderRepository.save).toHaveBeenCalledTimes(1);
      expect(mockOrderRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          merchantId: validRequest.merchantId,
          userId: validRequest.userId,
          status: 'pending' as const,
          paymentMethod: 'pix'
        })
      );
    });

    it('WHEN creating an order THEN should generate payment data for PIX', async () => {
      await useCase.execute(validRequest);

      expect(mockPaymentService.generatePixQRCode).toHaveBeenCalledTimes(1);
      expect(mockPaymentService.generatePixQRCode).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 20000,
          merchantId: validRequest.merchantId,
          description: expect.stringContaining('Order'),
          expiresInMinutes: 15
        })
      );
    });
  });

  describe('GIVEN invalid request data', () => {
    it('WHEN missing required fields THEN should return validation error', async () => {
      const invalidRequest = { ...validRequest, merchantId: '' };

      const result = await useCase.execute(invalidRequest);

      expect(result.success).toBe(false);
      expect(result.error).toContain('required');
      expect(result.order).toBeUndefined();
    });

    it('WHEN items array is empty THEN should return validation error', async () => {
      const invalidRequest = { ...validRequest, items: [] };

      const result = await useCase.execute(invalidRequest);

      expect(result.success).toBe(false);
      expect(result.error).toContain('required');
      expect(result.order).toBeUndefined();
    });
  });

  describe('GIVEN product validation scenarios', () => {
    it('WHEN product does not exist THEN should return product not found error', async () => {
      mockProductRepository.findById.mockResolvedValue(null);

      const result = await useCase.execute(validRequest);

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
      expect(result.order).toBeUndefined();
      expect(mockOrderRepository.save).not.toHaveBeenCalled();
    });

    it('WHEN product is not active THEN should return product not available error', async () => {
      const inactiveProduct = TestDataBuilder.createProduct({
        id: 'product-1',
        isActive: false
      });
      mockProductRepository.findById.mockResolvedValue(inactiveProduct);

      const result = await useCase.execute(validRequest);

      expect(result.success).toBe(false);
      expect(result.error).toContain('not available');
      expect(result.order).toBeUndefined();
    });

    it('WHEN product category validation passes THEN should handle correctly', async () => {
      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockOrderRepository.save.mockResolvedValue(
        new Order({
          id: 'order-1',
          merchantId: validRequest.merchantId,
          userId: validRequest.userId,
          items: [],
          total: TestDataBuilder.createMoney(20000),
          status: 'pending' as const,
          paymentMethod: 'pix'
        })
      );
      mockPaymentService.generatePixQRCode.mockResolvedValue({
        success: true,
        qrCode: 'https://pix.example.com/qr123',
        paymentId: 'pix-123'
      });

      const result = await useCase.execute(validRequest);

      expect(result.success).toBe(true);
      expect(result.order).toBeDefined();
    });
  });

  describe('GIVEN multiple products in order', () => {
    let product2: Product;

    beforeEach(() => {
      product2 = TestDataBuilder.createProduct({
        id: 'product-2',
        name: 'Test Product 2',
        price: TestDataBuilder.createMoney(5000),
        isActive: true
      });

      validRequest.items = [
        { productId: 'product-1', quantity: 2 },
        { productId: 'product-2', quantity: 1 }
      ];

      mockProductRepository.findById
        .mockResolvedValueOnce(mockProduct)
        .mockResolvedValueOnce(product2);

      mockOrderRepository.save.mockResolvedValue(
        new Order({
          id: 'order-1',
          merchantId: validRequest.merchantId,
          userId: validRequest.userId,
          items: [
            {
              productId: 'product-1',
              productName: 'Test Product',
              quantity: 2,
              unitPrice: TestDataBuilder.createMoney(10000),
              totalPrice: TestDataBuilder.createMoney(20000)
            },
            {
              productId: 'product-2',
              productName: 'Test Product 2',
              quantity: 1,
              unitPrice: TestDataBuilder.createMoney(5000),
              totalPrice: TestDataBuilder.createMoney(5000)
            }
          ],
          total: TestDataBuilder.createMoney(25000),
          status: 'pending' as const,
          paymentMethod: 'pix'
        })
      );

      mockPaymentService.generatePixQRCode.mockResolvedValue({
        success: true,
        qrCode: 'https://pix.example.com/qr123',
        paymentId: 'pix-123'
      });
    });

    it('WHEN creating order with multiple products THEN should calculate correct total', async () => {
      const result = await useCase.execute(validRequest);

      expect(result.success).toBe(true);
      expect(result.order?.items).toHaveLength(2);
      expect(result.order?.total.amount).toBe(25000); // (10000 * 2) + (5000 * 1)
      expect(mockProductRepository.findById).toHaveBeenCalledTimes(2);
    });
  });

  describe('GIVEN payment service failures', () => {
    beforeEach(() => {
      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockOrderRepository.save.mockResolvedValue(
        new Order({
          id: 'order-1',
          merchantId: validRequest.merchantId,
          userId: validRequest.userId,
          items: [],
          total: TestDataBuilder.createMoney(20000),
          status: 'pending' as const,
          paymentMethod: 'pix'
        })
      );
    });

    it('WHEN PIX QR generation fails THEN should return payment error', async () => {
      mockPaymentService.generatePixQRCode.mockResolvedValue({
        success: false,
        paymentId: '',
        error: 'PIX service unavailable'
      });

      const result = await useCase.execute(validRequest);

      expect(result.success).toBe(false);
      expect(result.error).toContain('PIX service unavailable');
      expect(result.order).toBeUndefined();
    });
  });

  describe('GIVEN different payment methods', () => {
    beforeEach(() => {
      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockOrderRepository.save.mockResolvedValue(
        new Order({
          id: 'order-1',
          merchantId: validRequest.merchantId,
          userId: validRequest.userId,
          items: [],
          total: TestDataBuilder.createMoney(20000),
          status: 'pending' as const,
          paymentMethod: 'crypto'
        })
      );
    });

    it('WHEN payment method is crypto THEN should not generate PIX QR', async () => {
      const cryptoRequest = { ...validRequest, paymentMethod: 'crypto' as const };

      const result = await useCase.execute(cryptoRequest);

      expect(result.success).toBe(true);
      expect(result.paymentData).toBeUndefined();
      expect(mockPaymentService.generatePixQRCode).not.toHaveBeenCalled();
    });
  });

  describe('GIVEN error handling scenarios', () => {
    beforeEach(() => {
      mockProductRepository.findById.mockResolvedValue(mockProduct);
    });

    it('WHEN repository save fails THEN should return error', async () => {
      mockOrderRepository.save.mockRejectedValue(new Error('Database connection failed'));

      const result = await useCase.execute(validRequest);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Database connection failed');
      expect(result.order).toBeUndefined();
    });

    it('WHEN unexpected error occurs THEN should handle gracefully', async () => {
      mockProductRepository.findById.mockRejectedValue(new Error('Unexpected error'));

      const result = await useCase.execute(validRequest);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unexpected error');
      expect(result.order).toBeUndefined();
    });
  });
});