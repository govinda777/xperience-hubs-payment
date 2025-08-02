import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/core/entities/Product';
import { Money } from '@/types/payment';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  variantId?: string;
  variantName?: string;
  attributes: Record<string, string>;
}

export interface CartStore {
  // State
  items: CartItem[];
  merchantAddress: string | null;
  isOpen: boolean;
  isLoading: boolean;

  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateAttributes: (id: string, attributes: Record<string, string>) => void;
  clearCart: () => void;
  setMerchant: (address: string) => void;
  openCart: () => void;
  closeCart: () => void;
  setLoading: (loading: boolean) => void;

  // Computed
  getTotalPrice: () => Money;
  getTotalItems: () => number;
  getItemCount: (productId: string) => number;
  hasItems: () => boolean;
  isEmpty: () => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      merchantAddress: null,
      isOpen: false,
      isLoading: false,

      // Actions
      addItem: (item) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          (i) => i.product.id === item.product.id && 
                 i.variantId === item.variantId &&
                 JSON.stringify(i.attributes) === JSON.stringify(item.attributes)
        );

        if (existingItemIndex >= 0) {
          // Update existing item quantity
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += item.quantity;
          set({ items: updatedItems });
        } else {
          // Add new item
          const newItem: CartItem = {
            ...item,
            id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (id) => {
        const { items } = get();
        set({ items: items.filter(item => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        const { items } = get();
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        const updatedItems = items.map(item =>
          item.id === id ? { ...item, quantity } : item
        );
        set({ items: updatedItems });
      },

      updateAttributes: (id, attributes) => {
        const { items } = get();
        const updatedItems = items.map(item =>
          item.id === id ? { ...item, attributes } : item
        );
        set({ items: updatedItems });
      },

      clearCart: () => {
        set({ items: [], merchantAddress: null });
      },

      setMerchant: (address) => {
        const { merchantAddress } = get();
        if (merchantAddress !== address) {
          // Clear cart if changing merchant
          set({ items: [], merchantAddress: address });
        } else {
          set({ merchantAddress: address });
        }
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // Computed
      getTotalPrice: () => {
        const { items } = get();
        const total = items.reduce((sum, item) => {
          const itemPrice = item.variantId 
            ? item.product.variants.find(v => v.id === item.variantId)?.price.amount || item.product.price.amount
            : item.product.price.amount;
          return sum + (itemPrice * item.quantity);
        }, 0);

        return {
          amount: total,
          currency: 'BRL',
          formatted: `R$ ${total.toFixed(2).replace('.', ',')}`,
        };
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getItemCount: (productId) => {
        const { items } = get();
        return items
          .filter(item => item.product.id === productId)
          .reduce((sum, item) => sum + item.quantity, 0);
      },

      hasItems: () => {
        const { items } = get();
        return items.length > 0;
      },

      isEmpty: () => {
        const { items } = get();
        return items.length === 0;
      },
    }),
    {
      name: 'xperience-cart',
      partialize: (state) => ({
        items: state.items,
        merchantAddress: state.merchantAddress,
      }),
    }
  )
); 