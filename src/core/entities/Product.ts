import { Money } from '@/types/payment';
import { NFTMetadata } from '@/types/nft';

export type ProductCategory = 
  | 'event'
  | 'digital_product'
  | 'physical_product'
  | 'service'
  | 'subscription'
  | 'other';

export type ProductAvailability = 
  | 'available'
  | 'out_of_stock'
  | 'coming_soon'
  | 'discontinued';

export interface ProductAttribute {
  name: string;
  value: string | number | boolean;
  type: 'text' | 'number' | 'boolean' | 'select';
  required?: boolean;
  options?: string[];
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface NFTConfiguration {
  enabled: boolean;
  name: string;
  description: string;
  image: string;
  attributes?: ProductAttribute[];
  metadata?: NFTMetadata;
  transferable: boolean;
  burnable: boolean;
  maxSupply?: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: Money;
  stock: number;
  attributes: Record<string, string>;
  isActive: boolean;
}

export interface ProductSEO {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
}

export class Product {
  public readonly id: string;
  public readonly merchantId: string;
  public name: string;
  public description: string;
  public price: Money;
  public category: ProductCategory;
  public images: ProductImage[];
  public attributes: ProductAttribute[];
  public availability: ProductAvailability;
  public nftConfig: NFTConfiguration;
  public variants: ProductVariant[];
  public seo: ProductSEO;
  public isActive: boolean;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(params: {
    id: string;
    merchantId: string;
    name: string;
    description: string;
    price: Money;
    category: ProductCategory;
    images?: ProductImage[];
    attributes?: ProductAttribute[];
    availability?: ProductAvailability;
    nftConfig?: Partial<NFTConfiguration>;
    variants?: ProductVariant[];
    seo?: Partial<ProductSEO>;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id;
    this.merchantId = params.merchantId;
    this.name = params.name;
    this.description = params.description;
    this.price = params.price;
    this.category = params.category;
    this.images = params.images || [];
    this.attributes = params.attributes || [];
    this.availability = params.availability || 'available';
    this.nftConfig = {
      enabled: false,
      name: params.name,
      description: params.description,
      image: '',
      transferable: true,
      burnable: false,
      ...params.nftConfig,
    };
    this.variants = params.variants || [];
    this.seo = {
      title: params.name,
      description: params.description,
      keywords: [],
      ...params.seo,
    };
    this.isActive = params.isActive ?? true;
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || new Date();
  }

  public updateBasicInfo(updates: Partial<{
    name: string;
    description: string;
    price: Money;
    category: ProductCategory;
    availability: ProductAvailability;
  }>): void {
    if (updates.name) {
      this.name = updates.name;
      this.nftConfig.name = updates.name;
      this.seo.title = updates.name;
    }
    if (updates.description) {
      this.description = updates.description;
      this.nftConfig.description = updates.description;
      this.seo.description = updates.description;
    }
    if (updates.price) this.price = updates.price;
    if (updates.category) this.category = updates.category;
    if (updates.availability) this.availability = updates.availability;
    
    this.updatedAt = new Date();
  }

  public updateImages(images: ProductImage[]): void {
    this.images = images;
    if (images.length > 0) {
      const primaryImage = images.find(img => img.isPrimary) || images[0];
      this.nftConfig.image = primaryImage.url;
    }
    this.updatedAt = new Date();
  }

  public addImage(image: Omit<ProductImage, 'id'>): void {
    const newImage: ProductImage = {
      ...image,
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    this.images.push(newImage);
    this.updatedAt = new Date();
  }

  public removeImage(imageId: string): void {
    this.images = this.images.filter(img => img.id !== imageId);
    this.updatedAt = new Date();
  }

  public updateAttributes(attributes: ProductAttribute[]): void {
    this.attributes = attributes;
    this.updatedAt = new Date();
  }

  public updateNFTConfig(config: Partial<NFTConfiguration>): void {
    this.nftConfig = { ...this.nftConfig, ...config };
    this.updatedAt = new Date();
  }

  public updateVariants(variants: ProductVariant[]): void {
    this.variants = variants;
    this.updatedAt = new Date();
  }

  public addVariant(variant: Omit<ProductVariant, 'id'>): void {
    const newVariant: ProductVariant = {
      ...variant,
      id: `var_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    this.variants.push(newVariant);
    this.updatedAt = new Date();
  }

  public removeVariant(variantId: string): void {
    this.variants = this.variants.filter(v => v.id !== variantId);
    this.updatedAt = new Date();
  }

  public updateSEO(seo: Partial<ProductSEO>): void {
    this.seo = { ...this.seo, ...seo };
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

  public isAvailable(): boolean {
    return this.isActive && this.availability === 'available';
  }

  public hasVariants(): boolean {
    return this.variants.length > 0;
  }

  public getPrimaryImage(): ProductImage | null {
    return this.images.find(img => img.isPrimary) || this.images[0] || null;
  }

  public getImageUrl(): string {
    const primaryImage = this.getPrimaryImage();
    return primaryImage?.url || '';
  }

  public getLowestPrice(): Money {
    if (this.hasVariants()) {
      const lowestVariant = this.variants
        .filter(v => v.isActive)
        .reduce((lowest, current) => 
          current.price.amount < lowest.price.amount ? current : lowest
        );
      return lowestVariant?.price || this.price;
    }
    return this.price;
  }

  public getHighestPrice(): Money {
    if (this.hasVariants()) {
      const highestVariant = this.variants
        .filter(v => v.isActive)
        .reduce((highest, current) => 
          current.price.amount > highest.price.amount ? current : highest
        );
      return highestVariant?.price || this.price;
    }
    return this.price;
  }

  public hasNFTEnabled(): boolean {
    return this.nftConfig.enabled;
  }

  public getNFTMetadata(): NFTMetadata {
    return {
      name: this.nftConfig.name,
      description: this.nftConfig.description,
      image: this.nftConfig.image,
      attributes: this.nftConfig.attributes?.map(attr => ({
        trait_type: attr.name,
        value: attr.value,
      })),
      ...this.nftConfig.metadata,
    };
  }

  public toJSON(): object {
    return {
      id: this.id,
      merchantId: this.merchantId,
      name: this.name,
      description: this.description,
      price: this.price,
      category: this.category,
      images: this.images,
      attributes: this.attributes,
      availability: this.availability,
      nftConfig: this.nftConfig,
      variants: this.variants,
      seo: this.seo,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
} 