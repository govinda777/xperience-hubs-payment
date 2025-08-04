import { CreateProductUseCase, CreateProductRequest } from '../products/CreateProductUseCase';
import { IProductRepository } from '../../repositories/IProductRepository';
import { IMerchantRepository } from '../../repositories/IMerchantRepository';
import { IBlockchainService } from '../../services/IBlockchainService';
import { Product } from '../../entities/Product';
import { Merchant } from '../../entities/Merchant';

// Mock implementations
const mockProductRepository: jest.Mocked<IProductRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
  findByMerchantId: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findAll: jest.fn(),
};

const mockMerchantRepository: jest.Mocked<IMerchantRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
  findByCNPJ: jest.fn(),
  findByContractAddress: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findAll: jest.fn(),
};

const mockBlockchainService: jest.Mocked<IBlockchainService> = {
  deployMerchantContract: jest.fn(),
  addProduct: jest.fn(),
  confirmOrder: jest.fn(),
  getMerchantData: jest.fn(),
  getProductData: jest.fn(),
  getGasPrice: jest.fn(),
  estimateGas: jest.fn(),
};

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let validRequest: CreateProductRequest;
  let mockMerchant: Merchant;

  beforeEach(() => {
    useCase = new CreateProductUseCase(
      mockProductRepository,
      mockMerchantRepository,
      mockBlockchainService
    );

    mockMerchant = new Merchant({
      id: 'merchant-1',
      contractAddress: '0x123456789abcdef',
      name: 'Test Merchant',
      cnpj: '12345678901234',
      pixKey: 'merchant@test.com',
      description: 'Test merchant description',
      contact: {
        email: 'merchant@test.com',
        phone: '+5511999999999'
      },
      address: {
        street: 'Test Street',
        number: '123',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345-678',
        country: 'BR'
      }
    });

    validRequest = {
      merchantId: 'merchant-1',
      name: 'Test Product',
      description: 'A test product for BDD scenarios',
      price: { amount: 10000, currency: 'BRL', formatted: 'R$ 100,00' },
      category: 'physical_product',
      images: ['https://example.com/image1.jpg'],
      isActive: true
    };

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('GIVEN a valid product creation request', () => {
    beforeEach(() => {
      mockMerchantRepository.findById.mockResolvedValue(mockMerchant);
      mockBlockchainService.addProduct.mockResolvedValue({ success: true });
      mockProductRepository.save.mockResolvedValue(
        new Product({ ...validRequest, id: 'product-1' })
      );
    });

    it('WHEN creating a product THEN should successfully create and return the product', async () => {
      const result = await useCase.execute(validRequest);

      expect(result.success).toBe(true);
      expect(result.product).toBeDefined();
      expect(result.product?.name).toBe(validRequest.name);
      expect(result.product?.merchantId).toBe(validRequest.merchantId);
      expect(result.error).toBeUndefined();
    });

    it('WHEN creating a product THEN should save to repository', async () => {
      await useCase.execute(validRequest);

      expect(mockProductRepository.save).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: validRequest.name,
          merchantId: validRequest.merchantId,
          price: validRequest.price,
          category: validRequest.category
        })
      );
    });

    it('WHEN creating a product THEN should register in blockchain', async () => {
      await useCase.execute(validRequest);

      expect(mockBlockchainService.addProduct).toHaveBeenCalledTimes(1);
      expect(mockBlockchainService.addProduct).toHaveBeenCalledWith(
        mockMerchant.contractAddress,
        expect.objectContaining({
          name: validRequest.name,
          price: validRequest.price.amount,
          category: validRequest.category
        })
      );
    });
  });

  describe('GIVEN invalid request data', () => {
    it('WHEN missing required fields THEN should return validation error', async () => {
      const invalidRequest = { ...validRequest, name: '' };

      const result = await useCase.execute(invalidRequest);

      expect(result.success).toBe(false);
      expect(result.error).toContain('required');
      expect(result.product).toBeUndefined();
    });

    it('WHEN price is zero or negative THEN should return validation error', async () => {
      const invalidRequest = { 
        ...validRequest, 
        price: { amount: 0, currency: 'BRL', formatted: 'R$ 0,00' }
      };

      const result = await useCase.execute(invalidRequest);

      expect(result.success).toBe(false);
      expect(result.error).toContain('greater than zero');
      expect(result.product).toBeUndefined();
    });
  });

  describe('GIVEN merchant does not exist', () => {
    beforeEach(() => {
      mockMerchantRepository.findById.mockResolvedValue(null);
    });

    it('WHEN creating a product THEN should return merchant not found error', async () => {
      const result = await useCase.execute(validRequest);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Merchant not found');
      expect(result.product).toBeUndefined();
      expect(mockProductRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('GIVEN blockchain service fails', () => {
    beforeEach(() => {
      mockMerchantRepository.findById.mockResolvedValue(mockMerchant);
      mockBlockchainService.addProduct.mockResolvedValue({ 
        success: false, 
        error: 'Smart contract error' 
      });
    });

    it('WHEN blockchain registration fails THEN should return blockchain error', async () => {
      const result = await useCase.execute(validRequest);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Smart contract error');
      expect(result.product).toBeUndefined();
      expect(mockProductRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('GIVEN repository fails', () => {
    beforeEach(() => {
      mockMerchantRepository.findById.mockResolvedValue(mockMerchant);
      mockBlockchainService.addProduct.mockResolvedValue({ success: true });
      mockProductRepository.save.mockRejectedValue(new Error('Database error'));
    });

    it('WHEN repository save fails THEN should return error', async () => {
      const result = await useCase.execute(validRequest);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Database error');
      expect(result.product).toBeUndefined();
    });
  });

  describe('GIVEN product with optional fields', () => {
    beforeEach(() => {
      mockMerchantRepository.findById.mockResolvedValue(mockMerchant);
      mockBlockchainService.addProduct.mockResolvedValue({ success: true });
    });

    it('WHEN creating product with attributes THEN should include custom attributes', async () => {
      const requestWithAttributes = { ...validRequest, attributes: { size: 'large', color: 'blue' } };
      mockProductRepository.save.mockResolvedValue(
        new Product({ ...requestWithAttributes, id: 'product-1' })
      );

      const result = await useCase.execute(requestWithAttributes);

      expect(result.success).toBe(true);
      expect(mockProductRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          attributes: { size: 'large', color: 'blue' }
        })
      );
    });

    it('WHEN creating product with attributes THEN should include attributes', async () => {
      const requestWithAttributes = { 
        ...validRequest, 
        attributes: { color: 'blue', size: 'large' }
      };
      mockProductRepository.save.mockResolvedValue(
        new Product({ ...requestWithAttributes, id: 'product-1' })
      );

      const result = await useCase.execute(requestWithAttributes);

      expect(result.success).toBe(true);
      expect(mockProductRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          attributes: { color: 'blue', size: 'large' }
        })
      );
    });
  });

  describe('GIVEN concurrent access scenarios', () => {
    beforeEach(() => {
      mockMerchantRepository.findById.mockResolvedValue(mockMerchant);
      mockBlockchainService.addProduct.mockResolvedValue({ success: true });
    });

    it('WHEN multiple products created simultaneously THEN each should be processed independently', async () => {
      const request1 = { ...validRequest, name: 'Product 1' };
      const request2 = { ...validRequest, name: 'Product 2' };

      mockProductRepository.save
        .mockResolvedValueOnce(new Product({ ...request1, id: 'product-1' }))
        .mockResolvedValueOnce(new Product({ ...request2, id: 'product-2' }));

      const [result1, result2] = await Promise.all([
        useCase.execute(request1),
        useCase.execute(request2)
      ]);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result1.product?.name).toBe('Product 1');
      expect(result2.product?.name).toBe('Product 2');
      expect(mockProductRepository.save).toHaveBeenCalledTimes(2);
      expect(mockBlockchainService.addProduct).toHaveBeenCalledTimes(2);
    });
  });
});