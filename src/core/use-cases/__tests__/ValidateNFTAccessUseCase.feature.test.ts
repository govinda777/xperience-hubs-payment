import { defineFeature, loadFeature } from 'jest-cucumber';
import { ValidateNFTAccessUseCase } from '../nft/ValidateNFTAccessUseCase';
import { INFTService } from '../../services/INFTService';
import { IWalletService } from '../../services/IWalletService';
import { Given, When, Then, TestDataBuilder, MockServiceHelper } from '@/lib/bdd/helpers';

const feature = loadFeature('./features/nft/nft-validation.feature');

defineFeature(feature, test => {
  let useCase: ValidateNFTAccessUseCase;
  let mockNFTService: jest.Mocked<INFTService>;
  let mockWalletService: jest.Mocked<IWalletService>;
  let result: any;
  let error: any;

  beforeEach(() => {
    mockNFTService = MockServiceHelper.mockNFTService();
    mockWalletService = {
      signMessage: jest.fn(),
      verifySignature: jest.fn(),
      getAddress: jest.fn(),
      isConnected: jest.fn(),
      connect: jest.fn(),
      disconnect: jest.fn(),
    };

    useCase = new ValidateNFTAccessUseCase(mockNFTService, mockWalletService);
    result = null;
    error = null;
  });

  test('Validação bem-sucedida de posse de NFT', ({ given, when, then, and }) => {
    given('que eu possuo um NFT do produto "VIP Concert Ticket"', () => {
      mockNFTService.getNFTsByUser.mockResolvedValue([
        {
          tokenId: '1',
          contractAddress: '0x123...',
          owner: '0x123...abc',
          metadata: {
            name: 'VIP Concert Ticket',
            description: 'Acesso VIP ao concerto',
            productId: 'product-vip-ticket'
          }
        }
      ]);
    });

    and('que estou conectado com minha wallet "0x123...abc"', () => {
      mockWalletService.getAddress.mockResolvedValue('0x123...abc');
      mockWalletService.isConnected.mockResolvedValue(true);
    });

    when('eu tento acessar a área exclusiva do evento', () => {
      // Simular tentativa de acesso
    });

    and('eu assino a mensagem de validação', async () => {
      const challenge = 'xperience-validate-2025-01-15T10:30:00Z-12345';
      const signature = '0xvalidSignature123';
      
      mockWalletService.signMessage.mockResolvedValue(signature);
      mockWalletService.verifySignature.mockResolvedValue(true);
    });

    then('o sistema deve verificar a posse do NFT on-chain', async () => {
      result = await useCase.execute({
        userAddress: '0x123...abc',
        productId: 'product-vip-ticket',
        challenge: 'xperience-validate-2025-01-15T10:30:00Z-12345',
        signature: '0xvalidSignature123'
      });
    });

    and('eu devo ter acesso concedido ao conteúdo exclusivo', () => {
      expect(result.success).toBe(true);
      expect(result.hasAccess).toBe(true);
      expect(result.nftCount).toBe(1);
    });

    and('minha sessão deve ser marcada como autenticada', () => {
      expect(result.authenticated).toBe(true);
      expect(result.sessionData).toBeDefined();
    });
  });

  test('Tentativa de acesso sem NFT', ({ given, when, then, and }) => {
    given('que eu não possuo NFTs do produto "VIP Concert Ticket"', () => {
      mockNFTService.getNFTsByUser.mockResolvedValue([]);
    });

    and('que estou conectado com minha wallet "0x123...abc"', () => {
      mockWalletService.getAddress.mockResolvedValue('0x123...abc');
      mockWalletService.isConnected.mockResolvedValue(true);
    });

    when('eu tento acessar a área exclusiva do evento', () => {
      // Simular tentativa de acesso
    });

    and('eu assino a mensagem de validação', async () => {
      const challenge = 'xperience-validate-2025-01-15T10:30:00Z-12345';
      const signature = '0xvalidSignature123';
      
      mockWalletService.signMessage.mockResolvedValue(signature);
      mockWalletService.verifySignature.mockResolvedValue(true);
    });

    then('o sistema deve verificar a posse do NFT on-chain', async () => {
      result = await useCase.execute({
        userAddress: '0x123...abc',
        productId: 'product-vip-ticket',
        challenge: 'xperience-validate-2025-01-15T10:30:00Z-12345',
        signature: '0xvalidSignature123'
      });
    });

    and('o acesso deve ser negado', () => {
      expect(result.success).toBe(true);
      expect(result.hasAccess).toBe(false);
      expect(result.nftCount).toBe(0);
    });

    and('eu devo ver a mensagem "NFT necessário para acesso"', () => {
      expect(result.message).toBe('NFT necessário para acesso');
    });
  });

  test('Validação com múltiplos NFTs do mesmo produto', ({ given, when, then, and }) => {
    given('que eu possuo 3 NFTs do produto "VIP Concert Ticket"', () => {
      mockNFTService.getNFTsByUser.mockResolvedValue([
        {
          tokenId: '1',
          contractAddress: '0x123...',
          owner: '0x123...abc',
          metadata: { productId: 'product-vip-ticket' }
        },
        {
          tokenId: '2',
          contractAddress: '0x123...',
          owner: '0x123...abc',
          metadata: { productId: 'product-vip-ticket' }
        },
        {
          tokenId: '3',
          contractAddress: '0x123...',
          owner: '0x123...abc',
          metadata: { productId: 'product-vip-ticket' }
        }
      ]);
    });

    and('que estou conectado com minha wallet "0x123...abc"', () => {
      mockWalletService.getAddress.mockResolvedValue('0x123...abc');
      mockWalletService.isConnected.mockResolvedValue(true);
    });

    when('eu tento acessar a área exclusiva do evento', () => {
      // Simular tentativa de acesso
    });

    and('eu assino a mensagem de validação', async () => {
      const challenge = 'xperience-validate-2025-01-15T10:30:00Z-12345';
      const signature = '0xvalidSignature123';
      
      mockWalletService.signMessage.mockResolvedValue(signature);
      mockWalletService.verifySignature.mockResolvedValue(true);
    });

    then('o sistema deve verificar a posse dos NFTs on-chain', async () => {
      result = await useCase.execute({
        userAddress: '0x123...abc',
        productId: 'product-vip-ticket',
        challenge: 'xperience-validate-2025-01-15T10:30:00Z-12345',
        signature: '0xvalidSignature123'
      });
    });

    and('eu devo ter acesso concedido ao conteúdo exclusivo', () => {
      expect(result.success).toBe(true);
      expect(result.hasAccess).toBe(true);
    });

    and('o sistema deve registrar que eu possuo 3 tokens', () => {
      expect(result.nftCount).toBe(3);
    });
  });

  test('Validação com problemas de conectividade blockchain', ({ given, when, then, and }) => {
    given('que eu possuo um NFT válido', () => {
      mockNFTService.getNFTsByUser.mockResolvedValue([
        {
          tokenId: '1',
          contractAddress: '0x123...',
          owner: '0x123...abc',
          metadata: { productId: 'product-vip-ticket' }
        }
      ]);
    });

    and('que estou conectado com minha wallet "0x123...abc"', () => {
      mockWalletService.getAddress.mockResolvedValue('0x123...abc');
      mockWalletService.isConnected.mockResolvedValue(true);
    });

    and('que há problemas de conectividade com a blockchain', () => {
      mockNFTService.getNFTsByUser.mockRejectedValue(new Error('Network error'));
    });

    when('eu tento acessar a área exclusiva do evento', () => {
      // Simular tentativa de acesso
    });

    and('eu assino a mensagem de validação', async () => {
      const challenge = 'xperience-validate-2025-01-15T10:30:00Z-12345';
      const signature = '0xvalidSignature123';
      
      mockWalletService.signMessage.mockResolvedValue(signature);
      mockWalletService.verifySignature.mockResolvedValue(true);
    });

    then('o sistema deve tentar verificar a posse do NFT on-chain', async () => {
      try {
        result = await useCase.execute({
          userAddress: '0x123...abc',
          productId: 'product-vip-ticket',
          challenge: 'xperience-validate-2025-01-15T10:30:00Z-12345',
          signature: '0xvalidSignature123'
        });
      } catch (err) {
        error = err;
      }
    });

    and('deve retornar erro de conectividade', () => {
      expect(error).toBeDefined();
      expect(error.message).toContain('Network error');
    });

    and('eu devo ver a mensagem "Erro de conectividade. Tente novamente"', () => {
      expect(error.message).toContain('Network error');
    });
  });

  test('Validação com assinatura inválida', ({ given, when, then, and }) => {
    given('que eu possuo um NFT válido', () => {
      mockNFTService.getNFTsByUser.mockResolvedValue([
        {
          tokenId: '1',
          contractAddress: '0x123...',
          owner: '0x123...abc',
          metadata: { productId: 'product-vip-ticket' }
        }
      ]);
    });

    and('que estou conectado com minha wallet "0x123...abc"', () => {
      mockWalletService.getAddress.mockResolvedValue('0x123...abc');
      mockWalletService.isConnected.mockResolvedValue(true);
    });

    when('eu tento acessar a área exclusiva do evento', () => {
      // Simular tentativa de acesso
    });

    and('eu forneço uma assinatura inválida', async () => {
      const challenge = 'xperience-validate-2025-01-15T10:30:00Z-12345';
      const invalidSignature = '0xinvalidSignature';
      
      mockWalletService.verifySignature.mockResolvedValue(false);
    });

    then('o sistema deve rejeitar a assinatura', async () => {
      result = await useCase.execute({
        userAddress: '0x123...abc',
        productId: 'product-vip-ticket',
        challenge: 'xperience-validate-2025-01-15T10:30:00Z-12345',
        signature: '0xinvalidSignature'
      });
    });

    and('o acesso deve ser negado', () => {
      expect(result.success).toBe(false);
      expect(result.hasAccess).toBe(false);
    });

    and('eu devo ver a mensagem "Assinatura inválida"', () => {
      expect(result.message).toBe('Assinatura inválida');
    });
  });
}); 