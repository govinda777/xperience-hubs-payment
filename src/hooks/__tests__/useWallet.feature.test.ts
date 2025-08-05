import { defineFeature, loadFeature } from 'jest-cucumber';
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useWallet } from '../useWallet';
import { Given, When, Then, TestDataBuilder } from '@/lib/bdd/helpers';

// Load the corresponding .feature file
const feature = loadFeature('./features/auth/wallet-connection.feature');

defineFeature(feature, test => {
  let hookResult: any;
  let mockEthereum: any;

  beforeEach(() => {
    // Mock window.ethereum
    mockEthereum = {
      request: jest.fn(),
      on: jest.fn(),
      removeListener: jest.fn(),
    };

    Object.defineProperty(window, 'ethereum', {
      value: mockEthereum,
      writable: true,
    });

    jest.clearAllMocks();
  });

  test('Successful wallet connection', ({ given, when, then, and }) => {
    given('the wallet system is available', () => {
      expect(useWallet).toBeDefined();
    });

    and('MetaMask is installed in the browser', () => {
      expect(window.ethereum).toBeDefined();
    });

    and('the user is on the wallet connection page', () => {
      hookResult = renderHook(() => useWallet());
      expect(hookResult.result.current.isConnected).toBe(false);
    });

    given('the user clicks the "Connect Wallet" button', () => {
      // Setup mock responses
      mockEthereum.request
        .mockResolvedValueOnce(['0x1234567890123456789012345678901234567890']) // accounts
        .mockResolvedValueOnce('0x1') // chainId (mainnet)
        .mockResolvedValueOnce('0x1000000000000000000'); // balance (1 ETH)
    });

    when('MetaMask prompts for connection', () => {
      // This is handled by the mock above
    });

    and('the user approves the connection', () => {
      act(async () => {
        await hookResult.result.current.connect();
      });
    });

    then('the wallet should be connected', () => {
      expect(hookResult.result.current.isConnected).toBe(true);
    });

    and('the wallet address should be displayed', () => {
      expect(hookResult.result.current.address).toBe('0x1234567890123456789012345678901234567890');
    });

    and('the wallet balance should be shown', () => {
      expect(hookResult.result.current.balance).toBe('0x1000000000000000000');
    });

    and('the connection status should be "Connected"', () => {
      expect(hookResult.result.current.isConnected).toBe(true);
      expect(hookResult.result.current.error).toBe(null);
    });
  });

  test('Failed wallet connection', ({ given, when, then, and }) => {
    given('the wallet system is available', () => {
      expect(useWallet).toBeDefined();
    });

    and('MetaMask is installed in the browser', () => {
      expect(window.ethereum).toBeDefined();
    });

    and('the user is on the wallet connection page', () => {
      hookResult = renderHook(() => useWallet());
      expect(hookResult.result.current.isConnected).toBe(false);
    });

    given('the user clicks the "Connect Wallet" button', () => {
      // Setup mock to reject connection
      mockEthereum.request.mockRejectedValueOnce(new Error('User rejected connection'));
    });

    when('MetaMask prompts for connection', () => {
      // This is handled by the mock above
    });

    and('the user rejects the connection', () => {
      act(async () => {
        await hookResult.result.current.connect();
      });
    });

    then('the wallet should remain disconnected', () => {
      expect(hookResult.result.current.isConnected).toBe(false);
    });

    and('an error message should be displayed', () => {
      expect(hookResult.result.current.error).toBe('User rejected connection');
    });

    and('the connection status should be "Disconnected"', () => {
      expect(hookResult.result.current.isConnected).toBe(false);
    });
  });

  test('Wallet disconnection', ({ given, when, then, and }) => {
    given('the wallet system is available', () => {
      expect(useWallet).toBeDefined();
    });

    and('MetaMask is installed in the browser', () => {
      expect(window.ethereum).toBeDefined();
    });

    and('the user is on the wallet connection page', () => {
      hookResult = renderHook(() => useWallet());
    });

    given('the wallet is connected', () => {
      // Setup connected state
      mockEthereum.request
        .mockResolvedValueOnce(['0x1234567890123456789012345678901234567890'])
        .mockResolvedValueOnce('0x1')
        .mockResolvedValueOnce('0x1000000000000000000');

      act(async () => {
        await hookResult.result.current.connect();
      });

      expect(hookResult.result.current.isConnected).toBe(true);
    });

    when('the user clicks the "Disconnect" button', () => {
      act(() => {
        hookResult.result.current.disconnect();
      });
    });

    then('the wallet should be disconnected', () => {
      expect(hookResult.result.current.isConnected).toBe(false);
    });

    and('the wallet address should be cleared', () => {
      expect(hookResult.result.current.address).toBe(null);
    });

    and('the connection status should be "Disconnected"', () => {
      expect(hookResult.result.current.isConnected).toBe(false);
    });
  });

  test('Message signing', ({ given, when, then, and }) => {
    given('the wallet system is available', () => {
      expect(useWallet).toBeDefined();
    });

    and('MetaMask is installed in the browser', () => {
      expect(window.ethereum).toBeDefined();
    });

    and('the user is on the wallet connection page', () => {
      hookResult = renderHook(() => useWallet());
    });

    given('the wallet is connected', () => {
      // Setup connected state
      mockEthereum.request
        .mockResolvedValueOnce(['0x1234567890123456789012345678901234567890'])
        .mockResolvedValueOnce('0x1')
        .mockResolvedValueOnce('0x1000000000000000000');

      act(async () => {
        await hookResult.result.current.connect();
      });

      expect(hookResult.result.current.isConnected).toBe(true);
    });

    when('the user is prompted to sign a message', () => {
      // Setup mock for message signing
      mockEthereum.request.mockResolvedValueOnce('0xsignature123');
    });

    and('the user approves the signature', () => {
      // This is handled by the mock above
    });

    then('the message should be signed successfully', () => {
      // Test will be in the next step
    });

    and('the signature should be returned', async () => {
      const signature = await hookResult.result.current.signMessage('Test message');
      expect(signature).toBe('0xsignature123');
    });
  });

  test('Failed message signing', ({ given, when, then, and }) => {
    given('the wallet system is available', () => {
      expect(useWallet).toBeDefined();
    });

    and('MetaMask is installed in the browser', () => {
      expect(window.ethereum).toBeDefined();
    });

    and('the user is on the wallet connection page', () => {
      hookResult = renderHook(() => useWallet());
    });

    given('the wallet is connected', () => {
      // Setup connected state
      mockEthereum.request
        .mockResolvedValueOnce(['0x1234567890123456789012345678901234567890'])
        .mockResolvedValueOnce('0x1')
        .mockResolvedValueOnce('0x1000000000000000000');

      act(async () => {
        await hookResult.result.current.connect();
      });

      expect(hookResult.result.current.isConnected).toBe(true);
    });

    when('the user is prompted to sign a message', () => {
      // Setup mock to reject signature
      mockEthereum.request.mockRejectedValueOnce(new Error('User rejected signature'));
    });

    and('the user rejects the signature', () => {
      // This is handled by the mock above
    });

    then('the signature should fail', () => {
      // Test will be in the next step
    });

    and('an error message should be displayed', async () => {
      await expect(hookResult.result.current.signMessage('Test message')).rejects.toThrow('User rejected signature');
    });
  });

  test('Wallet not installed', ({ given, when, then, and }) => {
    given('the wallet system is available', () => {
      expect(useWallet).toBeDefined();
    });

    and('MetaMask is installed in the browser', () => {
      // This step is overridden by the next given
    });

    and('the user is on the wallet connection page', () => {
      // This step is overridden by the next given
    });

    given('MetaMask is not installed', () => {
      Object.defineProperty(window, 'ethereum', {
        value: undefined,
        writable: true,
      });
    });

    when('the user tries to connect a wallet', () => {
      hookResult = renderHook(() => useWallet());
    });

    then('an error message should be displayed', async () => {
      await expect(hookResult.result.current.connect()).rejects.toThrow('MetaMask is not installed');
    });

    and('the user should be prompted to install MetaMask', () => {
      expect(hookResult.result.current.error).toBe('MetaMask is not installed');
    });
  });
}); 