import { defineFeature, loadFeature } from 'jest-cucumber';
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useWallet } from '../useWallet';
import { Given, When, Then, TestDataBuilder } from '@/lib/bdd/helpers';

const feature = loadFeature('./features/auth/login.feature');

defineFeature(feature, test => {
  let hookResult: any;
  let mockEthereum: any;

  beforeEach(() => {
    // Mock do objeto window.ethereum
    mockEthereum = {
      request: jest.fn(),
      on: jest.fn(),
      removeListener: jest.fn(),
      isMetaMask: true,
    };

    Object.defineProperty(window, 'ethereum', {
      value: mockEthereum,
      writable: true,
    });
  });

  test('Login bem-sucedido com carteira Web3', ({ given, when, then, and }) => {
    given('que o usuário possui uma carteira MetaMask configurada', () => {
      expect(window.ethereum).toBeDefined();
      expect(window.ethereum.isMetaMask).toBe(true);
    });

    and('que o usuário está na página de login', () => {
      hookResult = renderHook(() => useWallet());
      expect(hookResult.result.current.isConnected).toBe(false);
    });

    when('ele clica no botão "Conectar Carteira"', async () => {
      mockEthereum.request.mockResolvedValue(['0x742d35Cc6634C0532925a3b8D0C']);

      await act(async () => {
        await hookResult.result.current.connect();
      });
    });

    and('ele aprova a conexão na carteira', () => {
      expect(mockEthereum.request).toHaveBeenCalledWith({
        method: 'eth_requestAccounts'
      });
    });

    then('ele deve ser redirecionado para o dashboard', () => {
      expect(hookResult.result.current.isConnected).toBe(true);
    });

    and('deve ver seu endereço de carteira no header', () => {
      expect(hookResult.result.current.address).toBe('0x742d35Cc6634C0532925a3b8D0C');
    });

    and('sua sessão deve estar ativa', () => {
      expect(hookResult.result.current.isConnected).toBe(true);
      expect(hookResult.result.current.address).toBeDefined();
    });
  });

  test('Falha na conexão da carteira Web3', ({ given, when, then, and }) => {
    given('que o usuário está na página de login', () => {
      hookResult = renderHook(() => useWallet());
      expect(hookResult.result.current.isConnected).toBe(false);
    });

    and('que não há carteira instalada no navegador', () => {
      Object.defineProperty(window, 'ethereum', {
        value: undefined,
        writable: true,
      });
    });

    when('ele clica no botão "Conectar Carteira"', async () => {
      await act(async () => {
        try {
          await hookResult.result.current.connect();
        } catch (error) {
          // Esperado que falhe
        }
      });
    });

    then('deve ver a mensagem "Carteira não encontrada"', () => {
      expect(hookResult.result.current.error).toBe('Carteira não encontrada');
    });

    and('deve ser orientado a instalar uma carteira', () => {
      expect(hookResult.result.current.error).toContain('Carteira não encontrada');
    });

    and('deve permanecer na página de login', () => {
      expect(hookResult.result.current.isConnected).toBe(false);
    });
  });

  test('Desconexão da carteira', ({ given, when, then, and }) => {
    given('que o usuário está conectado com sua carteira', async () => {
      mockEthereum.request.mockResolvedValue(['0x742d35Cc6634C0532925a3b8D0C']);

      hookResult = renderHook(() => useWallet());

      await act(async () => {
        await hookResult.result.current.connect();
      });

      expect(hookResult.result.current.isConnected).toBe(true);
    });

    when('ele clica no botão "Desconectar"', async () => {
      await act(async () => {
        hookResult.result.current.disconnect();
      });
    });

    then('a conexão deve ser encerrada', () => {
      expect(hookResult.result.current.isConnected).toBe(false);
    });

    and('o endereço da carteira deve ser limpo', () => {
      expect(hookResult.result.current.address).toBe(null);
    });

    and('ele deve ser redirecionado para a página de login', () => {
      expect(hookResult.result.current.isConnected).toBe(false);
    });
  });

  test('Assinatura de mensagem', ({ given, when, then, and }) => {
    given('que o usuário está conectado com sua carteira', async () => {
      mockEthereum.request.mockResolvedValue(['0x742d35Cc6634C0532925a3b8D0C']);

      hookResult = renderHook(() => useWallet());

      await act(async () => {
        await hookResult.result.current.connect();
      });

      expect(hookResult.result.current.isConnected).toBe(true);
    });

    when('ele tenta assinar uma mensagem', async () => {
      const message = 'xperience-validate-2025-01-15T10:30:00Z-12345';
      const mockSignature = '0xvalidSignature123';

      mockEthereum.request.mockResolvedValue(mockSignature);

      await act(async () => {
        const signature = await hookResult.result.current.signMessage(message);
        expect(signature).toBe(mockSignature);
      });
    });

    then('a mensagem deve ser assinada com sucesso', () => {
      expect(mockEthereum.request).toHaveBeenCalledWith({
        method: 'personal_sign',
        params: [
          'xperience-validate-2025-01-15T10:30:00Z-12345',
          '0x742d35Cc6634C0532925a3b8D0C'
        ]
      });
    });

    and('a assinatura deve ser retornada', () => {
      expect(mockEthereum.request).toHaveBeenCalled();
    });
  });

  test('Mudança de conta na carteira', ({ given, when, then, and }) => {
    given('que o usuário está conectado com sua carteira', async () => {
      mockEthereum.request.mockResolvedValue(['0x742d35Cc6634C0532925a3b8D0C']);

      hookResult = renderHook(() => useWallet());

      await act(async () => {
        await hookResult.result.current.connect();
      });

      expect(hookResult.result.current.address).toBe('0x742d35Cc6634C0532925a3b8D0C');
    });

    when('o usuário muda de conta na carteira', async () => {
      const newAddress = '0x9876543210abcdef9876543210abcdef98765432';
      
      // Simular evento de mudança de conta
      const accountsChangedCallback = mockEthereum.on.mock.calls.find(
        call => call[0] === 'accountsChanged'
      )?.[1];

      if (accountsChangedCallback) {
        await act(async () => {
          accountsChangedCallback([newAddress]);
        });
      }
    });

    then('o endereço deve ser atualizado automaticamente', () => {
      expect(hookResult.result.current.address).toBe('0x9876543210abcdef9876543210abcdef98765432');
    });

    and('a conexão deve permanecer ativa', () => {
      expect(hookResult.result.current.isConnected).toBe(true);
    });
  });

  test('Erro na assinatura de mensagem', ({ given, when, then, and }) => {
    given('que o usuário está conectado com sua carteira', async () => {
      mockEthereum.request.mockResolvedValue(['0x742d35Cc6634C0532925a3b8D0C']);

      hookResult = renderHook(() => useWallet());

      await act(async () => {
        await hookResult.result.current.connect();
      });

      expect(hookResult.result.current.isConnected).toBe(true);
    });

    when('ele tenta assinar uma mensagem e o usuário rejeita', async () => {
      const message = 'xperience-validate-2025-01-15T10:30:00Z-12345';
      
      mockEthereum.request.mockRejectedValue(new Error('User rejected the request'));

      await act(async () => {
        try {
          await hookResult.result.current.signMessage(message);
        } catch (error) {
          // Esperado que falhe
        }
      });
    });

    then('deve receber um erro de assinatura rejeitada', () => {
      expect(mockEthereum.request).toHaveBeenCalledWith({
        method: 'personal_sign',
        params: [
          'xperience-validate-2025-01-15T10:30:00Z-12345',
          '0x742d35Cc6634C0532925a3b8D0C'
        ]
      });
    });

    and('o erro deve ser tratado adequadamente', () => {
      expect(hookResult.result.current.error).toBeDefined();
    });
  });
}); 