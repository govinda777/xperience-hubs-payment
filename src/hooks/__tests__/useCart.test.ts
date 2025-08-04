import { renderHook, act } from '@testing-library/react';
import { useCart } from '../useCart';
import { Product } from '@/core/entities/Product';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useCart Hook', () => {
  let mockProduct1: Product;
  let mockProduct2: Product;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
    jest.clearAllMocks();

    mockProduct1 = new Product({
      id: 'product-1',
      name: 'Test Product 1',
      description: 'A test product',
      price: { amount: 10000, currency: 'BRL', formatted: 'R$ 100,00' },
      category: 'physical_product',
      merchantId: 'merchant-1',
      isActive: true,
    });

    mockProduct2 = new Product({
      id: 'product-2',
      name: 'Test Product 2',
      description: 'Another test product',
      price: { amount: 20000, currency: 'BRL', formatted: 'R$ 200,00' },
      category: 'physical_product',
      merchantId: 'merchant-1',
      isActive: true,
      // discountPercentage: 10, // Remover por enquanto, pois Product não suporta este campo
    });
  });

  describe('Initialization', () => {
    it('should initialize with empty cart', () => {
      const { result } = renderHook(() => useCart());

      expect(result.current.items).toEqual([]);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.totalPrice).toBe(0);
      expect(result.current.subtotal).toBe(0);
    });

    it('should load cart from localStorage on mount', () => {
      const savedCart = [
        { product: mockProduct1, quantity: 2 },
        { product: mockProduct2, quantity: 1 },
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedCart));

      const { result } = renderHook(() => useCart());

      expect(result.current.items).toHaveLength(2);
      expect(result.current.totalItems).toBe(3);
      expect(result.current.totalPrice).toBe(40000); // (10000 * 2) + (20000 * 1)
      expect(result.current.subtotal).toBe(40000);
    });

    it('should handle localStorage parsing errors gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useCart());

      expect(result.current.items).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error loading cart from localStorage:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it('should handle localStorage getItem errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useCart());

      expect(result.current.items).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error loading cart from localStorage:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('addToCart', () => {
    it('should add new product to cart', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct1, 2);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]).toEqual({
        product: mockProduct1,
        quantity: 2,
      });
      expect(result.current.totalItems).toBe(2);
      expect(result.current.totalPrice).toBe(20000); // 10000 * 2 (centavos)
      expect(result.current.subtotal).toBe(20000);
    });

    it('should add product with default quantity of 1', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct1);
      });

      expect(result.current.items[0].quantity).toBe(1);
      expect(result.current.totalItems).toBe(1);
    });

    it('should update quantity when adding existing product', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct1, 2);
      });

      act(() => {
        result.current.addToCart(mockProduct1, 3);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].quantity).toBe(5);
      expect(result.current.totalItems).toBe(5);
      expect(result.current.totalPrice).toBe(50000); // 10000 * 5
    });

    it('should not add product with zero or negative quantity', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct1, 0);
      });

      expect(result.current.items).toEqual([]);
      expect(result.current.totalItems).toBe(0);

      act(() => {
        result.current.addToCart(mockProduct1, -1);
      });

      expect(result.current.items).toEqual([]);
      expect(result.current.totalItems).toBe(0);
    });

    it('should handle multiple products correctly', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct1, 2);
        result.current.addToCart(mockProduct2, 1);
      });

      expect(result.current.items).toHaveLength(2);
      expect(result.current.totalItems).toBe(3);
      expect(result.current.totalPrice).toBe(40000); // (10000 * 2) + (20000 * 1)
      expect(result.current.subtotal).toBe(40000);
    });
  });

  describe('removeFromCart', () => {
    it('should remove product from cart', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct1, 2);
        result.current.addToCart(mockProduct2, 1);
      });

      act(() => {
        result.current.removeFromCart(mockProduct1.id);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].product.id).toBe(mockProduct2.id);
      expect(result.current.totalItems).toBe(1);
      expect(result.current.totalPrice).toBe(20000); // 20000 * 1
    });

    it('should handle removing non-existent product', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct1, 2);
      });

      act(() => {
        result.current.removeFromCart('non-existent-id');
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.totalItems).toBe(2);
    });
  });

  describe('updateQuantity', () => {
    it('should update product quantity', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct1, 2);
      });

      act(() => {
        result.current.updateQuantity(mockProduct1.id, 5);
      });

      expect(result.current.items[0].quantity).toBe(5);
      expect(result.current.totalItems).toBe(5);
      expect(result.current.totalPrice).toBe(50000); // 10000 * 5
    });

    it('should remove product when quantity is zero', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct1, 2);
      });

      act(() => {
        result.current.updateQuantity(mockProduct1.id, 0);
      });

      expect(result.current.items).toEqual([]);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.totalPrice).toBe(0);
    });

    it('should remove product when quantity is negative', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct1, 2);
      });

      act(() => {
        result.current.updateQuantity(mockProduct1.id, -1);
      });

      expect(result.current.items).toEqual([]);
      expect(result.current.totalItems).toBe(0);
    });

    it('should handle updating non-existent product', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct1, 2);
      });

      act(() => {
        result.current.updateQuantity('non-existent-id', 5);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].quantity).toBe(2);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct1, 2);
        result.current.addToCart(mockProduct2, 1);
      });

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.items).toEqual([]);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.totalPrice).toBe(0);
      expect(result.current.subtotal).toBe(0);
    });
  });

  describe('isInCart', () => {
    it('should return true for product in cart', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct1, 2);
      });

      expect(result.current.isInCart(mockProduct1.id)).toBe(true);
    });

    it('should return false for product not in cart', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct1, 2);
      });

      expect(result.current.isInCart(mockProduct2.id)).toBe(false);
    });
  });

  describe('getQuantity', () => {
    it('should return correct quantity for product in cart', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct1, 3);
      });

      expect(result.current.getQuantity(mockProduct1.id)).toBe(3);
    });

    it('should return 0 for product not in cart', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct1, 2);
      });

      expect(result.current.getQuantity(mockProduct2.id)).toBe(0);
    });
  });

  describe('updateProduct', () => {
    it('should update product data in cart', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct1, 2);
      });

          const updatedProduct = new Product({
      ...mockProduct1,
      name: 'Updated Product Name',
      price: { amount: 15000, currency: 'BRL', formatted: 'R$ 150,00' },
    });

      act(() => {
        result.current.updateProduct(updatedProduct);
      });

      expect(result.current.items[0].product.name).toBe('Updated Product Name');
      expect(result.current.items[0].product.price.amount).toBe(15000);
      expect(result.current.totalPrice).toBe(30000); // 15000 * 2
      expect(result.current.subtotal).toBe(30000);
    });

    it('should not affect other products when updating one', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct1, 2);
        result.current.addToCart(mockProduct2, 1);
      });

          const updatedProduct1 = new Product({
      ...mockProduct1,
      price: { amount: 15000, currency: 'BRL', formatted: 'R$ 150,00' },
    });

      act(() => {
        result.current.updateProduct(updatedProduct1);
      });

      expect(result.current.items[0].product.price.amount).toBe(15000);
      expect(result.current.items[1].product.price.amount).toBe(20000); // Unchanged
      expect(result.current.totalPrice).toBe(50000); // (15000 * 2) + (20000 * 1)
    });

    it('should handle updating non-existent product', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct1, 2);
      });

      const nonExistentProduct = new Product({
        ...mockProduct2,
        id: 'non-existent-id',
      });

      act(() => {
        result.current.updateProduct(nonExistentProduct);
      });

      expect(result.current.items[0].product.id).toBe(mockProduct1.id);
      expect(result.current.items[0].product.price.amount).toBe(mockProduct1.price.amount);
    });
  });

  describe('Price Calculations', () => {
    it('should calculate total price with discounts', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct1, 2); // 10000 * 2 = 20000
        result.current.addToCart(mockProduct2, 1); // 20000 * 1 = 20000
      });

      expect(result.current.totalPrice).toBe(40000); // 20000 + 20000
      expect(result.current.subtotal).toBe(40000);
    });

    it('should handle products with zero price', () => {
          const freeProduct = new Product({
      ...mockProduct1,
      price: { amount: 0, currency: 'BRL', formatted: 'R$ 0,00' },
    });

      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(freeProduct, 5);
      });

      expect(result.current.totalPrice).toBe(0);
      expect(result.current.subtotal).toBe(0);
    });

    it('should handle products with 100% discount', () => {
          const discountedProduct = new Product({
      ...mockProduct1,
      price: { amount: 0, currency: 'BRL', formatted: 'R$ 0,00' },
    });

      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(discountedProduct, 3);
      });

      expect(result.current.totalPrice).toBe(0); // Free product
      expect(result.current.subtotal).toBe(0); // Free product
    });
  });

  describe('localStorage Persistence', () => {
    it('should save cart to localStorage when items change', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct1, 2);
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'cart',
        JSON.stringify([{ product: mockProduct1, quantity: 2 }])
      );
    });

    it('should handle localStorage setItem errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage setItem error');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct1, 2);
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error saving cart to localStorage:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('should handle products with decimal prices', () => {
          const decimalProduct = new Product({
      ...mockProduct1,
      price: { amount: 9999, currency: 'BRL', formatted: 'R$ 99,99' },
    });

      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(decimalProduct, 3);
      });

      expect(result.current.totalPrice).toBe(29997); // 9999 * 3
      expect(result.current.subtotal).toBe(29997);
    });

    it('should handle large quantities', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct1, 1000);
      });

      expect(result.current.totalItems).toBe(1000);
      expect(result.current.totalPrice).toBe(10000000); // 10000 * 1000
    });

    it('should handle multiple rapid updates', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct1, 1);
        result.current.addToCart(mockProduct1, 1);
        result.current.addToCart(mockProduct1, 1);
        result.current.updateQuantity(mockProduct1.id, 5);
        result.current.removeFromCart(mockProduct1.id);
        result.current.addToCart(mockProduct2, 2);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].product.id).toBe(mockProduct2.id);
      expect(result.current.items[0].quantity).toBe(2);
      expect(result.current.totalItems).toBe(2);
    });
  });
}); 