import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NFT } from '@/types/nft';
import { Network } from '@/types/blockchain';

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  network: Network | null;
  balance: string | null;
  nfts: NFT[];
  error: string | null;
}

export interface WalletStore extends WalletState {
  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  setAddress: (address: string) => void;
  setNetwork: (network: Network) => void;
  setBalance: (balance: string) => void;
  setConnecting: (connecting: boolean) => void;
  setError: (error: string | null) => void;
  refreshBalance: () => Promise<void>;
  refreshNFTs: () => Promise<void>;
  addNFT: (nft: NFT) => void;
  removeNFT: (tokenId: string) => void;
  clearNFTs: () => void;
  signMessage: (message: string) => Promise<string>;
  switchNetwork: (network: Network) => Promise<void>;
  reset: () => void;
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      // Initial state
      address: null,
      isConnected: false,
      isConnecting: false,
      network: null,
      balance: null,
      nfts: [],
      error: null,

      // Actions
      connect: async () => {
        set({ isConnecting: true, error: null });
        
        try {
          // This will be implemented with Privy integration
          // For now, we'll simulate the connection
          const mockAddress = '0x' + Array.from({ length: 40 }, () => 
            Math.floor(Math.random() * 16).toString(16)
          ).join('');
          
          set({
            address: mockAddress,
            isConnected: true,
            isConnecting: false,
            error: null,
          });
        } catch (error) {
          set({
            isConnecting: false,
            error: error instanceof Error ? error.message : 'Falha ao conectar carteira',
          });
        }
      },

      disconnect: () => {
        set({
          address: null,
          isConnected: false,
          isConnecting: false,
          network: null,
          balance: null,
          nfts: [],
          error: null,
        });
      },

      setAddress: (address) => {
        set({ address });
      },

      setNetwork: (network) => {
        set({ network });
      },

      setBalance: (balance) => {
        set({ balance });
      },

      setConnecting: (connecting) => {
        set({ isConnecting: connecting });
      },

      setError: (error) => {
        set({ error });
      },

      refreshBalance: async () => {
        const { address, network } = get();
        if (!address || !network) return;

        try {
          // This will be implemented with Web3 provider
          // For now, we'll simulate a balance
          const mockBalance = (Math.random() * 10).toFixed(4);
          set({ balance: mockBalance });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Falha ao atualizar saldo',
          });
        }
      },

      refreshNFTs: async () => {
        const { address } = get();
        if (!address) return;

        try {
          // This will be implemented with NFT service
          // For now, we'll simulate NFTs
          const mockNFTs: NFT[] = [
            {
              tokenId: '1',
              contractAddress: '0x1234567890123456789012345678901234567890',
              owner: address,
              metadata: {
                name: 'NFT de Teste',
                description: 'Um NFT de teste para demonstração',
                image: 'https://via.placeholder.com/300x300',
              },
              tokenURI: 'https://ipfs.io/ipfs/QmTest',
              mintedAt: new Date(),
              transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
              blockNumber: 12345678,
            },
          ];
          
          set({ nfts: mockNFTs });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Falha ao carregar NFTs',
          });
        }
      },

      addNFT: (nft) => {
        const { nfts } = get();
        const existingIndex = nfts.findIndex(
          (existing) => existing.tokenId === nft.tokenId && 
                       existing.contractAddress === nft.contractAddress
        );

        if (existingIndex >= 0) {
          const updatedNFTs = [...nfts];
          updatedNFTs[existingIndex] = nft;
          set({ nfts: updatedNFTs });
        } else {
          set({ nfts: [...nfts, nft] });
        }
      },

      removeNFT: (tokenId) => {
        const { nfts } = get();
        set({ nfts: nfts.filter(nft => nft.tokenId !== tokenId) });
      },

      clearNFTs: () => {
        set({ nfts: [] });
      },

      signMessage: async (message: string) => {
        const { address, isConnected } = get();
        
        if (!isConnected || !address) {
          throw new Error('Carteira não conectada');
        }

        try {
          // This will be implemented with Privy signing
          // For now, we'll simulate a signature
          const mockSignature = '0x' + Array.from({ length: 130 }, () => 
            Math.floor(Math.random() * 16).toString(16)
          ).join('');
          
          return mockSignature;
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : 'Falha ao assinar mensagem');
        }
      },

      switchNetwork: async (network: Network) => {
        set({ isConnecting: true, error: null });
        
        try {
          // This will be implemented with network switching
          // For now, we'll just update the network
          set({ network, isConnecting: false });
        } catch (error) {
          set({
            isConnecting: false,
            error: error instanceof Error ? error.message : 'Falha ao trocar rede',
          });
        }
      },

      reset: () => {
        set({
          address: null,
          isConnected: false,
          isConnecting: false,
          network: null,
          balance: null,
          nfts: [],
          error: null,
        });
      },
    }),
    {
      name: 'xperience-wallet',
      partialize: (state) => ({
        address: state.address,
        isConnected: state.isConnected,
        network: state.network,
      }),
    }
  )
); 