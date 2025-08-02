import { Money } from '@/types/payment';

export interface MerchantTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  logo?: string;
}

export interface MerchantContact {
  email: string;
  phone?: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface MerchantAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface MerchantSettings {
  isActive: boolean;
  autoApproveOrders: boolean;
  requireNFTValidation: boolean;
  allowRefunds: boolean;
  maxRefundDays: number;
  notificationEmail: boolean;
  notificationSMS: boolean;
  webhookUrl?: string;
}

export interface MerchantStats {
  totalSales: Money;
  totalOrders: number;
  averageOrderValue: Money;
  totalCustomers: number;
  totalProducts: number;
  totalNFTsMinted: number;
  lastOrderDate?: Date;
  lastPaymentDate?: Date;
}

export class Merchant {
  public readonly id: string;
  public readonly contractAddress: string;
  public name: string;
  public cnpj: string;
  public pixKey: string;
  public description: string;
  public logo?: string;
  public theme: MerchantTheme;
  public contact: MerchantContact;
  public address: MerchantAddress;
  public settings: MerchantSettings;
  public stats: MerchantStats;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(params: {
    id: string;
    contractAddress: string;
    name: string;
    cnpj: string;
    pixKey: string;
    description: string;
    logo?: string;
    theme: MerchantTheme;
    contact: MerchantContact;
    address: MerchantAddress;
    settings?: Partial<MerchantSettings>;
    stats?: Partial<MerchantStats>;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id;
    this.contractAddress = params.contractAddress;
    this.name = params.name;
    this.cnpj = params.cnpj;
    this.pixKey = params.pixKey;
    this.description = params.description;
    this.logo = params.logo;
    this.theme = params.theme;
    this.contact = params.contact;
    this.address = params.address;
    this.settings = {
      isActive: true,
      autoApproveOrders: false,
      requireNFTValidation: true,
      allowRefunds: true,
      maxRefundDays: 7,
      notificationEmail: true,
      notificationSMS: false,
      ...params.settings,
    };
    this.stats = {
      totalSales: { amount: 0, currency: 'BRL', formatted: 'R$ 0,00' },
      totalOrders: 0,
      averageOrderValue: { amount: 0, currency: 'BRL', formatted: 'R$ 0,00' },
      totalCustomers: 0,
      totalProducts: 0,
      totalNFTsMinted: 0,
      ...params.stats,
    };
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || new Date();
  }

  public updateProfile(updates: Partial<{
    name: string;
    description: string;
    logo: string;
    theme: MerchantTheme;
    contact: MerchantContact;
    address: MerchantAddress;
  }>): void {
    if (updates.name) this.name = updates.name;
    if (updates.description) this.description = updates.description;
    if (updates.logo) this.logo = updates.logo;
    if (updates.theme) this.theme = { ...this.theme, ...updates.theme };
    if (updates.contact) this.contact = { ...this.contact, ...updates.contact };
    if (updates.address) this.address = { ...this.address, ...updates.address };
    
    this.updatedAt = new Date();
  }

  public updateSettings(settings: Partial<MerchantSettings>): void {
    this.settings = { ...this.settings, ...settings };
    this.updatedAt = new Date();
  }

  public updatePixKey(pixKey: string): void {
    this.pixKey = pixKey;
    this.updatedAt = new Date();
  }

  public activate(): void {
    this.settings.isActive = true;
    this.updatedAt = new Date();
  }

  public deactivate(): void {
    this.settings.isActive = false;
    this.updatedAt = new Date();
  }

  public updateStats(stats: Partial<MerchantStats>): void {
    this.stats = { ...this.stats, ...stats };
    this.updatedAt = new Date();
  }

  public isActive(): boolean {
    return this.settings.isActive;
  }

  public canProcessOrders(): boolean {
    return this.isActive() && this.pixKey.length > 0;
  }

  public getDisplayName(): string {
    return this.name || 'Loja sem nome';
  }

  public getContactEmail(): string {
    return this.contact.email;
  }

  public getPrimaryColor(): string {
    return this.theme.primaryColor || '#3b82f6';
  }

  public getSecondaryColor(): string {
    return this.theme.secondaryColor || '#64748b';
  }

  public toJSON(): object {
    return {
      id: this.id,
      contractAddress: this.contractAddress,
      name: this.name,
      cnpj: this.cnpj,
      pixKey: this.pixKey,
      description: this.description,
      logo: this.logo,
      theme: this.theme,
      contact: this.contact,
      address: this.address,
      settings: this.settings,
      stats: this.stats,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
} 