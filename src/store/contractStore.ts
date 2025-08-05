import { create } from 'zustand';
import { Merchant } from '@/core/entities/Merchant';
import { Product } from '@/core/entities/Product';

export interface ContractStore {
  // State
  currentMerchant: Merchant | null;
  products: Product[];
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  contractAddress: string | null;
  
  // Actions
  setCurrentMerchant: (merchant: Merchant | null) => void;
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setContractAddress: (address: string | null) => void;
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  removeProduct: (productId: string) => void;
  updateMerchant: (updates: Partial<Merchant>) => void;
  reset: () => void;
  
  // Getters
  getProductById: (id: string) => Product | null;
  getProductsByCategory: (category: string) => Product[];
  getActiveProducts: () => Product[];
  getAvailableProducts: () => Product[];
  getTotalProducts: () => number;
  isMerchantActive: () => boolean;
  getMerchantName: () => string;
  getMerchantTheme: () => any;
}

const initialState = {
  currentMerchant: null,
  products: [],
  isLoading: false,
  error: null,
  lastUpdate: null,
  contractAddress: null,
};

export const useContractStore = create<ContractStore>()((set, get) => ({
  ...initialState,

  // Actions
  setCurrentMerchant: (merchant) => set({ 
    currentMerchant: merchant,
    contractAddress: merchant?.contractAddress || null,
    lastUpdate: new Date()
  }),
  
  setProducts: (products) => set({ 
    products,
    lastUpdate: new Date()
  }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  setContractAddress: (address) => set({ contractAddress: address }),
  
  addProduct: (product) => set((state) => ({
    products: [...state.products, product],
    lastUpdate: new Date()
  })),
  
  updateProduct: (productId, updates) => set((state) => ({
    products: state.products.map(product => 
      product.id === productId 
        ? { ...product, ...updates, updatedAt: new Date() }
        : product
    ),
    lastUpdate: new Date()
  })),
  
  removeProduct: (productId) => set((state) => ({
    products: state.products.filter(product => product.id !== productId),
    lastUpdate: new Date()
  })),
  
  updateMerchant: (updates) => set((state) => ({
    currentMerchant: state.currentMerchant 
      ? { ...state.currentMerchant, ...updates, updatedAt: new Date() }
      : null,
    lastUpdate: new Date()
  })),
  
  reset: () => set(initialState),
  
  // Getters
  getProductById: (id) => {
    const state = get();
    return state.products.find(product => product.id === id) || null;
  },
  
  getProductsByCategory: (category) => {
    const state = get();
    return state.products.filter(product => product.category === category);
  },
  
  getActiveProducts: () => {
    const state = get();
    return state.products.filter(product => product.isActive);
  },
  
  getAvailableProducts: () => {
    const state = get();
    return state.products.filter(product => product.isActive && product.availability === 'available');
  },
  
  getTotalProducts: () => {
    const state = get();
    return state.products.length;
  },
  
  isMerchantActive: () => {
    const state = get();
    return state.currentMerchant?.isActive() || false;
  },
  
  getMerchantName: () => {
    const state = get();
    return state.currentMerchant?.getDisplayName() || 'Loja';
  },
  
  getMerchantTheme: () => {
    const state = get();
    return state.currentMerchant?.theme || {
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      fontFamily: 'Inter, sans-serif'
    };
  },
}));