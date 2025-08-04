import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/core/entities/User';
import { Order } from '@/core/entities/Order';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface UserStore {
  // State
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  orders: Order[];
  
  // Actions
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  updateProfile: (updates: Partial<User>) => void;
  addFavoriteMerchant: (merchantId: string) => void;
  removeFavoriteMerchant: (merchantId: string) => void;
  logout: () => void;
  reset: () => void;
  
  // Getters
  getDisplayName: () => string;
  getEmail: () => string | null;
  getWalletAddress: () => string | null;
  getPrimaryWallet: () => any;
  isTokenValid: () => boolean;
  hasOrders: () => boolean;
  getTotalOrders: () => number;
  getTotalSpent: () => any;
  getFavoritesMerchants: () => string[];
  isFavoriteMerchant: (merchantId: string) => boolean;
}

const initialState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  orders: [],
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Actions
      setUser: (user) => set({ 
        user,
        isAuthenticated: user !== null
      }),
      
      setTokens: (tokens) => set({ 
        tokens,
        isAuthenticated: tokens !== null
      }),
      
      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      setOrders: (orders) => set({ orders }),
      
      addOrder: (order) => set((state) => ({
        orders: [order, ...state.orders]
      })),
      
      updateOrder: (orderId, updates) => set((state) => ({
        orders: state.orders.map(order => 
          order.id === orderId 
            ? { ...order, ...updates, updatedAt: new Date() }
            : order
        )
      })),
      
      updateProfile: (updates) => set((state) => ({
        user: state.user 
          ? { ...state.user, ...updates, updatedAt: new Date() }
          : null
      })),
      
      addFavoriteMerchant: (merchantId) => set((state) => {
        if (!state.user) return state;
        
        if (!state.user.stats.favoriteMerchants.includes(merchantId)) {
          const updatedUser = { ...state.user };
          updatedUser.stats.favoriteMerchants.push(merchantId);
          updatedUser.updatedAt = new Date();
          return { user: updatedUser };
        }
        
        return state;
      }),
      
      removeFavoriteMerchant: (merchantId) => set((state) => {
        if (!state.user) return state;
        
        const updatedUser = { ...state.user };
        updatedUser.stats.favoriteMerchants = updatedUser.stats.favoriteMerchants.filter(
          id => id !== merchantId
        );
        updatedUser.updatedAt = new Date();
        
        return { user: updatedUser };
      }),
      
      logout: () => set({
        user: null,
        tokens: null,
        isAuthenticated: false,
        orders: [],
        error: null
      }),
      
      reset: () => set(initialState),
      
      // Getters
      getDisplayName: () => {
        const state = get();
        return state.user?.getDisplayName() || 'Usuário';
      },
      
      getEmail: () => {
        const state = get();
        return state.user?.getEmail() || null;
      },
      
      getWalletAddress: () => {
        const state = get();
        return state.user?.getWalletAddress() || null;
      },
      
      getPrimaryWallet: () => {
        const state = get();
        return state.user?.getPrimaryWallet() || null;
      },
      
      isTokenValid: () => {
        const state = get();
        if (!state.tokens) return false;
        
        const now = new Date();
        const expiresAt = new Date(state.tokens.expiresAt);
        return now < expiresAt;
      },
      
      hasOrders: () => {
        const state = get();
        return state.orders.length > 0;
      },
      
      getTotalOrders: () => {
        const state = get();
        return state.orders.length;
      },
      
      getTotalSpent: () => {
        const state = get();
        return state.user?.stats.totalSpent || { amount: 0, currency: 'BRL', formatted: 'R$ 0,00' };
      },
      
      getFavoritesMerchants: () => {
        const state = get();
        return state.user?.stats.favoriteMerchants || [];
      },
      
      isFavoriteMerchant: (merchantId) => {
        const state = get();
        return state.user?.stats.favoriteMerchants.includes(merchantId) || false;
      },
    }),
    {
      name: 'xperience-user',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
        orders: state.orders,
      }),
    }
  )
);