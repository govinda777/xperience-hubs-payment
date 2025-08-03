import { renderHook, act } from '@testing-library/react';
import { useWalletStore } from '../walletStore';

describe('Wallet Store', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useWalletStore());
    act(() => {
      result.current.reset();
    });
  });

  describe('Initial State', () => {
    it('should have initial state', () => {
      const { result } = renderHook(() => useWalletStore());

      expect(result.current.address).toBe('');
      expect(result.current.isConnected).toBe(false);
      expect(result.current.isConnecting).toBe(false);
      expect(result.current.network).toBeNull();
      expect(result.current.balance).toBe('0');
      expect(result.current.nfts).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  describe('connect', () => {
    it('should connect wallet successfully', async () => {
      const { result } = renderHook(() => useWalletStore());
      const mockAddress = '0x1234567890123456789012345678901234567890';
      const mockNetwork = {
        chainId: 1,
        name: 'Ethereum',
        rpcUrl: 'https://mainnet.infura.io/v3/test'
      };

      await act(async () => {
        await result.current.connect(mockAddress, mockNetwork);
      });

      expect(result.current.address).toBe(mockAddress);
      expect(result.current.isConnected).toBe(true);
      expect(result.current.isConnecting).toBe(false);
      expect(result.current.network).toEqual(mockNetwork);
      expect(result.current.error).toBeNull();
    });

    it('should handle connection error', async () => {
      const { result } = renderHook(() => useWalletStore());
      const mockError = 'Connection failed';

      await act(async () => {
        await result.current.connect('', null);
      });

      expect(result.current.isConnected).toBe(false);
      expect(result.current.isConnecting).toBe(false);
      expect(result.current.error).toBe(mockError);
    });
  });

  describe('disconnect', () => {
    it('should disconnect wallet', () => {
      const { result } = renderHook(() => useWalletStore());

      act(() => {
        result.current.setAddress('0x1234567890123456789012345678901234567890');
        result.current.setNetwork({
          chainId: 1,
          name: 'Ethereum',
          rpcUrl: 'https://mainnet.infura.io/v3/test'
        });
        result.current.disconnect();
      });

      expect(result.current.address).toBe('');
      expect(result.current.isConnected).toBe(false);
      expect(result.current.network).toBeNull();
      expect(result.current.balance).toBe('0');
      expect(result.current.nfts).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  describe('setAddress', () => {
    it('should set wallet address', () => {
      const { result } = renderHook(() => useWalletStore());
      const address = '0x1234567890123456789012345678901234567890';

      act(() => {
        result.current.setAddress(address);
      });

      expect(result.current.address).toBe(address);
    });
  });

  describe('setNetwork', () => {
    it('should set network information', () => {
      const { result } = renderHook(() => useWalletStore());
      const network = {
        chainId: 137,
        name: 'Polygon',
        rpcUrl: 'https://polygon-rpc.com'
      };

      act(() => {
        result.current.setNetwork(network);
      });

      expect(result.current.network).toEqual(network);
    });
  });

  describe('setBalance', () => {
    it('should set wallet balance', () => {
      const { result } = renderHook(() => useWalletStore());
      const balance = '1.5';

      act(() => {
        result.current.setBalance(balance);
      });

      expect(result.current.balance).toBe(balance);
    });
  });

  describe('setConnecting', () => {
    it('should set connecting state', () => {
      const { result } = renderHook(() => useWalletStore());

      act(() => {
        result.current.setConnecting(true);
      });

      expect(result.current.isConnecting).toBe(true);

      act(() => {
        result.current.setConnecting(false);
      });

      expect(result.current.isConnecting).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      const { result } = renderHook(() => useWalletStore());
      const error = 'Network error occurred';

      act(() => {
        result.current.setError(error);
      });

      expect(result.current.error).toBe(error);
    });

    it('should clear error when set to null', () => {
      const { result } = renderHook(() => useWalletStore());

      act(() => {
        result.current.setError('Some error');
        result.current.setError(null);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('refreshBalance', () => {
    it('should refresh wallet balance', async () => {
      const { result } = renderHook(() => useWalletStore());
      const mockBalance = '2.5';

      await act(async () => {
        await result.current.refreshBalance();
      });

      expect(result.current.balance).toBe(mockBalance);
    });

    it('should handle balance refresh error', async () => {
      const { result } = renderHook(() => useWalletStore());

      await act(async () => {
        await result.current.refreshBalance();
      });

      expect(result.current.error).toBe('Failed to refresh balance');
    });
  });

  describe('refreshNFTs', () => {
    it('should refresh NFT list', async () => {
      const { result } = renderHook(() => useWalletStore());
      const mockNFTs = [
        {
          id: 'nft-1',
          name: 'Test NFT 1',
          image: 'https://example.com/nft1.jpg',
          tokenId: '1',
          contractAddress: '0x1234567890123456789012345678901234567890'
        }
      ];

      await act(async () => {
        await result.current.refreshNFTs();
      });

      expect(result.current.nfts).toEqual(mockNFTs);
    });

    it('should handle NFT refresh error', async () => {
      const { result } = renderHook(() => useWalletStore());

      await act(async () => {
        await result.current.refreshNFTs();
      });

      expect(result.current.error).toBe('Failed to refresh NFTs');
    });
  });

  describe('addNFT', () => {
    it('should add NFT to list', () => {
      const { result } = renderHook(() => useWalletStore());
      const nft = {
        id: 'nft-1',
        name: 'Test NFT',
        image: 'https://example.com/nft.jpg',
        tokenId: '1',
        contractAddress: '0x1234567890123456789012345678901234567890'
      };

      act(() => {
        result.current.addNFT(nft);
      });

      expect(result.current.nfts).toHaveLength(1);
      expect(result.current.nfts[0]).toEqual(nft);
    });

    it('should not add duplicate NFT', () => {
      const { result } = renderHook(() => useWalletStore());
      const nft = {
        id: 'nft-1',
        name: 'Test NFT',
        image: 'https://example.com/nft.jpg',
        tokenId: '1',
        contractAddress: '0x1234567890123456789012345678901234567890'
      };

      act(() => {
        result.current.addNFT(nft);
        result.current.addNFT(nft);
      });

      expect(result.current.nfts).toHaveLength(1);
    });
  });

  describe('removeNFT', () => {
    it('should remove NFT from list', () => {
      const { result } = renderHook(() => useWalletStore());
      const nft = {
        id: 'nft-1',
        name: 'Test NFT',
        image: 'https://example.com/nft.jpg',
        tokenId: '1',
        contractAddress: '0x1234567890123456789012345678901234567890'
      };

      act(() => {
        result.current.addNFT(nft);
        result.current.removeNFT('nft-1');
      });

      expect(result.current.nfts).toHaveLength(0);
    });

    it('should not remove non-existent NFT', () => {
      const { result } = renderHook(() => useWalletStore());
      const nft = {
        id: 'nft-1',
        name: 'Test NFT',
        image: 'https://example.com/nft.jpg',
        tokenId: '1',
        contractAddress: '0x1234567890123456789012345678901234567890'
      };

      act(() => {
        result.current.addNFT(nft);
        result.current.removeNFT('non-existent');
      });

      expect(result.current.nfts).toHaveLength(1);
    });
  });

  describe('clearNFTs', () => {
    it('should clear all NFTs', () => {
      const { result } = renderHook(() => useWalletStore());
      const nft1 = {
        id: 'nft-1',
        name: 'Test NFT 1',
        image: 'https://example.com/nft1.jpg',
        tokenId: '1',
        contractAddress: '0x1234567890123456789012345678901234567890'
      };
      const nft2 = {
        id: 'nft-2',
        name: 'Test NFT 2',
        image: 'https://example.com/nft2.jpg',
        tokenId: '2',
        contractAddress: '0x1234567890123456789012345678901234567890'
      };

      act(() => {
        result.current.addNFT(nft1);
        result.current.addNFT(nft2);
        result.current.clearNFTs();
      });

      expect(result.current.nfts).toHaveLength(0);
    });
  });

  describe('signMessage', () => {
    it('should sign message successfully', async () => {
      const { result } = renderHook(() => useWalletStore());
      const message = 'Test message to sign';
      const mockSignature = '0x1234567890abcdef';

      const signature = await act(async () => {
        return await result.current.signMessage(message);
      });

      expect(signature).toBe(mockSignature);
    });

    it('should handle signing error', async () => {
      const { result } = renderHook(() => useWalletStore());
      const message = 'Test message to sign';

      await act(async () => {
        await result.current.signMessage(message);
      });

      expect(result.current.error).toBe('Failed to sign message');
    });
  });

  describe('switchNetwork', () => {
    it('should switch network successfully', async () => {
      const { result } = renderHook(() => useWalletStore());
      const newNetwork = {
        chainId: 137,
        name: 'Polygon',
        rpcUrl: 'https://polygon-rpc.com'
      };

      await act(async () => {
        await result.current.switchNetwork(newNetwork);
      });

      expect(result.current.network).toEqual(newNetwork);
    });

    it('should handle network switch error', async () => {
      const { result } = renderHook(() => useWalletStore());
      const newNetwork = {
        chainId: 999,
        name: 'Invalid Network',
        rpcUrl: 'https://invalid-rpc.com'
      };

      await act(async () => {
        await result.current.switchNetwork(newNetwork);
      });

      expect(result.current.error).toBe('Failed to switch network');
    });
  });

  describe('reset', () => {
    it('should reset store to initial state', () => {
      const { result } = renderHook(() => useWalletStore());

      act(() => {
        result.current.setAddress('0x1234567890123456789012345678901234567890');
        result.current.setBalance('1.5');
        result.current.setError('Some error');
        result.current.reset();
      });

      expect(result.current.address).toBe('');
      expect(result.current.isConnected).toBe(false);
      expect(result.current.isConnecting).toBe(false);
      expect(result.current.network).toBeNull();
      expect(result.current.balance).toBe('0');
      expect(result.current.nfts).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });
}); 