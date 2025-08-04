import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NFT } from '@/types/nft';

export interface WalletStore {
  // State
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  provider: any;
  nfts: NFT[];
  balance: string;
  network: {
    chainId: number;
    name: string;
  } | null;
  
  // Actions
  setAddress: (address: string | null) => void;
  setConnected: (connected: boolean) => void;
  setConnecting: (connecting: boolean) => void;
  setProvider: (provider: any) => void;
  setNFTs: (nfts: NFT[]) => void;
  setBalance: (balance: string) => void;
  setNetwork: (network: { chainId: number; name: string } | null) => void;
  addNFT: (nft: NFT) => void;
  removeNFT: (tokenId: string, contractAddress: string) => void;
  updateNFT: (tokenId: string, contractAddress: string, updates: Partial<NFT>) => void;
  reset: () => void;
  
  // Getters
  isWalletReady: () => boolean;
  hasNFTs: () => boolean;
  getNFTsByContract: (contractAddress: string) => NFT[];
  getTotalNFTs: () => number;
}

const initialState = {
  address: null,
  isConnected: false,
  isConnecting: false,
  provider: null,
  nfts: [],
  balance: '0',
  network: null,
};

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Actions
      setAddress: (address) => set({ address }),
      
      setConnected: (connected) => set({ 
        isConnected: connected,
        isConnecting: false 
      }),
      
      setConnecting: (connecting) => set({ isConnecting: connecting }),
      
      setProvider: (provider) => set({ provider }),
      
      setNFTs: (nfts) => set({ nfts }),
      
      setBalance: (balance) => set({ balance }),
      
      setNetwork: (network) => set({ network }),
      
      addNFT: (nft) => set((state) => {
        const existingIndex = state.nfts.findIndex(
          n => n.tokenId === nft.tokenId && n.contractAddress === nft.contractAddress
        );
        
        if (existingIndex >= 0) {
          const updatedNFTs = [...state.nfts];
          updatedNFTs[existingIndex] = nft;
          return { nfts: updatedNFTs };
        } else {
          return { nfts: [...state.nfts, nft] };
        }
      }),
      
      removeNFT: (tokenId, contractAddress) => set((state) => ({
        nfts: state.nfts.filter(
          nft => !(nft.tokenId === tokenId && nft.contractAddress === contractAddress)
        )
      })),
      
      updateNFT: (tokenId, contractAddress, updates) => set((state) => ({
        nfts: state.nfts.map(nft => 
          nft.tokenId === tokenId && nft.contractAddress === contractAddress
            ? { ...nft, ...updates }
            : nft
        )
      })),
      
      reset: () => set(initialState),
      
      // Getters
      isWalletReady: () => {
        const state = get();
        return state.isConnected && state.address !== null && state.provider !== null;
      },
      
      hasNFTs: () => {
        const state = get();
        return state.nfts.length > 0;
      },
      
      getNFTsByContract: (contractAddress) => {
        const state = get();
        return state.nfts.filter(nft => nft.contractAddress === contractAddress);
      },
      
      getTotalNFTs: () => {
        const state = get();
        return state.nfts.length;
      },
    }),
    {
      name: 'wallet-store',
      partialize: (state) => ({
        address: state.address,
        isConnected: state.isConnected,
        nfts: state.nfts,
        balance: state.balance,
        network: state.network,
      }),
    }
  )
);