import { defineFeature, loadFeature } from 'jest-cucumber';
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useCart } from '../useCart';
import { Given, When, Then, TestDataBuilder } from '@/lib/bdd/helpers';
import { Product } from '@/core/entities/Product';

// Load the corresponding .feature file
const feature = loadFeature('./features/cart/cart-management.feature');

defineFeature(feature, test => {
  let hookResult: any;
  let product1: Product;
  let product2: Product;
  let localStorageMock: any;

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });

    // Create test products
    product1 = TestDataBuilder.createProduct({
      id: 'product-1',
      name: 'T-Shirt',
      price: TestDataBuilder.createMoney(5000), // $50.00
    });

    product2 = TestDataBuilder.createProduct({
      id: 'product-2',
      name: 'Sneakers',
      price: TestDataBuilder.createMoney(20000), // $200.00
      // discountPercentage: 10,
    });

    jest.clearAllMocks();
  });

  test('Add product to empty cart', ({ given, when, then, and }) => {
    given('the cart system is working', () => {
      // Initial system setup
      expect(useCart).toBeDefined();
    });

    and('there are products available in the marketplace', () => {
      expect(product1).toBeDefined();
      expect(product2).toBeDefined();
    });

    and('localStorage is available for persistence', () => {
      expect(localStorageMock).toBeDefined();
      expect(localStorageMock.setItem).toBeDefined();
    });

    given('the cart is empty', () => {
      localStorageMock.getItem.mockReturnValue(null);
      hookResult = renderHook(() => useCart());
      
      expect(hookResult.result.current.items).toEqual([]);
      expect(hookResult.result.current.totalItems).toBe(0);
    });

    and(/^there is a product "(.*)" with price \$(\d+)\.(\d+)$/, (productName, dollars, cents) => {
      expect(product1.name).toBe(productName);
      const expectedPrice = parseInt(dollars) + (parseInt(cents) / 100);
      expect(product1.price).toBe(expectedPrice);
    });

    when(/^the customer adds (\d+) units of the product to the cart$/, (quantity) => {
      act(() => {
        hookResult.result.current.addToCart(product1, parseInt(quantity));
      });
    });

    then(/^the cart should contain (\d+) item$/, (itemCount) => {
      expect(hookResult.result.current.items).toHaveLength(parseInt(itemCount));
    });

    and(/^the item should have quantity (\d+)$/, (quantity) => {
      expect(hookResult.result.current.items[0].quantity).toBe(parseInt(quantity));
      expect(hookResult.result.current.totalItems).toBe(parseInt(quantity));
    });

    and(/^the cart total should be \$(\d+)\.(\d+)$/, (dollars, cents) => {
      const expectedTotal = parseInt(dollars) + (parseInt(cents) / 100);
      expect(hookResult.result.current.totalPrice).toBe(expectedTotal);
    });

    and('the cart should be saved to localStorage', () => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'cart',
        expect.stringContaining('T-Shirt')
      );
    });
  });

  test('Add existing product to cart', ({ given, when, then, and }) => {
    given('the cart system is working', () => {
      expect(useCart).toBeDefined();
    });

    and('there are products available in the marketplace', () => {
      expect(product1).toBeDefined();
      expect(product2).toBeDefined();
    });

    and('localStorage is available for persistence', () => {
      expect(localStorageMock).toBeDefined();
      expect(localStorageMock.setItem).toBeDefined();
    });

    given(/^there is a product "(.*)" already in the cart with quantity (\d+)$/, (productName, quantity) => {
      hookResult = renderHook(() => useCart());
      
      act(() => {
        hookResult.result.current.addToCart(product1, parseInt(quantity));
      });
      
      expect(hookResult.result.current.items).toHaveLength(1);
      expect(hookResult.result.current.items[0].quantity).toBe(parseInt(quantity));
    });

    when(/^the customer adds (\d+) more units of the same product$/, (quantity) => {
      act(() => {
        hookResult.result.current.addToCart(product1, parseInt(quantity));
      });
    });

    then(/^the cart should contain (\d+) item$/, (itemCount) => {
      expect(hookResult.result.current.items).toHaveLength(parseInt(itemCount));
    });

    and(/^the item quantity should be (\d+)$/, (quantity) => {
      expect(hookResult.result.current.items[0].quantity).toBe(parseInt(quantity));
      expect(hookResult.result.current.totalItems).toBe(parseInt(quantity));
    });

    and(/^the total should be updated to \$(\d+)\.(\d+)$/, (dollars, cents) => {
      const expectedTotal = parseInt(dollars) + (parseInt(cents) / 100);
      expect(hookResult.result.current.totalPrice).toBe(expectedTotal);
    });
  });

  test('Update product quantity in cart', ({ given, when, then, and }) => {
    given('the cart system is working', () => {
      expect(useCart).toBeDefined();
    });

    and('there are products available in the marketplace', () => {
      expect(product1).toBeDefined();
      expect(product2).toBeDefined();
    });

    and('localStorage is available for persistence', () => {
      expect(localStorageMock).toBeDefined();
      expect(localStorageMock.setItem).toBeDefined();
    });

    given(/^there is a product "(.*)" in the cart with quantity (\d+)$/, (productName, quantity) => {
      hookResult = renderHook(() => useCart());
      
      act(() => {
        hookResult.result.current.addToCart(product1, parseInt(quantity));
      });
      
      expect(hookResult.result.current.items[0].quantity).toBe(parseInt(quantity));
    });

    when(/^the customer updates the quantity to (\d+)$/, (quantity) => {
      act(() => {
        hookResult.result.current.updateQuantity(product1.id, parseInt(quantity));
      });
    });

    then(/^the product quantity should be (\d+)$/, (quantity) => {
      expect(hookResult.result.current.items[0].quantity).toBe(parseInt(quantity));
      expect(hookResult.result.current.totalItems).toBe(parseInt(quantity));
    });

    and(/^the total should be updated to \$(\d+)\.(\d+)$/, (dollars, cents) => {
      const expectedTotal = parseInt(dollars) + (parseInt(cents) / 100);
      expect(hookResult.result.current.totalPrice).toBe(expectedTotal);
    });

    and('changes should be saved to localStorage', () => {
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });

  test('Remove product from cart', ({ given, when, then, and }) => {
    given('the cart system is working', () => {
      expect(useCart).toBeDefined();
    });

    and('there are products available in the marketplace', () => {
      expect(product1).toBeDefined();
      expect(product2).toBeDefined();
    });

    and('localStorage is available for persistence', () => {
      expect(localStorageMock).toBeDefined();
      expect(localStorageMock.setItem).toBeDefined();
    });

    given('there are 2 different products in the cart', () => {
      hookResult = renderHook(() => useCart());
      
      act(() => {
        hookResult.result.current.addToCart(product1, 1);
        hookResult.result.current.addToCart(product2, 1);
      });
      
      expect(hookResult.result.current.items).toHaveLength(2);
    });

    when('the customer removes one of the products', () => {
      act(() => {
        hookResult.result.current.removeFromCart(product1.id);
      });
    });

    then('the cart should contain only 1 product', () => {
      expect(hookResult.result.current.items).toHaveLength(1);
    });

    and('the total should be recalculated', () => {
      // Product2 has 10% discount: 200 * 0.9 = 180
      expect(hookResult.result.current.totalPrice).toBe(180);
    });

    and('the removed product should not appear in the list', () => {
      const remainingProduct = hookResult.result.current.items[0];
      expect(remainingProduct.product.id).toBe(product2.id);
      expect(remainingProduct.product.id).not.toBe(product1.id);
    });
  });

  test('Clear cart completely', ({ given, when, then, and }) => {
    given('the cart system is working', () => {
      expect(useCart).toBeDefined();
    });

    and('there are products available in the marketplace', () => {
      expect(product1).toBeDefined();
      expect(product2).toBeDefined();
    });

    and('localStorage is available for persistence', () => {
      expect(localStorageMock).toBeDefined();
      expect(localStorageMock.setItem).toBeDefined();
    });

    given('there are 3 products in the cart', () => {
      hookResult = renderHook(() => useCart());
      
      const product3 = TestDataBuilder.createProduct({
        id: 'product-3',
        name: 'Pants',
        price: TestDataBuilder.createMoney(8000), // $80.00
      });
      
      act(() => {
        hookResult.result.current.addToCart(product1, 1);
        hookResult.result.current.addToCart(product2, 1);
        hookResult.result.current.addToCart(product3, 1);
      });
      
      expect(hookResult.result.current.items).toHaveLength(3);
    });

    when('the customer clears the cart', () => {
      act(() => {
        hookResult.result.current.clearCart();
      });
    });

    then('the cart should be empty', () => {
      expect(hookResult.result.current.items).toEqual([]);
      expect(hookResult.result.current.totalItems).toBe(0);
    });

    and('the total should be $0.00', () => {
      expect(hookResult.result.current.totalPrice).toBe(0);
      expect(hookResult.result.current.subtotal).toBe(0);
    });

    and('localStorage should be cleared', () => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('cart', '[]');
    });
  });

  test('Cart with discounted products', ({ given, when, then, and }) => {
    given('the cart system is working', () => {
      expect(useCart).toBeDefined();
    });

    and('there are products available in the marketplace', () => {
      expect(product1).toBeDefined();
      expect(product2).toBeDefined();
    });

    and('localStorage is available for persistence', () => {
      expect(localStorageMock).toBeDefined();
      expect(localStorageMock.setItem).toBeDefined();
    });

    given(/^there is a product "(.*)" with price \$(\d+)\.(\d+) and (\d+)% discount$/, (productName, dollars, cents, discount) => {
      expect(product2.name).toBe(productName);
      const expectedPrice = parseInt(dollars) + (parseInt(cents) / 100);
      expect(product2.price).toBe(expectedPrice);
      expect(product2.discountPercentage).toBe(parseInt(discount));
    });

    when('the customer adds 1 unit to the cart', () => {
      hookResult = renderHook(() => useCart());
      
      act(() => {
        hookResult.result.current.addToCart(product2, 1);
      });
    });

    then(/^the subtotal should be \$(\d+)\.(\d+)$/, (dollars, cents) => {
      const expectedSubtotal = parseInt(dollars) + (parseInt(cents) / 100);
      expect(hookResult.result.current.subtotal).toBe(expectedSubtotal);
    });

    and(/^the total with discount should be \$(\d+)\.(\d+)$/, (dollars, cents) => {
      const expectedTotal = parseInt(dollars) + (parseInt(cents) / 100);
      // 200 * (1 - 0.10) = 180
      expect(hookResult.result.current.totalPrice).toBe(expectedTotal);
    });

    and(/^the savings should be displayed as \$(\d+)\.(\d+)$/, (dollars, cents) => {
      const expectedSavings = parseInt(dollars) + (parseInt(cents) / 100);
      const savings = hookResult.result.current.subtotal - hookResult.result.current.totalPrice;
      expect(savings).toBe(expectedSavings);
    });
  });

  test('Check if product is in cart', ({ given, when, then, and }) => {
    given('the cart system is working', () => {
      expect(useCart).toBeDefined();
    });

    and('there are products available in the marketplace', () => {
      expect(product1).toBeDefined();
      expect(product2).toBeDefined();
    });

    and('localStorage is available for persistence', () => {
      expect(localStorageMock).toBeDefined();
      expect(localStorageMock.setItem).toBeDefined();
    });

    given(/^there is a product "(.*)" in the cart$/, (productName) => {
      hookResult = renderHook(() => useCart());
      
      act(() => {
        hookResult.result.current.addToCart(product1, 1);
      });
    });

    when('the system checks if the product is in the cart', () => {
      // This check will be done in the then
    });

    then('it should return true', () => {
      expect(hookResult.result.current.isInCart(product1.id)).toBe(true);
    });

    when('the system checks a product that is not in the cart', () => {
      // This check will be done in the then
    });

    then('it should return false', () => {
      expect(hookResult.result.current.isInCart(product2.id)).toBe(false);
    });
  });
});