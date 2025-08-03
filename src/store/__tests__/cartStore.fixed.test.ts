import { renderHook, act } from '@testing-library/react';
import { useCartStore } from '../cartStore';
import { Product } from '@/core/entities/Product';

// Mock Product entity
const createMockProduct = (id: string, name: string, price: number): Product => {
  return new Product({
    id,
    merchantId: 'merchant-1',
    name,
    price,
    description: 'Test product',
    category: 'test',
    images: [`https://example.com/${id}.jpg`],
    attributes: {},
    availability: { inStock: true, quantity: 10, maxQuantityPerOrder: 5 },
    nftConfig: { enabled: false, tokenType: 'ERC-721', metadata: { name: '', description: '', image: '' } },
    variants: [],
    seo: { title: '', description: '', keywords: [] }
  });
};

describe('Cart Store', () => {
  beforeEach(() => {
    // Clear store before each test
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.clearCart();
    });
  });

  describe('Initial State', () => {
    it('should have initial state', () => {
      const { result } = renderHook(() => useCartStore());

      expect(result.current.items).toEqual([]);
      expect(result.current.merchantAddress).toBe(null);
      expect(result.current.isOpen).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('addItem', () => {
    it('should add a new item to cart', () => {
      const { result } = renderHook(() => useCartStore());
      const product = createMockProduct('product-1', 'Test Product', 99.99);
      const item = {
        product,
        quantity: 1,
        attributes: {}
      };

      act(() => {
        result.current.addItem(item);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].product.id).toBe('product-1');
      expect(result.current.items[0].quantity).toBe(1);
    });

    it('should increase quantity when adding same item', () => {
      const { result } = renderHook(() => useCartStore());
      const product = createMockProduct('product-1', 'Test Product', 99.99);
      const item = {
        product,
        quantity: 1,
        attributes: {}
      };

      act(() => {
        result.current.addItem(item);
        result.current.addItem(item);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].quantity).toBe(2);
    });

    it('should add different items separately', () => {
      const { result } = renderHook(() => useCartStore());
      const product1 = createMockProduct('product-1', 'Product 1', 99.99);
      const product2 = createMockProduct('product-2', 'Product 2', 149.99);
      const item1 = { product: product1, quantity: 1, attributes: {} };
      const item2 = { product: product2, quantity: 1, attributes: {} };

      act(() => {
        result.current.addItem(item1);
        result.current.addItem(item2);
      });

      expect(result.current.items).toHaveLength(2);
      expect(result.current.items[0].product.id).toBe('product-1');
      expect(result.current.items[1].product.id).toBe('product-2');
    });
  });

  describe('removeItem', () => {
    it('should remove item by id', () => {
      const { result } = renderHook(() => useCartStore());
      const product = createMockProduct('product-1', 'Test Product', 99.99);
      const item = { product, quantity: 1, attributes: {} };

      act(() => {
        result.current.addItem(item);
        const itemId = result.current.items[0].id;
        result.current.removeItem(itemId);
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('should not remove non-existent item', () => {
      const { result } = renderHook(() => useCartStore());
      const product = createMockProduct('product-1', 'Test Product', 99.99);
      const item = { product, quantity: 1, attributes: {} };

      act(() => {
        result.current.addItem(item);
        result.current.removeItem('non-existent');
      });

      expect(result.current.items).toHaveLength(1);
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const { result } = renderHook(() => useCartStore());
      const product = createMockProduct('product-1', 'Test Product', 99.99);
      const item = { product, quantity: 1, attributes: {} };

      act(() => {
        result.current.addItem(item);
        const itemId = result.current.items[0].id;
        result.current.updateQuantity(itemId, 3);
      });

      expect(result.current.items[0].quantity).toBe(3);
    });

    it('should remove item when quantity is 0', () => {
      const { result } = renderHook(() => useCartStore());
      const product = createMockProduct('product-1', 'Test Product', 99.99);
      const item = { product, quantity: 1, attributes: {} };

      act(() => {
        result.current.addItem(item);
        const itemId = result.current.items[0].id;
        result.current.updateQuantity(itemId, 0);
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('should not update non-existent item', () => {
      const { result } = renderHook(() => useCartStore());
      const product = createMockProduct('product-1', 'Test Product', 99.99);
      const item = { product, quantity: 1, attributes: {} };

      act(() => {
        result.current.addItem(item);
        result.current.updateQuantity('non-existent', 5);
      });

      expect(result.current.items[0].quantity).toBe(1);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const { result } = renderHook(() => useCartStore());
      const product1 = createMockProduct('product-1', 'Product 1', 99.99);
      const product2 = createMockProduct('product-2', 'Product 2', 149.99);
      const item1 = { product: product1, quantity: 1, attributes: {} };
      const item2 = { product: product2, quantity: 2, attributes: {} };

      act(() => {
        result.current.addItem(item1);
        result.current.addItem(item2);
        result.current.clearCart();
      });

      expect(result.current.items).toHaveLength(0);
    });
  });

  describe('setMerchant', () => {
    it('should set merchant address', () => {
      const { result } = renderHook(() => useCartStore());
      const merchantAddress = '0x1234567890123456789012345678901234567890';

      act(() => {
        result.current.setMerchant(merchantAddress);
      });

      expect(result.current.merchantAddress).toBe(merchantAddress);
    });
  });

  describe('openCart', () => {
    it('should open cart', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.openCart();
      });

      expect(result.current.isOpen).toBe(true);
    });
  });

  describe('closeCart', () => {
    it('should close cart', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.openCart();
        result.current.closeCart();
      });

      expect(result.current.isOpen).toBe(false);
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      const { result } = renderHook(() => useCartStore());

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

  describe('Computed Properties', () => {
    it('should calculate total price correctly', () => {
      const { result } = renderHook(() => useCartStore());
      const product1 = createMockProduct('product-1', 'Product 1', 100);
      const product2 = createMockProduct('product-2', 'Product 2', 50);
      const item1 = { product: product1, quantity: 2, attributes: {} };
      const item2 = { product: product2, quantity: 1, attributes: {} };

      act(() => {
        result.current.addItem(item1);
        result.current.addItem(item2);
      });

      const total = result.current.getTotalPrice();
      expect(total.amount).toBe(250); // (100 * 2) + (50 * 1)
    });

    it('should calculate total items correctly', () => {
      const { result } = renderHook(() => useCartStore());
      const product1 = createMockProduct('product-1', 'Product 1', 100);
      const product2 = createMockProduct('product-2', 'Product 2', 50);
      const item1 = { product: product1, quantity: 3, attributes: {} };
      const item2 = { product: product2, quantity: 2, attributes: {} };

      act(() => {
        result.current.addItem(item1);
        result.current.addItem(item2);
      });

      expect(result.current.getTotalItems()).toBe(5); // 3 + 2
    });

    it('should return correct item count', () => {
      const { result } = renderHook(() => useCartStore());
      const product1 = createMockProduct('product-1', 'Product 1', 100);
      const product2 = createMockProduct('product-2', 'Product 2', 50);
      const item1 = { product: product1, quantity: 1, attributes: {} };
      const item2 = { product: product2, quantity: 1, attributes: {} };

      act(() => {
        result.current.addItem(item1);
        result.current.addItem(item2);
      });

      expect(result.current.getItemCount('product-1')).toBe(1);
      expect(result.current.getItemCount('product-2')).toBe(1);
    });

    it('should check if cart has items', () => {
      const { result } = renderHook(() => useCartStore());

      expect(result.current.hasItems()).toBe(false);

      const product = createMockProduct('product-1', 'Product 1', 100);
      const item = { product, quantity: 1, attributes: {} };

      act(() => {
        result.current.addItem(item);
      });

      expect(result.current.hasItems()).toBe(true);
    });

    it('should check if cart is empty', () => {
      const { result } = renderHook(() => useCartStore());

      expect(result.current.isEmpty()).toBe(true);

      const product = createMockProduct('product-1', 'Product 1', 100);
      const item = { product, quantity: 1, attributes: {} };

      act(() => {
        result.current.addItem(item);
      });

      expect(result.current.isEmpty()).toBe(false);
    });
  });
}); 