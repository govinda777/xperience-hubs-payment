import { renderHook, act } from '@testing-library/react';
import { useContractStore } from '../contractStore';
import { Merchant } from '@/core/entities/Merchant';
import { Product } from '@/core/entities/Product';

// Helper function to create test merchant
const createTestMerchant = (overrides: Partial<{
  id: string;
  name: string;
  contractAddress: string;
}> = {}): Merchant => {
  return new Merchant({
    id: overrides.id || 'merchant-1',
    contractAddress: overrides.contractAddress || '0x1234567890123456789012345678901234567890',
    name: overrides.name || 'Test Merchant',
    cnpj: '12.345.678/0001-90',
    pixKey: 'test@merchant.com',
    description: 'A test merchant',
    isActive: true,
    ...overrides,
  });
};

// Helper function to create test products
const createTestProduct = (overrides: Partial<{
  id: string;
  name: string;
  price: number;
  merchantId: string;
}> = {}): Product => {
  return new Product({
    id: overrides.id || 'product-1',
    merchantId: overrides.merchantId || 'merchant-1',
    name: overrides.name || 'Test Product',
    description: 'A test product',
    price: {
      amount: overrides.price || 99.99,
      currency: 'BRL',
      formatted: `R$ ${(overrides.price || 99.99).toFixed(2).replace('.', ',')}`,
    },
    category: 'digital_product',
    ...overrides,
  });
};

