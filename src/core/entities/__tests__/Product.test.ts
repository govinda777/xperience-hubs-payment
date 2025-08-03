import { Product } from '../Product';

describe('Product Entity', () => {
  let product: Product;

  beforeEach(() => {
    product = new Product({
      id: 'product-1',
      merchantId: 'merchant-1',
      name: 'Test Product',
      description: 'A test product for testing purposes',
      price: 99.99,
      category: 'electronics',
      images: [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg'
      ],
      attributes: {
        brand: 'TestBrand',
        model: 'TestModel',
        color: 'Black',
        weight: '1.5kg'
      },
      availability: {
        inStock: true,
        quantity: 100,
        maxQuantityPerOrder: 5
      },
      nftConfig: {
        enabled: true,
        tokenType: 'ERC-721',
        metadata: {
          name: 'Test NFT',
          description: 'NFT for Test Product',
          image: 'https://example.com/nft-image.jpg'
        }
      },
      variants: [
        {
          id: 'variant-1',
          name: 'Small',
          price: 89.99,
          attributes: { size: 'S' }
        },
        {
          id: 'variant-2',
          name: 'Large',
          price: 109.99,
          attributes: { size: 'L' }
        }
      ],
      seo: {
        title: 'Test Product - Best Quality',
        description: 'High quality test product',
        keywords: ['test', 'product', 'quality']
      }
    });
  });

  describe('Constructor', () => {
    it('should create a product with all properties', () => {
      expect(product.id).toBe('product-1');
      expect(product.merchantId).toBe('merchant-1');
      expect(product.name).toBe('Test Product');
      expect(product.description).toBe('A test product for testing purposes');
      expect(product.price).toBe(99.99);
      expect(product.category).toBe('electronics');
      expect(product.isActive()).toBe(true);
      expect(product.createdAt).toBeInstanceOf(Date);
      expect(product.updatedAt).toBeInstanceOf(Date);
    });

    it('should set default values for optional properties', () => {
      const minimalProduct = new Product({
        id: 'minimal-1',
        merchantId: 'merchant-1',
        name: 'Minimal Product',
        price: 50.00
      });

      expect(minimalProduct.isActive()).toBe(true);
      expect(minimalProduct.images).toEqual([]);
      expect(minimalProduct.attributes).toEqual({});
      expect(minimalProduct.availability.inStock).toBe(true);
      expect(minimalProduct.availability.quantity).toBe(0);
      expect(minimalProduct.nftConfig.enabled).toBe(false);
      expect(minimalProduct.variants).toEqual([]);
    });
  });

  describe('updateInfo', () => {
    it('should update product basic information', () => {
      const updateData = {
        name: 'Updated Product Name',
        description: 'Updated description',
        price: 149.99,
        category: 'clothing'
      };

      product.updateInfo(updateData);

      expect(product.name).toBe('Updated Product Name');
      expect(product.description).toBe('Updated description');
      expect(product.price).toBe(149.99);
      expect(product.category).toBe('clothing');
      expect(product.updatedAt.getTime()).toBeGreaterThan(product.createdAt.getTime());
    });

    it('should validate price is positive', () => {
      expect(() => {
        product.updateInfo({ price: -10 });
      }).toThrow('Price must be positive');
    });
  });

  describe('updateImages', () => {
    it('should update product images', () => {
      const newImages = [
        'https://example.com/new-image1.jpg',
        'https://example.com/new-image2.jpg',
        'https://example.com/new-image3.jpg'
      ];

      product.updateImages(newImages);

      expect(product.images).toEqual(newImages);
      expect(product.updatedAt.getTime()).toBeGreaterThan(product.createdAt.getTime());
    });

    it('should validate image URLs', () => {
      expect(() => {
        product.updateImages(['invalid-url']);
      }).toThrow('Invalid image URL format');
    });
  });

  describe('updateAttributes', () => {
    it('should update product attributes', () => {
      const newAttributes = {
        brand: 'NewBrand',
        model: 'NewModel',
        color: 'White',
        material: 'Plastic'
      };

      product.updateAttributes(newAttributes);

      expect(product.attributes).toEqual(newAttributes);
      expect(product.updatedAt.getTime()).toBeGreaterThan(product.createdAt.getTime());
    });
  });

  describe('updateNFTConfig', () => {
    it('should update NFT configuration', () => {
      const newNFTConfig = {
        enabled: true,
        tokenType: 'ERC-1155',
        metadata: {
          name: 'New NFT Name',
          description: 'New NFT description',
          image: 'https://example.com/new-nft.jpg'
        }
      };

      product.updateNFTConfig(newNFTConfig);

      expect(product.nftConfig.enabled).toBe(true);
      expect(product.nftConfig.tokenType).toBe('ERC-1155');
      expect(product.nftConfig.metadata.name).toBe('New NFT Name');
      expect(product.updatedAt.getTime()).toBeGreaterThan(product.createdAt.getTime());
    });
  });

  describe('addVariant', () => {
    it('should add a new variant', () => {
      const newVariant = {
        id: 'variant-3',
        name: 'Medium',
        price: 99.99,
        attributes: { size: 'M' }
      };

      product.addVariant(newVariant);

      expect(product.variants).toHaveLength(3);
      expect(product.variants[2]).toEqual(newVariant);
      expect(product.updatedAt.getTime()).toBeGreaterThan(product.createdAt.getTime());
    });

    it('should prevent duplicate variant IDs', () => {
      const duplicateVariant = {
        id: 'variant-1',
        name: 'Duplicate',
        price: 99.99,
        attributes: { size: 'M' }
      };

      expect(() => {
        product.addVariant(duplicateVariant);
      }).toThrow('Variant with this ID already exists');
    });
  });

  describe('removeVariant', () => {
    it('should remove a variant by ID', () => {
      expect(product.variants).toHaveLength(2);

      product.removeVariant('variant-1');

      expect(product.variants).toHaveLength(1);
      expect(product.variants[0].id).toBe('variant-2');
      expect(product.updatedAt.getTime()).toBeGreaterThan(product.createdAt.getTime());
    });

    it('should throw error for non-existent variant', () => {
      expect(() => {
        product.removeVariant('non-existent');
      }).toThrow('Variant not found');
    });
  });

  describe('updateSEO', () => {
    it('should update SEO information', () => {
      const newSEO = {
        title: 'New SEO Title',
        description: 'New SEO description',
        keywords: ['new', 'keywords', 'seo']
      };

      product.updateSEO(newSEO);

      expect(product.seo.title).toBe('New SEO Title');
      expect(product.seo.description).toBe('New SEO description');
      expect(product.seo.keywords).toEqual(['new', 'keywords', 'seo']);
      expect(product.updatedAt.getTime()).toBeGreaterThan(product.createdAt.getTime());
    });
  });

  describe('activate', () => {
    it('should activate an inactive product', () => {
      product.deactivate();
      expect(product.isActive()).toBe(false);

      product.activate();
      expect(product.isActive()).toBe(true);
      expect(product.updatedAt.getTime()).toBeGreaterThan(product.createdAt.getTime());
    });
  });

  describe('deactivate', () => {
    it('should deactivate an active product', () => {
      expect(product.isActive()).toBe(true);

      product.deactivate();
      expect(product.isActive()).toBe(false);
      expect(product.updatedAt.getTime()).toBeGreaterThan(product.createdAt.getTime());
    });
  });

  describe('getPrice', () => {
    it('should return base price when no variant specified', () => {
      expect(product.getPrice()).toBe(99.99);
    });

    it('should return variant price when variant specified', () => {
      expect(product.getPrice('variant-1')).toBe(89.99);
      expect(product.getPrice('variant-2')).toBe(109.99);
    });

    it('should return base price for non-existent variant', () => {
      expect(product.getPrice('non-existent')).toBe(99.99);
    });
  });

  describe('getImage', () => {
    it('should return first image when no index specified', () => {
      expect(product.getImage()).toBe('https://example.com/image1.jpg');
    });

    it('should return image at specified index', () => {
      expect(product.getImage(1)).toBe('https://example.com/image2.jpg');
    });

    it('should return empty string for invalid index', () => {
      expect(product.getImage(10)).toBe('');
    });

    it('should return empty string when no images', () => {
      product.updateImages([]);
      expect(product.getImage()).toBe('');
    });
  });

  describe('toJSON', () => {
    it('should return product data as JSON', () => {
      const json = product.toJSON();

      expect(json).toHaveProperty('id', 'product-1');
      expect(json).toHaveProperty('name', 'Test Product');
      expect(json).toHaveProperty('price', 99.99);
      expect(json).toHaveProperty('isActive', true);
      expect(json).toHaveProperty('createdAt');
      expect(json).toHaveProperty('updatedAt');
      expect(json).toHaveProperty('images');
      expect(json).toHaveProperty('attributes');
      expect(json).toHaveProperty('availability');
      expect(json).toHaveProperty('nftConfig');
      expect(json).toHaveProperty('variants');
      expect(json).toHaveProperty('seo');
    });
  });
}); 