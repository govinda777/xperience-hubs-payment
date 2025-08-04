import { Merchant, MerchantTheme, MerchantContact, MerchantAddress, MerchantSettings, MerchantStats } from '../Merchant';
import { Money } from '@/types/payment';

describe('Merchant Entity', () => {
  let merchant: Merchant;
  let mockTheme: MerchantTheme;
  let mockContact: MerchantContact;
  let mockAddress: MerchantAddress;
  let mockMoney: Money;

  beforeEach(() => {
    mockMoney = {
      amount: 1000000,
      currency: 'BRL',
      formatted: 'R$ 10.000,00'
    };

    mockTheme = {
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      fontFamily: 'Inter',
      logo: 'https://example.com/logo.png',
    };

    mockContact = {
      email: 'contato@merchant.com',
      phone: '+5511999999999',
      website: 'https://merchant.com',
      socialMedia: {
        instagram: '@merchant',
        facebook: 'merchant.page',
        twitter: '@merchant_twitter',
        linkedin: 'merchant-linkedin',
      },
    };

    mockAddress = {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Sala 456',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      country: 'Brasil',
    };

    merchant = new Merchant({
      id: 'merchant-123',
      contractAddress: '0x1234567890123456789012345678901234567890',
      name: 'Test Merchant',
      cnpj: '12.345.678/0001-90',
      pixKey: 'test@merchant.com',
      description: 'A test merchant for testing purposes',
      logo: 'https://example.com/merchant-logo.png',
      theme: mockTheme,
      contact: mockContact,
      address: mockAddress,
    });
  });

  describe('Constructor', () => {
    it('should create merchant with required fields', () => {
      expect(merchant.id).toBe('merchant-123');
      expect(merchant.contractAddress).toBe('0x1234567890123456789012345678901234567890');
      expect(merchant.name).toBe('Test Merchant');
      expect(merchant.cnpj).toBe('12.345.678/0001-90');
      expect(merchant.pixKey).toBe('test@merchant.com');
      expect(merchant.description).toBe('A test merchant for testing purposes');
      expect(merchant.logo).toBe('https://example.com/merchant-logo.png');
      expect(merchant.theme).toEqual(mockTheme);
      expect(merchant.contact).toEqual(mockContact);
      expect(merchant.address).toEqual(mockAddress);
    });

    it('should create merchant with default settings', () => {
      expect(merchant.settings.isActive).toBe(true);
      expect(merchant.settings.autoApproveOrders).toBe(false);
      expect(merchant.settings.requireNFTValidation).toBe(true);
      expect(merchant.settings.allowRefunds).toBe(true);
      expect(merchant.settings.maxRefundDays).toBe(7);
      expect(merchant.settings.notificationEmail).toBe(true);
      expect(merchant.settings.notificationSMS).toBe(false);
    });

    it('should create merchant with default stats', () => {
      expect(merchant.stats.totalSales.amount).toBe(0);
      expect(merchant.stats.totalOrders).toBe(0);
      expect(merchant.stats.averageOrderValue.amount).toBe(0);
      expect(merchant.stats.totalCustomers).toBe(0);
      expect(merchant.stats.totalProducts).toBe(0);
      expect(merchant.stats.totalNFTsMinted).toBe(0);
    });

    it('should create merchant with custom settings', () => {
      const customSettings: Partial<MerchantSettings> = {
        isActive: false,
        autoApproveOrders: true,
        requireNFTValidation: false,
        allowRefunds: false,
        maxRefundDays: 14,
        notificationEmail: false,
        notificationSMS: true,
        webhookUrl: 'https://webhook.example.com',
      };

      const customMerchant = new Merchant({
        id: 'merchant-456',
        contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        name: 'Custom Merchant',
        cnpj: '98.765.432/0001-10',
        pixKey: 'custom@merchant.com',
        description: 'Custom merchant',
        theme: mockTheme,
        contact: mockContact,
        address: mockAddress,
        settings: customSettings,
      });

      expect(customMerchant.settings.isActive).toBe(false);
      expect(customMerchant.settings.autoApproveOrders).toBe(true);
      expect(customMerchant.settings.requireNFTValidation).toBe(false);
      expect(customMerchant.settings.allowRefunds).toBe(false);
      expect(customMerchant.settings.maxRefundDays).toBe(14);
      expect(customMerchant.settings.notificationEmail).toBe(false);
      expect(customMerchant.settings.notificationSMS).toBe(true);
      expect(customMerchant.settings.webhookUrl).toBe('https://webhook.example.com');
    });

    it('should create merchant with custom stats', () => {
      const customStats: Partial<MerchantStats> = {
        totalSales: mockMoney,
        totalOrders: 100,
        averageOrderValue: { amount: 10000, currency: 'BRL', formatted: 'R$ 100,00' },
        totalCustomers: 50,
        totalProducts: 25,
        totalNFTsMinted: 10,
        lastOrderDate: new Date('2024-01-01'),
        lastPaymentDate: new Date('2024-01-02'),
      };

      const customMerchant = new Merchant({
        id: 'merchant-789',
        contractAddress: '0x789abcdef123456789abcdef123456789abcdef12',
        name: 'Stats Merchant',
        cnpj: '11.222.333/0001-44',
        pixKey: 'stats@merchant.com',
        description: 'Merchant with stats',
        theme: mockTheme,
        contact: mockContact,
        address: mockAddress,
        stats: customStats,
      });

      expect(customMerchant.stats.totalSales).toEqual(mockMoney);
      expect(customMerchant.stats.totalOrders).toBe(100);
      expect(customMerchant.stats.averageOrderValue.amount).toBe(10000);
      expect(customMerchant.stats.totalCustomers).toBe(50);
      expect(customMerchant.stats.totalProducts).toBe(25);
      expect(customMerchant.stats.totalNFTsMinted).toBe(10);
      expect(customMerchant.stats.lastOrderDate).toEqual(new Date('2024-01-01'));
      expect(customMerchant.stats.lastPaymentDate).toEqual(new Date('2024-01-02'));
    });
  });

  describe('updateProfile', () => {
    it('should update merchant profile fields', () => {
      const updates = {
        name: 'Updated Merchant Name',
        description: 'Updated description',
        logo: 'https://example.com/updated-logo.png',
        theme: {
          primaryColor: '#ff0000',
          secondaryColor: '#00ff00',
        } as Partial<MerchantTheme>,
        contact: {
          email: 'updated@merchant.com',
          phone: '+5511888888888',
        } as Partial<MerchantContact>,
        address: {
          street: 'Updated Street',
          city: 'Rio de Janeiro',
        } as Partial<MerchantAddress>,
      };

      const originalUpdatedAt = merchant.updatedAt;

      merchant.updateProfile(updates);

      expect(merchant.name).toBe('Updated Merchant Name');
      expect(merchant.description).toBe('Updated description');
      expect(merchant.logo).toBe('https://example.com/updated-logo.png');
      expect(merchant.theme.primaryColor).toBe('#ff0000');
      expect(merchant.theme.secondaryColor).toBe('#00ff00');
      expect(merchant.contact.email).toBe('updated@merchant.com');
      expect(merchant.contact.phone).toBe('+5511888888888');
      expect(merchant.address.street).toBe('Updated Street');
      expect(merchant.address.city).toBe('Rio de Janeiro');
      expect(merchant.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });

    it('should preserve existing theme properties when updating', () => {
      const themeUpdate = {
        primaryColor: '#ff0000',
      };

      merchant.updateProfile({ theme: themeUpdate });

      expect(merchant.theme.primaryColor).toBe('#ff0000');
      expect(merchant.theme.secondaryColor).toBe('#64748b'); // Preserved
      expect(merchant.theme.backgroundColor).toBe('#ffffff'); // Preserved
      expect(merchant.theme.textColor).toBe('#1f2937'); // Preserved
      expect(merchant.theme.fontFamily).toBe('Inter'); // Preserved
    });

    it('should preserve existing contact properties when updating', () => {
      const contactUpdate = {
        email: 'new@merchant.com',
      };

      merchant.updateProfile({ contact: contactUpdate });

      expect(merchant.contact.email).toBe('new@merchant.com');
      expect(merchant.contact.phone).toBe('+5511999999999'); // Preserved
      expect(merchant.contact.website).toBe('https://merchant.com'); // Preserved
      expect(merchant.contact.socialMedia).toEqual(mockContact.socialMedia); // Preserved
    });

    it('should preserve existing address properties when updating', () => {
      const addressUpdate = {
        street: 'New Street',
      };

      merchant.updateProfile({ address: addressUpdate });

      expect(merchant.address.street).toBe('New Street');
      expect(merchant.address.number).toBe('123'); // Preserved
      expect(merchant.address.city).toBe('São Paulo'); // Preserved
      expect(merchant.address.state).toBe('SP'); // Preserved
    });

    it('should update updatedAt timestamp', () => {
      const originalUpdatedAt = merchant.updatedAt;

      merchant.updateProfile({ name: 'New Name' });

      expect(merchant.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });

  describe('updateSettings', () => {
    it('should update merchant settings', () => {
      const settingsUpdate: Partial<MerchantSettings> = {
        isActive: false,
        autoApproveOrders: true,
        requireNFTValidation: false,
        allowRefunds: false,
        maxRefundDays: 30,
        notificationEmail: false,
        notificationSMS: true,
        webhookUrl: 'https://new-webhook.example.com',
      };

      const originalUpdatedAt = merchant.updatedAt;

      merchant.updateSettings(settingsUpdate);

      expect(merchant.settings.isActive).toBe(false);
      expect(merchant.settings.autoApproveOrders).toBe(true);
      expect(merchant.settings.requireNFTValidation).toBe(false);
      expect(merchant.settings.allowRefunds).toBe(false);
      expect(merchant.settings.maxRefundDays).toBe(30);
      expect(merchant.settings.notificationEmail).toBe(false);
      expect(merchant.settings.notificationSMS).toBe(true);
      expect(merchant.settings.webhookUrl).toBe('https://new-webhook.example.com');
      expect(merchant.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });

    it('should preserve existing settings when updating partial', () => {
      const settingsUpdate = {
        isActive: false,
      };

      merchant.updateSettings(settingsUpdate);

      expect(merchant.settings.isActive).toBe(false);
      expect(merchant.settings.autoApproveOrders).toBe(false); // Preserved
      expect(merchant.settings.requireNFTValidation).toBe(true); // Preserved
      expect(merchant.settings.allowRefunds).toBe(true); // Preserved
    });
  });

  describe('updatePixKey', () => {
    it('should update PIX key', () => {
      const newPixKey = 'new@merchant.com';
      const originalUpdatedAt = merchant.updatedAt;

      merchant.updatePixKey(newPixKey);

      expect(merchant.pixKey).toBe(newPixKey);
      expect(merchant.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('activate', () => {
    it('should activate merchant', () => {
      merchant.settings.isActive = false;
      const originalUpdatedAt = merchant.updatedAt;

      merchant.activate();

      expect(merchant.settings.isActive).toBe(true);
      expect(merchant.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('deactivate', () => {
    it('should deactivate merchant', () => {
      merchant.settings.isActive = true;
      const originalUpdatedAt = merchant.updatedAt;

      merchant.deactivate();

      expect(merchant.settings.isActive).toBe(false);
      expect(merchant.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('updateStats', () => {
    it('should update merchant stats', () => {
      const statsUpdate: Partial<MerchantStats> = {
        totalSales: mockMoney,
        totalOrders: 150,
        averageOrderValue: { amount: 15000, currency: 'BRL', formatted: 'R$ 150,00' },
        totalCustomers: 75,
        totalProducts: 30,
        totalNFTsMinted: 15,
        lastOrderDate: new Date('2024-02-01'),
        lastPaymentDate: new Date('2024-02-02'),
      };

      const originalUpdatedAt = merchant.updatedAt;

      merchant.updateStats(statsUpdate);

      expect(merchant.stats.totalSales).toEqual(mockMoney);
      expect(merchant.stats.totalOrders).toBe(150);
      expect(merchant.stats.averageOrderValue.amount).toBe(15000);
      expect(merchant.stats.totalCustomers).toBe(75);
      expect(merchant.stats.totalProducts).toBe(30);
      expect(merchant.stats.totalNFTsMinted).toBe(15);
      expect(merchant.stats.lastOrderDate).toEqual(new Date('2024-02-01'));
      expect(merchant.stats.lastPaymentDate).toEqual(new Date('2024-02-02'));
      expect(merchant.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should preserve existing stats when updating partial', () => {
      const statsUpdate = {
        totalOrders: 200,
      };

      merchant.updateStats(statsUpdate);

      expect(merchant.stats.totalOrders).toBe(200);
      expect(merchant.stats.totalSales.amount).toBe(0); // Preserved
      expect(merchant.stats.totalCustomers).toBe(0); // Preserved
    });
  });

  describe('Status Check Methods', () => {
    it('should check if merchant is active', () => {
      expect(merchant.isActive()).toBe(true);

      merchant.deactivate();

      expect(merchant.isActive()).toBe(false);
    });

    it('should check if merchant can process orders', () => {
      expect(merchant.canProcessOrders()).toBe(true); // Active and has PIX key

      merchant.deactivate();
      expect(merchant.canProcessOrders()).toBe(false); // Inactive

      merchant.activate();
      merchant.pixKey = '';
      expect(merchant.canProcessOrders()).toBe(false); // No PIX key
    });
  });

  describe('Utility Methods', () => {
    it('should get display name', () => {
      expect(merchant.getDisplayName()).toBe('Test Merchant');

      merchant.name = '';
      expect(merchant.getDisplayName()).toBe('Loja sem nome');
    });

    it('should get contact email', () => {
      expect(merchant.getContactEmail()).toBe('contato@merchant.com');
    });

    it('should get primary color', () => {
      expect(merchant.getPrimaryColor()).toBe('#3b82f6');

      merchant.theme.primaryColor = '';
      expect(merchant.getPrimaryColor()).toBe('#3b82f6'); // Default
    });

    it('should get secondary color', () => {
      expect(merchant.getSecondaryColor()).toBe('#64748b');

      merchant.theme.secondaryColor = '';
      expect(merchant.getSecondaryColor()).toBe('#64748b'); // Default
    });
  });

  describe('toJSON', () => {
    it('should return merchant as JSON object', () => {
      const json = merchant.toJSON();

      expect(json).toEqual({
        id: merchant.id,
        contractAddress: merchant.contractAddress,
        name: merchant.name,
        cnpj: merchant.cnpj,
        pixKey: merchant.pixKey,
        description: merchant.description,
        logo: merchant.logo,
        theme: merchant.theme,
        contact: merchant.contact,
        address: merchant.address,
        settings: merchant.settings,
        stats: merchant.stats,
        createdAt: merchant.createdAt,
        updatedAt: merchant.updatedAt,
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle merchant with minimal required fields', () => {
      const minimalMerchant = new Merchant({
        id: 'minimal-123',
        contractAddress: '0xminimal123456789012345678901234567890123456',
        name: 'Minimal Merchant',
        cnpj: '12.345.678/0001-90',
        pixKey: 'minimal@merchant.com',
        description: 'Minimal merchant',
        theme: mockTheme,
        contact: mockContact,
        address: mockAddress,
      });

      expect(minimalMerchant.id).toBe('minimal-123');
      expect(minimalMerchant.name).toBe('Minimal Merchant');
      expect(minimalMerchant.settings.isActive).toBe(true); // Default
      expect(minimalMerchant.stats.totalSales.amount).toBe(0); // Default
    });

    it('should handle merchant with empty theme colors', () => {
      const emptyThemeMerchant = new Merchant({
        id: 'empty-theme-123',
        contractAddress: '0xempty123456789012345678901234567890123456',
        name: 'Empty Theme Merchant',
        cnpj: '12.345.678/0001-90',
        pixKey: 'empty@merchant.com',
        description: 'Empty theme merchant',
        theme: {
          primaryColor: '',
          secondaryColor: '',
          backgroundColor: '#ffffff',
          textColor: '#000000',
          fontFamily: 'Arial',
        },
        contact: mockContact,
        address: mockAddress,
      });

      expect(emptyThemeMerchant.getPrimaryColor()).toBe('#3b82f6'); // Default
      expect(emptyThemeMerchant.getSecondaryColor()).toBe('#64748b'); // Default
    });

    it('should handle merchant with empty name', () => {
      merchant.name = '';

      expect(merchant.getDisplayName()).toBe('Loja sem nome');
    });

    it('should handle merchant without PIX key', () => {
      merchant.pixKey = '';

      expect(merchant.canProcessOrders()).toBe(false);
    });

    it('should handle merchant with custom dates', () => {
      const customDates = {
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-02T15:30:00Z'),
      };

      const customMerchant = new Merchant({
        id: 'custom-dates-123',
        contractAddress: '0xcustom123456789012345678901234567890123456',
        name: 'Custom Dates Merchant',
        cnpj: '12.345.678/0001-90',
        pixKey: 'custom@merchant.com',
        description: 'Custom dates merchant',
        theme: mockTheme,
        contact: mockContact,
        address: mockAddress,
        ...customDates,
      });

      expect(customMerchant.createdAt).toEqual(customDates.createdAt);
      expect(customMerchant.updatedAt).toEqual(customDates.updatedAt);
    });
  });
}); 