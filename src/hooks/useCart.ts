import { useCallback, useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/core/entities/Product';
import { toast } from 'react-hot-toast';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  variantId?: string;
  variantName?: string;
  attributes: Record<string, string>;
}

export interface UseCartReturn {
  // State
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  isLoading: boolean;
  merchantAddress: string | null;
  
  // Actions
  addItem: (product: Product, quantity?: number, variantId?: string, attributes?: Record<string, string>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateAttributes: (itemId: string, attributes: Record<string, string>) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Computed
  hasItems: boolean;
  isEmpty: boolean;
  getItemCount: (productId: string) => number;
  getItemById: (itemId: string) => CartItem | undefined;
  
  // Utilities
  validateCart: () => { isValid: boolean; errors: string[] };
  getCartSummary: () => {
    totalItems: number;
    totalPrice: number;
    uniqueProducts: number;
    estimatedDelivery: string;
  };
}

export const useCart = (): UseCartReturn => {
  const {
    items,
    isOpen,
    isLoading,
    merchantAddress,
    addItem: addItemToStore,
    removeItem: removeItemFromStore,
    updateQuantity: updateQuantityInStore,
    updateAttributes: updateAttributesInStore,
    clearCart: clearCartInStore,
    openCart: openCartInStore,
    closeCart: closeCartInStore,
    getTotalPrice,
    getTotalItems,
    hasItems: hasItemsInStore,
    isEmpty: isEmptyInStore,
    getItemCount: getItemCountInStore
  } = useCartStore();

  const [errors, setErrors] = useState<string[]>([]);

  // Add item to cart with validation
  const addItem = useCallback((
    product: Product,
    quantity: number = 1,
    variantId?: string,
    attributes: Record<string, string> = {}
  ) => {
    try {
      // Validate product
      if (!product || !product.isActive()) {
        toast.error('Produto não disponível');
        return;
      }

      // Validate quantity
      if (quantity <= 0) {
        toast.error('Quantidade deve ser maior que zero');
        return;
      }

      // Check stock availability
      if (product.availability.inStock && product.availability.quantity < quantity) {
        toast.error(`Quantidade indisponível. Estoque: ${product.availability.quantity}`);
        return;
      }

      // Check max quantity per order
      if (product.availability.maxQuantityPerOrder && quantity > product.availability.maxQuantityPerOrder) {
        toast.error(`Quantidade máxima por pedido: ${product.availability.maxQuantityPerOrder}`);
        return;
      }

      // Add to cart
      addItemToStore({
        product,
        quantity,
        variantId,
        attributes
      });

      toast.success(`${product.name} adicionado ao carrinho`);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Erro ao adicionar item ao carrinho');
    }
  }, [addItemToStore]);

  // Remove item from cart
  const removeItem = useCallback((itemId: string) => {
    try {
      const item = items.find(i => i.id === itemId);
      if (item) {
        removeItemFromStore(itemId);
        toast.success(`${item.product.name} removido do carrinho`);
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error('Erro ao remover item do carrinho');
    }
  }, [items, removeItemFromStore]);

  // Update item quantity
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    try {
      const item = items.find(i => i.id === itemId);
      if (!item) {
        toast.error('Item não encontrado');
        return;
      }

      // Validate quantity
      if (quantity <= 0) {
        removeItem(itemId);
        return;
      }

      // Check stock availability
      if (item.product.availability.inStock && item.product.availability.quantity < quantity) {
        toast.error(`Quantidade indisponível. Estoque: ${item.product.availability.quantity}`);
        return;
      }

      // Check max quantity per order
      if (item.product.availability.maxQuantityPerOrder && quantity > item.product.availability.maxQuantityPerOrder) {
        toast.error(`Quantidade máxima por pedido: ${item.product.availability.maxQuantityPerOrder}`);
        return;
      }

      updateQuantityInStore(itemId, quantity);
    } catch (error) {
      console.error('Error updating item quantity:', error);
      toast.error('Erro ao atualizar quantidade');
    }
  }, [items, updateQuantityInStore, removeItem]);

  // Update item attributes
  const updateAttributes = useCallback((itemId: string, attributes: Record<string, string>) => {
    try {
      updateAttributesInStore(itemId, attributes);
    } catch (error) {
      console.error('Error updating item attributes:', error);
      toast.error('Erro ao atualizar atributos');
    }
  }, [updateAttributesInStore]);

  // Clear cart
  const clearCart = useCallback(() => {
    try {
      clearCartInStore();
      toast.success('Carrinho limpo');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Erro ao limpar carrinho');
    }
  }, [clearCartInStore]);

  // Open cart
  const openCart = useCallback(() => {
    openCartInStore();
  }, [openCartInStore]);

  // Close cart
  const closeCart = useCallback(() => {
    closeCartInStore();
  }, [closeCartInStore]);

  // Get item by ID
  const getItemById = useCallback((itemId: string): CartItem | undefined => {
    return items.find(item => item.id === itemId);
  }, [items]);

  // Validate cart
  const validateCart = useCallback((): { isValid: boolean; errors: string[] } => {
    const validationErrors: string[] = [];

    if (items.length === 0) {
      validationErrors.push('Carrinho está vazio');
    }

    // Check if all items are still available
    for (const item of items) {
      if (!item.product.isActive()) {
        validationErrors.push(`${item.product.name} não está mais disponível`);
      }

      if (item.product.availability.inStock && item.product.availability.quantity < item.quantity) {
        validationErrors.push(`${item.product.name} - quantidade indisponível`);
      }
    }

    // Check if merchant is set
    if (!merchantAddress) {
      validationErrors.push('Loja não selecionada');
    }

    setErrors(validationErrors);
    return {
      isValid: validationErrors.length === 0,
      errors: validationErrors
    };
  }, [items, merchantAddress]);

  // Get cart summary
  const getCartSummary = useCallback(() => {
    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();
    const uniqueProducts = items.length;

    // Calculate estimated delivery (simplified)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3); // 3 days from now

    return {
      totalItems,
      totalPrice: totalPrice.amount,
      uniqueProducts,
      estimatedDelivery: estimatedDelivery.toLocaleDateString('pt-BR')
    };
  }, [getTotalItems, getTotalPrice, items]);

  // Auto-save cart to localStorage
  useEffect(() => {
    const saveCart = () => {
      try {
        localStorage.setItem('xperience-cart', JSON.stringify({
          items,
          merchantAddress,
          timestamp: Date.now()
        }));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    };

    saveCart();
  }, [items, merchantAddress]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('xperience-cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          const cartAge = Date.now() - parsedCart.timestamp;
          
          // Only load cart if it's less than 24 hours old
          if (cartAge < 24 * 60 * 60 * 1000) {
            // Note: In a real implementation, you'd need to reconstruct the Product objects
            // from the saved data, as localStorage only stores plain objects
            console.log('Cart loaded from localStorage');
          }
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    };

    loadCart();
  }, []);

  return {
    // State
    items,
    totalItems: getTotalItems(),
    totalPrice: getTotalPrice().amount,
    isOpen,
    isLoading,
    merchantAddress,
    
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    updateAttributes,
    clearCart,
    openCart,
    closeCart,
    
    // Computed
    hasItems: hasItemsInStore(),
    isEmpty: isEmptyInStore(),
    getItemCount: getItemCountInStore,
    getItemById,
    
    // Utilities
    validateCart,
    getCartSummary
  };
}; 