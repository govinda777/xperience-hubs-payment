import { useCallback, useEffect, useState } from 'react';
import { Product } from '@/core/entities/Product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface UseCartReturn {
  // State
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  
  // Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Computed
  isInCart: (productId: string) => boolean;
  getQuantity: (productId: string) => number;
  subtotal: number;
  
  // Utilities
  updateProduct: (product: Product) => void;
}

export const useCart = (): UseCartReturn => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items]);

  // Add product to cart
  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    if (quantity <= 0) return;

    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        };
        return newItems;
      } else {
        // Add new item
        return [...prevItems, { product, quantity }];
      }
    });
  }, []);

  // Remove product from cart
  const removeFromCart = useCallback((productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  }, []);

  // Update product quantity
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  }, [removeFromCart]);

  // Clear cart
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Check if product is in cart
  const isInCart = useCallback((productId: string) => {
    return items.some(item => item.product.id === productId);
  }, [items]);

  // Get product quantity
  const getQuantity = useCallback((productId: string) => {
    const item = items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }, [items]);

  // Update product data
  const updateProduct = useCallback((product: Product) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.product.id === product.id 
          ? { ...item, product } 
          : item
      )
    );
  }, []);

  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = items.reduce((sum, item) => {
    const basePrice = item.product.price.amount;
    const price = item.product.discountPercentage 
      ? basePrice * (1 - item.product.discountPercentage / 100)
      : basePrice;
    return sum + (price * item.quantity);
  }, 0);

  const subtotal = items.reduce((sum, item) => sum + (item.product.price.amount * item.quantity), 0);

  return {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getQuantity,
    subtotal,
    updateProduct
  };
}; 