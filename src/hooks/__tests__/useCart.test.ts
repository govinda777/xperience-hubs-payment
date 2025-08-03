import { renderHook, act } from '@testing-library/react';
import { useCart } from '../useCart';
import { Product } from '@/core/entities/Product';

// Mock product for testing
const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 100,
  imageUrl: 'test-image.jpg',
  category: 'Test Category',
  isNFT: false,
  rating: 4.5,
  reviewCount: 10,
  stock: 50,
  merchantId: 'merchant-1',
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockNFTProduct: Product = {
  ...mockProduct,
  id: '2',
  name: 'NFT Product',
  isNFT: true
};

describe('useCart Hook', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('initializes with empty cart', () => {
    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('adds product to cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct, 2);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product).toEqual(mockProduct);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalPrice).toBe(200);
  });

  it('adds multiple products to cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct, 1);
      result.current.addToCart(mockNFTProduct, 3);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.totalItems).toBe(4);
    expect(result.current.totalPrice).toBe(400); // 100 + (100 * 3)
  });

  it('increments quantity when adding same product', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct, 1);
      result.current.addToCart(mockProduct, 2);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.totalItems).toBe(3);
    expect(result.current.totalPrice).toBe(300);
  });

  it('removes product from cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct, 2);
      result.current.removeFromCart(mockProduct.id);
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('updates product quantity', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct, 1);
      result.current.updateQuantity(mockProduct.id, 5);
    });

    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.totalItems).toBe(5);
    expect(result.current.totalPrice).toBe(500);
  });

  it('removes product when quantity is set to 0', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct, 1);
      result.current.updateQuantity(mockProduct.id, 0);
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('clears entire cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct, 2);
      result.current.addToCart(mockNFTProduct, 1);
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('checks if product is in cart', () => {
    const { result } = renderHook(() => useCart());

    expect(result.current.isInCart(mockProduct.id)).toBe(false);

    act(() => {
      result.current.addToCart(mockProduct, 1);
    });

    expect(result.current.isInCart(mockProduct.id)).toBe(true);
    expect(result.current.isInCart('non-existent-id')).toBe(false);
  });

  it('gets product quantity', () => {
    const { result } = renderHook(() => useCart());

    expect(result.current.getQuantity(mockProduct.id)).toBe(0);

    act(() => {
      result.current.addToCart(mockProduct, 3);
    });

    expect(result.current.getQuantity(mockProduct.id)).toBe(3);
  });

  it('calculates total price correctly with discounts', () => {
    const discountedProduct: Product = {
      ...mockProduct,
      id: '3',
      discountPercentage: 20
    };

    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(discountedProduct, 2);
    });

    // Price should be 100 * 0.8 * 2 = 160
    expect(result.current.totalPrice).toBe(160);
  });

  it('persists cart data in localStorage', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct, 2);
    });

    // Check if data is stored in localStorage
    const storedCart = localStorage.getItem('cart');
    expect(storedCart).toBeTruthy();

    const parsedCart = JSON.parse(storedCart!);
    expect(parsedCart).toHaveLength(1);
    expect(parsedCart[0].product.id).toBe(mockProduct.id);
    expect(parsedCart[0].quantity).toBe(2);
  });

  it('loads cart data from localStorage on initialization', () => {
    // Pre-populate localStorage
    const initialCart = [
      { product: mockProduct, quantity: 3 }
    ];
    localStorage.setItem('cart', JSON.stringify(initialCart));

    const { result } = renderHook(() => useCart());

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product).toEqual(mockProduct);
    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.totalItems).toBe(3);
    expect(result.current.totalPrice).toBe(300);
  });

  it('handles invalid localStorage data gracefully', () => {
    // Set invalid JSON in localStorage
    localStorage.setItem('cart', 'invalid-json');

    const { result } = renderHook(() => useCart());

    // Should initialize with empty cart
    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('handles empty localStorage gracefully', () => {
    // Ensure localStorage is empty
    localStorage.removeItem('cart');

    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('updates cart when product data changes', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct, 1);
    });

    // Update product price
    const updatedProduct = { ...mockProduct, price: 150 };

    act(() => {
      result.current.updateProduct(updatedProduct);
    });

    expect(result.current.items[0].product.price).toBe(150);
    expect(result.current.totalPrice).toBe(150);
  });

  it('handles product updates for non-existent products', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.updateProduct(mockProduct);
    });

    // Should not add product if it doesn't exist in cart
    expect(result.current.items).toHaveLength(0);
  });

  it('calculates subtotal correctly', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct, 2);
      result.current.addToCart(mockNFTProduct, 1);
    });

    expect(result.current.subtotal).toBe(300); // (100 * 2) + (100 * 1)
  });

  it('handles edge cases with zero quantities', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct, 0);
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('handles negative quantities gracefully', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct, 1);
      result.current.updateQuantity(mockProduct.id, -1);
    });

    // Should remove product when quantity becomes negative
    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('maintains cart state across multiple operations', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct, 1);
      result.current.addToCart(mockNFTProduct, 2);
      result.current.updateQuantity(mockProduct.id, 3);
      result.current.removeFromCart(mockNFTProduct.id);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.id).toBe(mockProduct.id);
    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.totalItems).toBe(3);
    expect(result.current.totalPrice).toBe(300);
  });
}); 