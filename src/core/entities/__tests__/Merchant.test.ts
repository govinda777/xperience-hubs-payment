import { Merchant } from '../Merchant';

describe('Merchant Entity', () => {
  let merchant: Merchant;

  beforeEach(() => {
    merchant = new Merchant({
      id: 'merchant-1',
      contractAddress: '0x1234567890123456789012345678901234567890',
      name: 'Test Store',
      pixKey: 'test@example.com',
      theme: {
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        logo: 'https://example.com/logo.png'
      },
      contact: {
        email: 'contact@teststore.com',
        phone: '+5511999999999',
        website: 'https://teststore.com'
      },
      address: {
        street: 'Rua Teste, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        country: 'Brasil'
      },
      settings: {
        autoApproveOrders: true,
        requireNFTValidation: false,
        splitPercentage: 0.05
      },
      stats: {
        totalSales: 10000,
        totalOrders: 50,
        averageOrderValue: 200
      }
    });
  });

  describe('Constructor', () => {
    it('should create a merchant with all properties', () => {
      expect(merchant.id).toBe('merchant-1');
      expect(merchant.contractAddress).toBe('0x1234567890123456789012345678901234567890');
      expect(merchant.name).toBe('Test Store');
      expect(merchant.pixKey).toBe('test@example.com');
      expect(merchant.isActive()).toBe(true);
      expect(merchant.createdAt).toBeInstanceOf(Date);
      expect(merchant.updatedAt).toBeInstanceOf(Date);
    });

    it('should set default values for optional properties', () => {
      const minimalMerchant = new Merchant({
        id: 'minimal-1',
        contractAddress: '0x1234567890123456789012345678901234567890',
        name: 'Minimal Store',
        pixKey: 'minimal@example.com'
      });

      expect(minimalMerchant.isActive()).toBe(true);
      expect(minimalMerchant.theme).toEqual({
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        logo: ''
      });
      expect(minimalMerchant.settings).toEqual({
        autoApproveOrders: false,
        requireNFTValidation: true,
        splitPercentage: 0.05
      });
    });
  });

  describe('updateProfile', () => {
    it('should update merchant profile information', () => {
      const updateData = {
        name: 'Updated Store Name',
        contact: {
          email: 'updated@teststore.com',
          phone: '+5511888888888',
          website: 'https://updatedstore.com'
        },
        address: {
          street: 'Rua Atualizada, 456',
          city: 'Rio de Janeiro',
          state: 'RJ',
          zipCode: '20000-000',
          country: 'Brasil'
        }
      };

      merchant.updateProfile(updateData);

      expect(merchant.name).toBe('Updated Store Name');
      expect(merchant.contact.email).toBe('updated@teststore.com');
      expect(merchant.contact.phone).toBe('+5511888888888');
      expect(merchant.address.city).toBe('Rio de Janeiro');
      expect(merchant.updatedAt.getTime()).toBeGreaterThan(merchant.createdAt.getTime());
    });

    it('should only update provided fields', () => {
      const originalContact = merchant.contact;
      const originalAddress = merchant.address;

      merchant.updateProfile({ name: 'Partial Update' });

      expect(merchant.name).toBe('Partial Update');
      expect(merchant.contact).toEqual(originalContact);
      expect(merchant.address).toEqual(originalAddress);
    });
  });

  describe('updateSettings', () => {
    it('should update merchant settings', () => {
      const newSettings = {
        autoApproveOrders: false,
        requireNFTValidation: true,
        splitPercentage: 0.08
      };

      merchant.updateSettings(newSettings);

      expect(merchant.settings.autoApproveOrders).toBe(false);
      expect(merchant.settings.requireNFTValidation).toBe(true);
      expect(merchant.settings.splitPercentage).toBe(0.08);
      expect(merchant.updatedAt.getTime()).toBeGreaterThan(merchant.createdAt.getTime());
    });

    it('should validate split percentage range', () => {
      expect(() => {
        merchant.updateSettings({ splitPercentage: -0.1 });
      }).toThrow('Split percentage must be between 0 and 1');

      expect(() => {
        merchant.updateSettings({ splitPercentage: 1.5 });
      }).toThrow('Split percentage must be between 0 and 1');
    });
  });

  describe('updatePixKey', () => {
    it('should update PIX key', () => {
      const newPixKey = 'newkey@example.com';
      merchant.updatePixKey(newPixKey);

      expect(merchant.pixKey).toBe(newPixKey);
      expect(merchant.updatedAt.getTime()).toBeGreaterThan(merchant.createdAt.getTime());
    });

    it('should validate PIX key format', () => {
      expect(() => {
        merchant.updatePixKey('invalid-key');
      }).toThrow('Invalid PIX key format');
    });
  });

  describe('activate', () => {
    it('should activate an inactive merchant', () => {
      merchant.deactivate();
      expect(merchant.isActive()).toBe(false);

      merchant.activate();
      expect(merchant.isActive()).toBe(true);
      expect(merchant.updatedAt.getTime()).toBeGreaterThan(merchant.createdAt.getTime());
    });
  });

  describe('deactivate', () => {
    it('should deactivate an active merchant', () => {
      expect(merchant.isActive()).toBe(true);

      merchant.deactivate();
      expect(merchant.isActive()).toBe(false);
      expect(merchant.updatedAt.getTime()).toBeGreaterThan(merchant.createdAt.getTime());
    });
  });

  describe('isActive', () => {
    it('should return true for active merchant', () => {
      expect(merchant.isActive()).toBe(true);
    });

    it('should return false for inactive merchant', () => {
      merchant.deactivate();
      expect(merchant.isActive()).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('should return merchant data as JSON', () => {
      const json = merchant.toJSON();

      expect(json).toHaveProperty('id', 'merchant-1');
      expect(json).toHaveProperty('name', 'Test Store');
      expect(json).toHaveProperty('settings');
      expect(json.settings).toHaveProperty('isActive', true);
      expect(json).toHaveProperty('createdAt');
      expect(json).toHaveProperty('updatedAt');
      expect(json).toHaveProperty('theme');
      expect(json).toHaveProperty('contact');
      expect(json).toHaveProperty('address');
      expect(json).toHaveProperty('settings');
      expect(json).toHaveProperty('stats');
    });
  });
}); 