describe('Contract Store', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useContractStore());
    act(() => {
      result.current.reset();
    });
  });

  describe('Initial State', () => {
    it('should have initial state', () => {
      const { result } = renderHook(() => useContractStore());

      expect(result.current.currentMerchant).toBe(null);
      expect(result.current.products).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.lastUpdate).toBe(null);
      expect(result.current.contractAddress).toBe(null);
    });
  });

  describe('setCurrentMerchant', () => {
    it('should set current merchant', () => {
      const { result } = renderHook(() => useContractStore());
      const merchant = createTestMerchant();

      act(() => {
        result.current.setCurrentMerchant(merchant);
      });

      expect(result.current.currentMerchant).toEqual(merchant);
      expect(result.current.contractAddress).toBe(merchant.contractAddress);
      expect(result.current.lastUpdate).toBeInstanceOf(Date);
    });

    it('should clear merchant when set to null', () => {
      const { result } = renderHook(() => useContractStore());
      const merchant = createTestMerchant();

      act(() => {
        result.current.setCurrentMerchant(merchant);
        result.current.setCurrentMerchant(null);
      });

      expect(result.current.currentMerchant).toBe(null);
      expect(result.current.contractAddress).toBe(null);
    });
  });

  describe('setProducts', () => {
    it('should set products', () => {
      const { result } = renderHook(() => useContractStore());
      const products = [
        createTestProduct({ id: 'product-1' }),
        createTestProduct({ id: 'product-2' }),
      ];

      act(() => {
        result.current.setProducts(products);
      });

      expect(result.current.products).toEqual(products);
      expect(result.current.lastUpdate).toBeInstanceOf(Date);
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      const { result } = renderHook(() => useContractStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      const { result } = renderHook(() => useContractStore());
      const error = 'Test error message';

      act(() => {
        result.current.setError(error);
      });

      expect(result.current.error).toBe(error);
    });

    it('should clear error when set to null', () => {
      const { result } = renderHook(() => useContractStore());

      act(() => {
        result.current.setError('Some error');
        result.current.setError(null);
      });

      expect(result.current.error).toBe(null);
    });
  });

  describe('setContractAddress', () => {
    it('should set contract address', () => {
      const { result } = renderHook(() => useContractStore());
      const address = '0x1234567890123456789012345678901234567890';

      act(() => {
        result.current.setContractAddress(address);
      });

      expect(result.current.contractAddress).toBe(address);
    });
  });

  describe('addProduct', () => {
    it('should add product to list', () => {
      const { result } = renderHook(() => useContractStore());
      const product = createTestProduct();

      act(() => {
        result.current.addProduct(product);
      });

      expect(result.current.products).toHaveLength(1);
      expect(result.current.products[0]).toEqual(product);
      expect(result.current.lastUpdate).toBeInstanceOf(Date);
    });
  });

  describe('updateProduct', () => {
    it('should update existing product', () => {
      const { result } = renderHook(() => useContractStore());
      const product = createTestProduct();
      const updates = { name: 'Updated Product' };

      act(() => {
        result.current.addProduct(product);
        result.current.updateProduct(product.id, updates);
      });

      expect(result.current.products[0].name).toBe('Updated Product');
      expect(result.current.lastUpdate).toBeInstanceOf(Date);
    });

    it('should not update non-existent product', () => {
      const { result } = renderHook(() => useContractStore());
      const product = createTestProduct();
      const updates = { name: 'Updated Product' };

      act(() => {
        result.current.addProduct(product);
        result.current.updateProduct('non-existent', updates);
      });

      expect(result.current.products[0].name).toBe('Test Product');
    });
  });

  describe('removeProduct', () => {
    it('should remove product from list', () => {
      const { result } = renderHook(() => useContractStore());
      const product = createTestProduct();

      act(() => {
        result.current.addProduct(product);
        result.current.removeProduct(product.id);
      });

      expect(result.current.products).toHaveLength(0);
      expect(result.current.lastUpdate).toBeInstanceOf(Date);
    });

    it('should not remove non-existent product', () => {
      const { result } = renderHook(() => useContractStore());
      const product = createTestProduct();

      act(() => {
        result.current.addProduct(product);
        result.current.removeProduct('non-existent');
      });

      expect(result.current.products).toHaveLength(1);
    });
  });

  describe('updateMerchant', () => {
    it('should update merchant information', () => {
      const { result } = renderHook(() => useContractStore());
      const merchant = createTestMerchant();
      const updates = { name: 'Updated Merchant' };

      act(() => {
        result.current.setCurrentMerchant(merchant);
        result.current.updateMerchant(updates);
      });

      expect(result.current.currentMerchant?.name).toBe('Updated Merchant');
      expect(result.current.lastUpdate).toBeInstanceOf(Date);
    });

    it('should not update when no merchant is set', () => {
      const { result } = renderHook(() => useContractStore());
      const updates = { name: 'Updated Merchant' };

      act(() => {
        result.current.updateMerchant(updates);
      });

      expect(result.current.currentMerchant).toBe(null);
    });
  });

  describe('reset', () => {
    it('should reset store to initial state', () => {
      const { result } = renderHook(() => useContractStore());
      const merchant = createTestMerchant();
      const product = createTestProduct();

      act(() => {
        result.current.setCurrentMerchant(merchant);
        result.current.addProduct(product);
        result.current.setLoading(true);
        result.current.setError('Test error');
        result.current.reset();
      });

      expect(result.current.currentMerchant).toBe(null);
      expect(result.current.products).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.lastUpdate).toBe(null);
      expect(result.current.contractAddress).toBe(null);
    });
  });

  describe('Getters', () => {
    describe('getProductById', () => {
      it('should return product by id', () => {
        const { result } = renderHook(() => useContractStore());
        const product = createTestProduct();

        act(() => {
          result.current.addProduct(product);
        });

        const foundProduct = result.current.getProductById(product.id);
        expect(foundProduct).toEqual(product);
      });

      it('should return null for non-existent product', () => {
        const { result } = renderHook(() => useContractStore());
        const product = createTestProduct();

        act(() => {
          result.current.addProduct(product);
        });

        const foundProduct = result.current.getProductById('non-existent');
        expect(foundProduct).toBe(null);
      });
    });

    describe('getProductsByCategory', () => {
      it('should return products by category', () => {
        const { result } = renderHook(() => useContractStore());
        const product1 = createTestProduct({ id: 'product-1', category: 'event' });
        const product2 = createTestProduct({ id: 'product-2', category: 'event' });
        const product3 = createTestProduct({ id: 'product-3', category: 'digital_product' });

        act(() => {
          result.current.addProduct(product1);
          result.current.addProduct(product2);
          result.current.addProduct(product3);
        });

        const eventProducts = result.current.getProductsByCategory('event');
        expect(eventProducts).toHaveLength(2);
        expect(eventProducts[0].category).toBe('event');
        expect(eventProducts[1].category).toBe('event');
      });
    });

    describe('getActiveProducts', () => {
      it('should return only active products', () => {
        const { result } = renderHook(() => useContractStore());
        const activeProduct = createTestProduct({ id: 'product-1' });
        const inactiveProduct = createTestProduct({ id: 'product-2' });

        act(() => {
          result.current.addProduct(activeProduct);
          result.current.addProduct(inactiveProduct);
          result.current.updateProduct(inactiveProduct.id, { isActive: false });
        });

        const activeProducts = result.current.getActiveProducts();
        expect(activeProducts).toHaveLength(1);
        expect(activeProducts[0].isActive).toBe(true);
      });
    });

    describe('getAvailableProducts', () => {
      it('should return only available products', () => {
        const { result } = renderHook(() => useContractStore());
        const availableProduct = createTestProduct({ id: 'product-1' });
        const unavailableProduct = createTestProduct({ id: 'product-2' });

        act(() => {
          result.current.addProduct(availableProduct);
          result.current.addProduct(unavailableProduct);
          result.current.updateProduct(unavailableProduct.id, { availability: 'out_of_stock' });
        });

        const availableProducts = result.current.getAvailableProducts();
        expect(availableProducts).toHaveLength(1);
        expect(availableProducts[0].isAvailable()).toBe(true);
      });
    });

    describe('getTotalProducts', () => {
      it('should return total number of products', () => {
        const { result } = renderHook(() => useContractStore());
        const product1 = createTestProduct({ id: 'product-1' });
        const product2 = createTestProduct({ id: 'product-2' });

        act(() => {
          result.current.addProduct(product1);
          result.current.addProduct(product2);
        });

        expect(result.current.getTotalProducts()).toBe(2);
      });
    });

    describe('isMerchantActive', () => {
      it('should return true for active merchant', () => {
        const { result } = renderHook(() => useContractStore());
        const merchant = createTestMerchant({ isActive: true });

        act(() => {
          result.current.setCurrentMerchant(merchant);
        });

        expect(result.current.isMerchantActive()).toBe(true);
      });

          it('should return false for inactive merchant', () => {
      const { result } = renderHook(() => useContractStore());
      const merchant = createTestMerchant();
      merchant.deactivate();

      act(() => {
        result.current.setCurrentMerchant(merchant);
      });

      expect(result.current.isMerchantActive()).toBe(false);
    });

      it('should return false when no merchant is set', () => {
        const { result } = renderHook(() => useContractStore());

        expect(result.current.isMerchantActive()).toBe(false);
      });
    });

    describe('getMerchantName', () => {
      it('should return merchant name', () => {
        const { result } = renderHook(() => useContractStore());
        const merchant = createTestMerchant({ name: 'Test Store' });

        act(() => {
          result.current.setCurrentMerchant(merchant);
        });

        expect(result.current.getMerchantName()).toBe('Test Store');
      });

      it('should return default name when no merchant is set', () => {
        const { result } = renderHook(() => useContractStore());

        expect(result.current.getMerchantName()).toBe('Loja');
      });
    });

    describe('getMerchantTheme', () => {
      it('should return merchant theme', () => {
        const { result } = renderHook(() => useContractStore());
        const theme = {
          primaryColor: '#ff0000',
          secondaryColor: '#00ff00',
          backgroundColor: '#ffffff',
          textColor: '#000000',
          fontFamily: 'Arial, sans-serif'
        };
        const merchant = createTestMerchant({ theme });

        act(() => {
          result.current.setCurrentMerchant(merchant);
        });

        expect(result.current.getMerchantTheme()).toEqual(theme);
      });

      it('should return default theme when no merchant is set', () => {
        const { result } = renderHook(() => useContractStore());
        const defaultTheme = {
          primaryColor: '#3b82f6',
          secondaryColor: '#64748b',
          backgroundColor: '#ffffff',
          textColor: '#1f2937',
          fontFamily: 'Inter, sans-serif'
        };

        expect(result.current.getMerchantTheme()).toEqual(defaultTheme);
      });
    });
  });
}); 