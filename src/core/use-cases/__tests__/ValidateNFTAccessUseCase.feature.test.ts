import { defineFeature, loadFeature } from 'jest-cucumber';
import { ValidateNFTAccessUseCase } from '../nft/ValidateNFTAccessUseCase';
import { INFTService } from '../../services/INFTService';
import { IWalletService } from '../../services/IWalletService';
import { TestDataBuilder, Given, When, Then } from '@/lib/bdd/helpers';

// Load the corresponding .feature file
const feature = loadFeature('./features/nft/nft-validation.feature');

defineFeature(feature, test => {
  let validateNFTAccessUseCase: ValidateNFTAccessUseCase;
  let mockNFTService: jest.Mocked<INFTService>;
  let mockWalletService: jest.Mocked<IWalletService>;
  let result: any;
  let testContext: {
    walletAddress?: string;
    nftTokenId?: string;
    merchantContractAddress?: string;
    signature?: string;
    message?: string;
  };

  beforeEach(() => {
    // Mock services
    mockNFTService = {
      mintNFT: jest.fn(),
      getNFT: jest.fn(),
      transferNFT: jest.fn(),
      burnNFT: jest.fn(),
      getNFTsByUser: jest.fn(),
      getNFTsByMerchant: jest.fn(),
      validateNFTOwnership: jest.fn(),
      getNFTMetadata: jest.fn(),
    };

    mockWalletService = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      signMessage: jest.fn(),
      verifySignature: jest.fn(),
      getAddress: jest.fn(),
      isConnected: jest.fn(),
    };

    validateNFTAccessUseCase = new ValidateNFTAccessUseCase(
      mockNFTService,
      mockWalletService
    );

    testContext = {};
  });

  test('Successful NFT ownership validation for access control', ({ given, when, then, and }) => {
    given('a merchant has deployed their smart contract', () => {
      testContext.merchantContractAddress = '0xabcdef1234567890abcdef1234567890abcdef12';
    });

    and('the merchant has products with NFT access enabled', () => {
      // Merchant has NFT-enabled products configured
    });

    and('the PIX payment system is configured with split payments', () => {
      // PIX split payment system is configured
    });

    given('I have purchased a product with NFT access', () => {
      // Setup test data
      testContext.walletAddress = '0x1234567890123456789012345678901234567890';
      testContext.nftTokenId = 'nft-123';
    });

    and('the NFT has been minted to my wallet "0x1234567890123456789012345678901234567890"', () => {
      mockNFTService.getNFTsByUser.mockResolvedValue([
        {
          tokenId: testContext.nftTokenId!,
          contractAddress: testContext.merchantContractAddress!,
          owner: testContext.walletAddress!,
          metadata: {
            name: 'VIP Concert Ticket',
            description: 'Access to exclusive concert area',
            attributes: [{ trait_type: 'Access Level', value: 'VIP' }]
          }
        }
      ]);
    });

    and('I am trying to access exclusive content', () => {
      // Context is set up for access validation
      expect(testContext.walletAddress).toBeDefined();
    });

    when('I connect my wallet to the validation system', async () => {
      mockWalletService.isConnected.mockResolvedValue(true);
      mockWalletService.getAddress.mockResolvedValue(testContext.walletAddress!);
    });

    and('I sign a message to prove ownership', async () => {
      testContext.message = 'Validate NFT ownership for access control';
      testContext.signature = '0xvalidSignature123';
      
      mockWalletService.signMessage.mockResolvedValue(testContext.signature);
      mockWalletService.verifySignature.mockResolvedValue(true);
    });

    then('the system should verify I own the required NFT', async () => {
      mockNFTService.validateNFTOwnership.mockResolvedValue(true);
      
      result = await validateNFTAccessUseCase.execute({
        walletAddress: testContext.walletAddress!,
        merchantContractAddress: testContext.merchantContractAddress!,
        signature: testContext.signature!,
        message: testContext.message!,
        requiredAccessLevel: 'VIP'
      });

      expect(mockNFTService.validateNFTOwnership).toHaveBeenCalledWith(
        testContext.walletAddress!,
        testContext.merchantContractAddress!
      );
    });

    and('I should be granted access to exclusive content', () => {
      expect(result.success).toBe(true);
      expect(result.accessGranted).toBe(true);
      expect(result.accessLevel).toBe('VIP');
    });

    and('my access should be logged for audit purposes', () => {
      expect(result.auditLog).toBeDefined();
      expect(result.auditLog.walletAddress).toBe(testContext.walletAddress);
      expect(result.auditLog.timestamp).toBeDefined();
      expect(result.auditLog.action).toBe('NFT_ACCESS_VALIDATION');
    });
  });

  test('NFT validation with multiple NFTs from same merchant', ({ given, when, then, and }) => {
    given('a merchant has deployed their smart contract', () => {
      testContext.merchantContractAddress = '0xabcdef1234567890abcdef1234567890abcdef12';
    });

    and('the merchant has products with NFT access enabled', () => {
      // Merchant has NFT-enabled products configured
    });

    and('the PIX payment system is configured with split payments', () => {
      // PIX split payment system is configured
    });

    given('I have purchased multiple products from the same merchant', () => {
      testContext.walletAddress = '0x1234567890123456789012345678901234567890';
    });

    and('I have accumulated several NFTs in my wallet', () => {
      mockNFTService.getNFTsByUser.mockResolvedValue([
        {
          tokenId: 'nft-1',
          contractAddress: testContext.merchantContractAddress!,
          owner: testContext.walletAddress!,
          metadata: { name: 'VIP Ticket', attributes: [{ trait_type: 'Access Level', value: 'VIP' }] }
        },
        {
          tokenId: 'nft-2',
          contractAddress: testContext.merchantContractAddress!,
          owner: testContext.walletAddress!,
          metadata: { name: 'Backstage Pass', attributes: [{ trait_type: 'Access Level', value: 'BACKSTAGE' }] }
        },
        {
          tokenId: 'nft-3',
          contractAddress: testContext.merchantContractAddress!,
          owner: testContext.walletAddress!,
          metadata: { name: 'Merchandise Pack', attributes: [{ trait_type: 'Access Level', value: 'MERCH' }] }
        }
      ]);
    });

    when('I connect my wallet to access premium content', async () => {
      mockWalletService.isConnected.mockResolvedValue(true);
      mockWalletService.getAddress.mockResolvedValue(testContext.walletAddress!);
    });

    and('I sign the ownership verification message', async () => {
      testContext.signature = '0xvalidSignature456';
      mockWalletService.signMessage.mockResolvedValue(testContext.signature);
      mockWalletService.verifySignature.mockResolvedValue(true);
    });

    then('the system should verify I own at least one valid NFT', async () => {
      mockNFTService.validateNFTOwnership.mockResolvedValue(true);
      
      result = await validateNFTAccessUseCase.execute({
        walletAddress: testContext.walletAddress!,
        merchantContractAddress: testContext.merchantContractAddress!,
        signature: testContext.signature!,
        message: 'Validate NFT ownership',
        requiredAccessLevel: 'VIP'
      });

      expect(result.success).toBe(true);
    });

    and('I should be granted access to all content levels', () => {
      expect(result.accessGranted).toBe(true);
      expect(result.availableAccessLevels).toContain('VIP');
      expect(result.availableAccessLevels).toContain('BACKSTAGE');
      expect(result.availableAccessLevels).toContain('MERCH');
    });

    and('the system should show my complete NFT collection', () => {
      expect(result.nftCollection).toHaveLength(3);
      expect(result.nftCollection[0].metadata.name).toBe('VIP Ticket');
      expect(result.nftCollection[1].metadata.name).toBe('Backstage Pass');
      expect(result.nftCollection[2].metadata.name).toBe('Merchandise Pack');
    });
  });

  test('NFT validation failure for non-owner', ({ given, when, then, and }) => {
    given('a merchant has deployed their smart contract', () => {
      testContext.merchantContractAddress = '0xabcdef1234567890abcdef1234567890abcdef12';
    });

    and('the merchant has products with NFT access enabled', () => {
      // Merchant has NFT-enabled products configured
    });

    and('the PIX payment system is configured with split payments', () => {
      // PIX split payment system is configured
    });

    given('I am trying to access exclusive content', () => {
      testContext.walletAddress = '0x1234567890123456789012345678901234567890';
    });

    and('I do not own the required NFT', () => {
      mockNFTService.getNFTsByUser.mockResolvedValue([]);
      mockNFTService.validateNFTOwnership.mockResolvedValue(false);
    });

    when('I connect my wallet to the validation system', async () => {
      mockWalletService.isConnected.mockResolvedValue(true);
      mockWalletService.getAddress.mockResolvedValue(testContext.walletAddress!);
    });

    and('I attempt to sign the ownership verification', async () => {
      testContext.signature = '0xvalidSignature789';
      mockWalletService.signMessage.mockResolvedValue(testContext.signature);
      mockWalletService.verifySignature.mockResolvedValue(true);
    });

    then('the system should detect I do not own the required NFT', async () => {
      result = await validateNFTAccessUseCase.execute({
        walletAddress: testContext.walletAddress!,
        merchantContractAddress: testContext.merchantContractAddress!,
        signature: testContext.signature!,
        message: 'Validate NFT ownership',
        requiredAccessLevel: 'VIP'
      });

      expect(mockNFTService.validateNFTOwnership).toHaveBeenCalled();
    });

    and('I should be denied access to exclusive content', () => {
      expect(result.success).toBe(false);
      expect(result.accessGranted).toBe(false);
    });

    and('I should see a clear message explaining the requirement', () => {
      expect(result.errorMessage).toContain('NFT required');
      expect(result.errorMessage).toContain('purchase');
    });
  });

  test('NFT validation with expired or invalid NFT', ({ given, when, then, and }) => {
    given('I previously owned a valid NFT', () => {
      testContext.walletAddress = '0x1234567890123456789012345678901234567890';
      testContext.merchantContractAddress = '0xabcdef1234567890abcdef1234567890abcdef12';
    });

    and('the NFT has been transferred to another wallet', () => {
      mockNFTService.getNFTsByUser.mockResolvedValue([]);
      mockNFTService.validateNFTOwnership.mockResolvedValue(false);
    });

    when('I try to access exclusive content', () => {
      // Context is set up for access attempt
    });

    and('I connect my wallet for validation', async () => {
      mockWalletService.isConnected.mockResolvedValue(true);
      mockWalletService.getAddress.mockResolvedValue(testContext.walletAddress!);
    });

    then('the system should detect I no longer own the NFT', async () => {
      result = await validateNFTAccessUseCase.execute({
        walletAddress: testContext.walletAddress!,
        merchantContractAddress: testContext.merchantContractAddress!,
        signature: '0xsignature',
        message: 'Validate NFT ownership',
        requiredAccessLevel: 'VIP'
      });

      expect(result.success).toBe(false);
    });

    and('I should be denied access to exclusive content', () => {
      expect(result.accessGranted).toBe(false);
    });

    and('I should be informed that the NFT has been transferred', () => {
      expect(result.errorMessage).toContain('transferred');
      expect(result.errorMessage).toContain('no longer own');
    });
  });

  test('NFT validation with network connectivity issues', ({ given, when, then, and }) => {
    given('I have a valid NFT in my wallet', () => {
      testContext.walletAddress = '0x1234567890123456789012345678901234567890';
      testContext.merchantContractAddress = '0xabcdef1234567890abcdef1234567890abcdef12';
    });

    and('the blockchain network is experiencing connectivity issues', () => {
      mockNFTService.validateNFTOwnership.mockRejectedValue(new Error('Network connectivity issue'));
    });

    when('I attempt to validate my NFT ownership', async () => {
      try {
        result = await validateNFTAccessUseCase.execute({
          walletAddress: testContext.walletAddress!,
          merchantContractAddress: testContext.merchantContractAddress!,
          signature: '0xsignature',
          message: 'Validate NFT ownership',
          requiredAccessLevel: 'VIP'
        });
      } catch (error) {
        result = { success: false, error: error.message };
      }
    });

    then('the system should handle the network error gracefully', () => {
      expect(result.success).toBe(false);
      expect(result.error).toContain('Network connectivity');
    });

    and('I should see a temporary access message', () => {
      expect(result.errorMessage).toContain('temporary');
      expect(result.errorMessage).toContain('try again');
    });

    and('the system should retry validation when network is restored', () => {
      expect(result.retryAvailable).toBe(true);
      expect(result.retryAfter).toBeDefined();
    });
  });

  test('NFT metadata validation for specific content access', ({ given, when, then, and }) => {
    given('I have an NFT with specific metadata attributes', () => {
      testContext.walletAddress = '0x1234567890123456789012345678901234567890';
      testContext.merchantContractAddress = '0xabcdef1234567890abcdef1234567890abcdef12';
      
      mockNFTService.getNFTMetadata.mockResolvedValue({
        name: 'VIP Concert Ticket',
        description: 'Access to exclusive concert area',
        attributes: [
          { trait_type: 'Access Level', value: 'VIP' },
          { trait_type: 'Event Date', value: '2024-12-25' },
          { trait_type: 'Venue', value: 'Main Stage' }
        ]
      });
    });

    and('the exclusive content requires specific NFT attributes', () => {
      // Content requires VIP access level and specific event date
    });

    when('I attempt to access the content', () => {
      // Context is set up for access attempt
    });

    and('the system validates my NFT metadata', async () => {
      mockNFTService.validateNFTOwnership.mockResolvedValue(true);
      
      result = await validateNFTAccessUseCase.execute({
        walletAddress: testContext.walletAddress!,
        merchantContractAddress: testContext.merchantContractAddress!,
        signature: '0xsignature',
        message: 'Validate NFT ownership',
        requiredAccessLevel: 'VIP',
        requiredMetadata: {
          'Event Date': '2024-12-25',
          'Venue': 'Main Stage'
        }
      });
    });

    then('the system should check the NFT\'s specific attributes', () => {
      expect(mockNFTService.getNFTMetadata).toHaveBeenCalled();
    });

    and('I should only be granted access to content matching my NFT attributes', () => {
      expect(result.success).toBe(true);
      expect(result.accessGranted).toBe(true);
      expect(result.metadataValidation).toBe(true);
    });

    and('the validation should be logged with metadata details', () => {
      expect(result.auditLog.metadata).toBeDefined();
      expect(result.auditLog.metadata['Access Level']).toBe('VIP');
      expect(result.auditLog.metadata['Event Date']).toBe('2024-12-25');
         });
   });
}); 