import { renderHook, act } from '@testing-library/react';
import { useCartStore } from '../cartStore';

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
      const item = {
        id: 'product-1',
        name: 'Test Product',
        price: 99.99,
        quantity: 1,
        image: 'https://example.com/image.jpg'
      };

      act(() => {
        result.current.addItem(item);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]).toEqual(item);
    });

    it('should increase quantity when adding same item', () => {
      const { result } = renderHook(() => useCartStore());
      const item = {
        id: 'product-1',
        name: 'Test Product',
        price: 99.99,
        quantity: 1,
        image: 'https://example.com/image.jpg'
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
      const item1 = {
        id: 'product-1',
        name: 'Product 1',
        price: 99.99,
        quantity: 1,
        image: 'https://example.com/image1.jpg'
      };
      const item2 = {
        id: 'product-2',
        name: 'Product 2',
        price: 149.99,
        quantity: 1,
        image: 'https://example.com/image2.jpg'
      };

      act(() => {
        result.current.addItem(item1);
        result.current.addItem(item2);
      });

      expect(result.current.items).toHaveLength(2);
      expect(result.current.items[0].id).toBe('product-1');
      expect(result.current.items[1].id).toBe('product-2');
    });
  });

  describe('removeItem', () => {
    it('should remove item by id', () => {
      const { result } = renderHook(() => useCartStore());
      const item = {
        id: 'product-1',
        name: 'Test Product',
        price: 99.99,
        quantity: 1,
        image: 'https://example.com/image.jpg'
      };

      act(() => {
        result.current.addItem(item);
        result.current.removeItem('product-1');
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('should not remove non-existent item', () => {
      const { result } = renderHook(() => useCartStore());
      const item = {
        id: 'product-1',
        name: 'Test Product',
        price: 99.99,
        quantity: 1,
        image: 'https://example.com/image.jpg'
      };

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
      const item = {
        id: 'product-1',
        name: 'Test Product',
        price: 99.99,
        quantity: 1,
        image: 'https://example.com/image.jpg'
      };

      act(() => {
        result.current.addItem(item);
        result.current.updateQuantity('product-1', 3);
      });

      expect(result.current.items[0].quantity).toBe(3);
    });

    it('should remove item when quantity is 0', () => {
      const { result } = renderHook(() => useCartStore());
      const item = {
        id: 'product-1',
        name: 'Test Product',
        price: 99.99,
        quantity: 1,
        image: 'https://example.com/image.jpg'
      };

      act(() => {
        result.current.addItem(item);
        result.current.updateQuantity('product-1', 0);
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('should not update non-existent item', () => {
      const { result } = renderHook(() => useCartStore());
      const item = {
        id: 'product-1',
        name: 'Test Product',
        price: 99.99,
        quantity: 1,
        image: 'https://example.com/image.jpg'
      };

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
      const item1 = {
        id: 'product-1',
        name: 'Product 1',
        price: 99.99,
        quantity: 1,
        image: 'https://example.com/image1.jpg'
      };
      const item2 = {
        id: 'product-2',
        name: 'Product 2',
        price: 149.99,
        quantity: 2,
        image: 'https://example.com/image2.jpg'
      };

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
      const item1 = {
        id: 'product-1',
        name: 'Product 1',
        price: 100,
        quantity: 2,
        image: 'https://example.com/image1.jpg'
      };
      const item2 = {
        id: 'product-2',
        name: 'Product 2',
        price: 50,
        quantity: 1,
        image: 'https://example.com/image2.jpg'
      };

      act(() => {
        result.current.addItem(item1);
        result.current.addItem(item2);
      });

      expect(result.current.getTotalPrice()).toBe(250); // (100 * 2) + (50 * 1)
    });

    it('should calculate total items correctly', () => {
      const { result } = renderHook(() => useCartStore());
      const item1 = {
        id: 'product-1',
        name: 'Product 1',
        price: 100,
        quantity: 3,
        image: 'https://example.com/image1.jpg'
      };
      const item2 = {
        id: 'product-2',
        name: 'Product 2',
        price: 50,
        quantity: 2,
        image: 'https://example.com/image2.jpg'
      };

      act(() => {
        result.current.addItem(item1);
        result.current.addItem(item2);
      });

      expect(result.current.getTotalItems()).toBe(5); // 3 + 2
    });

    it('should return correct item count', () => {
      const { result } = renderHook(() => useCartStore());
      const item1 = {
        id: 'product-1',
        name: 'Product 1',
        price: 100,
        quantity: 1,
        image: 'https://example.com/image1.jpg'
      };
      const item2 = {
        id: 'product-2',
        name: 'Product 2',
        price: 50,
        quantity: 1,
        image: 'https://example.com/image2.jpg'
      };

      act(() => {
        result.current.addItem(item1);
        result.current.addItem(item2);
      });

      expect(result.current.getItemCount()).toBe(2); // 2 different items
    });

    it('should check if cart has items', () => {
      const { result } = renderHook(() => useCartStore());

      expect(result.current.hasItems()).toBe(false);

      const item = {
        id: 'product-1',
        name: 'Product 1',
        price: 100,
        quantity: 1,
        image: 'https://example.com/image1.jpg'
      };

      act(() => {
        result.current.addItem(item);
      });

      expect(result.current.hasItems()).toBe(true);
    });

    it('should check if cart is empty', () => {
      const { result } = renderHook(() => useCartStore());

      expect(result.current.isEmpty()).toBe(true);

      const item = {
        id: 'product-1',
        name: 'Product 1',
        price: 100,
        quantity: 1,
        image: 'https://example.com/image1.jpg'
      };

      act(() => {
        result.current.addItem(item);
      });

      expect(result.current.isEmpty()).toBe(false);
    });
  });
}); 