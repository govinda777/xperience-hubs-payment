import { useState, useEffect, useCallback } from 'react';

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  balance: string;
  chainId: number | null;
  error: string | null;
}

export interface UseWalletReturn extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  signMessage: (message: string) => Promise<string>;
  switchNetwork: (chainId: number) => Promise<void>;
}

export const useWallet = (): UseWalletReturn => {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    balance: '0',
    chainId: null,
    error: null,
  });

  const connect = useCallback(async () => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));
    
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const address = accounts[0];
      
      // Get chain ID
      const chainId = await window.ethereum.request({ 
        method: 'eth_chainId' 
      });
      
      // Get balance
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });

      setState({
        address,
        isConnected: true,
        isConnecting: false,
        balance: balance || '0',
        chainId: parseInt(chainId, 16),
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Failed to connect wallet',
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      address: null,
      isConnected: false,
      isConnecting: false,
      balance: '0',
      chainId: null,
      error: null,
    });
  }, []);

  const signMessage = useCallback(async (message: string): Promise<string> => {
    if (!state.address || !state.isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, state.address],
      });
      
      return signature;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to sign message');
    }
  }, [state.address, state.isConnected]);

  const switchNetwork = useCallback(async (chainId: number) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to switch network');
    }
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum === 'undefined') return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setState(prev => ({ ...prev, address: accounts[0] }));
      }
    };

    const handleChainChanged = (chainId: string) => {
      setState(prev => ({ ...prev, chainId: parseInt(chainId, 16) }));
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    signMessage,
    switchNetwork,
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: any) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
} 