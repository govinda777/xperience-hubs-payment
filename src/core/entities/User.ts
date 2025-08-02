import { NFT } from '@/types/nft';
import { Order } from './Order';

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  socialMedia?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface UserPreferences {
  language: string;
  currency: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showWalletAddress: boolean;
    showNFTs: boolean;
  };
}

export interface UserWallet {
  address: string;
  network: string;
  isConnected: boolean;
  balance?: string;
  lastSync?: Date;
}

export interface UserStats {
  totalOrders: number;
  totalSpent: Money;
  totalNFTs: number;
  favoriteMerchants: string[];
  lastOrderDate?: Date;
  memberSince: Date;
}

export interface Money {
  amount: number;
  currency: string;
  formatted: string;
}

export class User {
  public readonly id: string;
  public readonly privyId: string;
  public profile: UserProfile;
  public preferences: UserPreferences;
  public wallets: UserWallet[];
  public stats: UserStats;
  public isActive: boolean;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(params: {
    id: string;
    privyId: string;
    profile: UserProfile;
    preferences?: Partial<UserPreferences>;
    wallets?: UserWallet[];
    stats?: Partial<UserStats>;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id;
    this.privyId = params.privyId;
    this.profile = params.profile;
    this.preferences = {
      language: 'pt-BR',
      currency: 'BRL',
      timezone: 'America/Sao_Paulo',
      notifications: {
        email: true,
        push: true,
        sms: false,
        marketing: false,
      },
      privacy: {
        profileVisibility: 'public',
        showWalletAddress: true,
        showNFTs: true,
      },
      ...params.preferences,
    };
    this.wallets = params.wallets || [];
    this.stats = {
      totalOrders: 0,
      totalSpent: { amount: 0, currency: 'BRL', formatted: 'R$ 0,00' },
      totalNFTs: 0,
      favoriteMerchants: [],
      memberSince: new Date(),
      ...params.stats,
    };
    this.isActive = params.isActive ?? true;
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || new Date();
  }

  public updateProfile(updates: Partial<UserProfile>): void {
    this.profile = { ...this.profile, ...updates };
    this.updatedAt = new Date();
  }

  public updatePreferences(preferences: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...preferences };
    this.updatedAt = new Date();
  }

  public addWallet(wallet: UserWallet): void {
    const existingIndex = this.wallets.findIndex(w => w.address === wallet.address);
    if (existingIndex >= 0) {
      this.wallets[existingIndex] = wallet;
    } else {
      this.wallets.push(wallet);
    }
    this.updatedAt = new Date();
  }

  public removeWallet(address: string): void {
    this.wallets = this.wallets.filter(w => w.address !== address);
    this.updatedAt = new Date();
  }

  public updateWallet(address: string, updates: Partial<UserWallet>): void {
    const walletIndex = this.wallets.findIndex(w => w.address === address);
    if (walletIndex >= 0) {
      this.wallets[walletIndex] = { ...this.wallets[walletIndex], ...updates };
      this.updatedAt = new Date();
    }
  }

  public getPrimaryWallet(): UserWallet | null {
    return this.wallets.find(w => w.isConnected) || this.wallets[0] || null;
  }

  public getWalletAddress(): string | null {
    const primaryWallet = this.getPrimaryWallet();
    return primaryWallet?.address || null;
  }

  public updateStats(stats: Partial<UserStats>): void {
    this.stats = { ...this.stats, ...stats };
    this.updatedAt = new Date();
  }

  public incrementOrders(): void {
    this.stats.totalOrders += 1;
    this.stats.lastOrderDate = new Date();
    this.updatedAt = new Date();
  }

  public addToTotalSpent(amount: Money): void {
    this.stats.totalSpent = {
      amount: this.stats.totalSpent.amount + amount.amount,
      currency: amount.currency,
      formatted: `R$ ${(this.stats.totalSpent.amount + amount.amount).toFixed(2).replace('.', ',')}`,
    };
    this.updatedAt = new Date();
  }

  public incrementNFTs(): void {
    this.stats.totalNFTs += 1;
    this.updatedAt = new Date();
  }

  public addFavoriteMerchant(merchantId: string): void {
    if (!this.stats.favoriteMerchants.includes(merchantId)) {
      this.stats.favoriteMerchants.push(merchantId);
      this.updatedAt = new Date();
    }
  }

  public removeFavoriteMerchant(merchantId: string): void {
    this.stats.favoriteMerchants = this.stats.favoriteMerchants.filter(id => id !== merchantId);
    this.updatedAt = new Date();
  }

  public activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  public deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  public isActive(): boolean {
    return this.isActive;
  }

  public hasWallet(): boolean {
    return this.wallets.length > 0;
  }

  public isWalletConnected(): boolean {
    return this.wallets.some(w => w.isConnected);
  }

  public getDisplayName(): string {
    return this.profile.name || 'Usuário';
  }

  public getEmail(): string {
    return this.profile.email;
  }

  public getAvatar(): string | null {
    return this.profile.avatar || null;
  }

  public getLanguage(): string {
    return this.preferences.language;
  }

  public getCurrency(): string {
    return this.preferences.currency;
  }

  public getTimezone(): string {
    return this.preferences.timezone;
  }

  public isEmailNotificationsEnabled(): boolean {
    return this.preferences.notifications.email;
  }

  public isPushNotificationsEnabled(): boolean {
    return this.preferences.notifications.push;
  }

  public isProfilePublic(): boolean {
    return this.preferences.privacy.profileVisibility === 'public';
  }

  public showsWalletAddress(): boolean {
    return this.preferences.privacy.showWalletAddress;
  }

  public showsNFTs(): boolean {
    return this.preferences.privacy.showNFTs;
  }

  public getMemberSince(): Date {
    return this.stats.memberSince;
  }

  public getDaysAsMember(): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.stats.memberSince.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  public toJSON(): object {
    return {
      id: this.id,
      privyId: this.privyId,
      profile: this.profile,
      preferences: this.preferences,
      wallets: this.wallets,
      stats: this.stats,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
} 