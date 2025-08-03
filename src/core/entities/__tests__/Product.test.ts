import { Product } from '../Product';

describe('Product Entity', () => {
  const mockProductData = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    imageUrl: 'https://example.com/image.jpg',
    category: 'Electronics',
    isNFT: false,
    rating: 4.5,
    reviewCount: 25,
    stock: 10,
    merchantId: 'merchant-1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02')
  };

  describe('Product Creation', () => {
    it('creates a product with all required fields', () => {
      const product = new Product(mockProductData);

      expect(product.id).toBe('1');
      expect(product.name).toBe('Test Product');
      expect(product.description).toBe('Test Description');
      expect(product.price).toBe(99.99);
      expect(product.imageUrl).toBe('https://example.com/image.jpg');
      expect(product.category).toBe('Electronics');
      expect(product.isNFT).toBe(false);
      expect(product.rating).toBe(4.5);
      expect(product.reviewCount).toBe(25);
      expect(product.stock).toBe(10);
      expect(product.merchantId).toBe('merchant-1');
      expect(product.createdAt).toEqual(new Date('2024-01-01'));
      expect(product.updatedAt).toEqual(new Date('2024-01-02'));
    });

    it('creates a product with optional fields', () => {
      const productData = {
        ...mockProductData,
        discountPercentage: 20,
        metadata: { color: 'red', size: 'large' },
        tags: ['electronics', 'gadget']
      };

      const product = new Product(productData);

      expect(product.discountPercentage).toBe(20);
      expect(product.metadata).toEqual({ color: 'red', size: 'large' });
      expect(product.tags).toEqual(['electronics', 'gadget']);
    });

    it('creates an NFT product', () => {
      const nftProductData = {
        ...mockProductData,
        isNFT: true,
        tokenId: '123',
        contractAddress: '0x1234567890abcdef'
      };

      const product = new Product(nftProductData);

      expect(product.isNFT).toBe(true);
      expect(product.tokenId).toBe('123');
      expect(product.contractAddress).toBe('0x1234567890abcdef');
    });
  });

  describe('Product Validation', () => {
    it('validates required fields', () => {
      expect(() => {
        new Product({} as any);
      }).toThrow();

      expect(() => {
        new Product({ id: '1' } as any);
      }).toThrow();

      expect(() => {
        new Product({ id: '1', name: 'Test' } as any);
      }).toThrow();
    });

    it('validates price is positive', () => {
      expect(() => {
        new Product({ ...mockProductData, price: -10 });
      }).toThrow('Price must be positive');

      expect(() => {
        new Product({ ...mockProductData, price: 0 });
      }).toThrow('Price must be positive');
    });

    it('validates stock is non-negative', () => {
      expect(() => {
        new Product({ ...mockProductData, stock: -5 });
      }).toThrow('Stock cannot be negative');
    });

    it('validates rating is between 0 and 5', () => {
      expect(() => {
        new Product({ ...mockProductData, rating: -1 });
      }).toThrow('Rating must be between 0 and 5');

      expect(() => {
        new Product({ ...mockProductData, rating: 6 });
      }).toThrow('Rating must be between 0 and 5');
    });

    it('validates discount percentage is between 0 and 100', () => {
      expect(() => {
        new Product({ ...mockProductData, discountPercentage: -10 });
      }).toThrow('Discount percentage must be between 0 and 100');

      expect(() => {
        new Product({ ...mockProductData, discountPercentage: 150 });
      }).toThrow('Discount percentage must be between 0 and 100');
    });
  });

  describe('Product Methods', () => {
    let product: Product;

    beforeEach(() => {
      product = new Product(mockProductData);
    });

    it('calculates discounted price correctly', () => {
      product.discountPercentage = 20;
      expect(product.getDiscountedPrice()).toBe(79.99);
    });

    it('returns original price when no discount', () => {
      expect(product.getDiscountedPrice()).toBe(99.99);
    });

    it('checks if product is in stock', () => {
      expect(product.isInStock()).toBe(true);

      product.stock = 0;
      expect(product.isInStock()).toBe(false);
    });

    it('checks if product is low in stock', () => {
      product.stock = 5;
      expect(product.isLowStock()).toBe(true);

      product.stock = 10;
      expect(product.isLowStock()).toBe(false);
    });

    it('reserves stock', () => {
      const initialStock = product.stock;
      product.reserveStock(3);
      expect(product.stock).toBe(initialStock - 3);
    });

    it('throws error when reserving more stock than available', () => {
      expect(() => {
        product.reserveStock(15);
      }).toThrow('Insufficient stock');
    });

    it('releases reserved stock', () => {
      const initialStock = product.stock;
      product.reserveStock(3);
      product.releaseStock(2);
      expect(product.stock).toBe(initialStock - 1);
    });

    it('updates product information', () => {
      const updateData = {
        name: 'Updated Product',
        price: 149.99,
        description: 'Updated description'
      };

      product.update(updateData);

      expect(product.name).toBe('Updated Product');
      expect(product.price).toBe(149.99);
      expect(product.description).toBe('Updated description');
      expect(product.updatedAt.getTime()).toBeGreaterThan(mockProductData.updatedAt.getTime());
    });

    it('validates update data', () => {
      expect(() => {
        product.update({ price: -10 });
      }).toThrow('Price must be positive');
    });

    it('adds tags', () => {
      product.addTag('new-tag');
      expect(product.tags).toContain('new-tag');
    });

    it('removes tags', () => {
      product.tags = ['tag1', 'tag2', 'tag3'];
      product.removeTag('tag2');
      expect(product.tags).toEqual(['tag1', 'tag3']);
    });

    it('checks if product has tag', () => {
      product.tags = ['electronics', 'gadget'];
      expect(product.hasTag('electronics')).toBe(true);
      expect(product.hasTag('clothing')).toBe(false);
    });

    it('updates metadata', () => {
      product.updateMetadata({ color: 'blue', weight: '500g' });
      expect(product.metadata).toEqual({ color: 'blue', weight: '500g' });
    });

    it('gets metadata value', () => {
      product.metadata = { color: 'red', size: 'large' };
      expect(product.getMetadata('color')).toBe('red');
      expect(product.getMetadata('size')).toBe('large');
      expect(product.getMetadata('nonexistent')).toBeUndefined();
    });

    it('calculates average rating', () => {
      product.rating = 4.5;
      product.reviewCount = 10;
      expect(product.getAverageRating()).toBe(4.5);
    });

    it('handles zero reviews', () => {
      product.rating = 0;
      product.reviewCount = 0;
      expect(product.getAverageRating()).toBe(0);
    });
  });

  describe('Product Serialization', () => {
    it('converts to plain object', () => {
      const product = new Product(mockProductData);
      const plainObject = product.toJSON();

      expect(plainObject).toEqual({
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        imageUrl: 'https://example.com/image.jpg',
        category: 'Electronics',
        isNFT: false,
        rating: 4.5,
        reviewCount: 25,
        stock: 10,
        merchantId: 'merchant-1',
        createdAt: mockProductData.createdAt.toISOString(),
        updatedAt: mockProductData.updatedAt.toISOString(),
        discountPercentage: undefined,
        metadata: undefined,
        tags: undefined,
        tokenId: undefined,
        contractAddress: undefined
      });
    });

    it('creates from plain object', () => {
      const plainObject = {
        ...mockProductData,
        createdAt: mockProductData.createdAt.toISOString(),
        updatedAt: mockProductData.updatedAt.toISOString()
      };

      const product = Product.fromJSON(plainObject);

      expect(product.id).toBe('1');
      expect(product.name).toBe('Test Product');
      expect(product.createdAt).toEqual(mockProductData.createdAt);
      expect(product.updatedAt).toEqual(mockProductData.updatedAt);
    });
  });

  describe('Product Comparison', () => {
    it('compares products by price', () => {
      const product1 = new Product({ ...mockProductData, price: 100 });
      const product2 = new Product({ ...mockProductData, id: '2', price: 50 });

      expect(Product.compareByPrice(product1, product2)).toBeGreaterThan(0);
      expect(Product.compareByPrice(product2, product1)).toBeLessThan(0);
      expect(Product.compareByPrice(product1, product1)).toBe(0);
    });

    it('compares products by rating', () => {
      const product1 = new Product({ ...mockProductData, rating: 4.5 });
      const product2 = new Product({ ...mockProductData, id: '2', rating: 3.5 });

      expect(Product.compareByRating(product1, product2)).toBeGreaterThan(0);
      expect(Product.compareByRating(product2, product1)).toBeLessThan(0);
    });

    it('compares products by name', () => {
      const product1 = new Product({ ...mockProductData, name: 'Apple' });
      const product2 = new Product({ ...mockProductData, id: '2', name: 'Banana' });

      expect(Product.compareByName(product1, product2)).toBeLessThan(0);
      expect(Product.compareByName(product2, product1)).toBeGreaterThan(0);
    });
  });

  describe('Product Factory Methods', () => {
    it('creates a sample product', () => {
      const sampleProduct = Product.createSample();

      expect(sampleProduct.id).toBeTruthy();
      expect(sampleProduct.name).toBeTruthy();
      expect(sampleProduct.price).toBeGreaterThan(0);
      expect(sampleProduct.stock).toBeGreaterThanOrEqual(0);
    });

    it('creates an NFT product', () => {
      const nftProduct = Product.createNFT({
        name: 'NFT Art',
        price: 1000,
        tokenId: '123',
        contractAddress: '0x1234567890abcdef'
      });

      expect(nftProduct.isNFT).toBe(true);
      expect(nftProduct.tokenId).toBe('123');
      expect(nftProduct.contractAddress).toBe('0x1234567890abcdef');
    });
  });

  describe('Edge Cases', () => {
    it('handles very large prices', () => {
      const expensiveProduct = new Product({
        ...mockProductData,
        price: 999999.99
      });

      expect(expensiveProduct.price).toBe(999999.99);
      expect(expensiveProduct.getDiscountedPrice()).toBe(999999.99);
    });

    it('handles very small prices', () => {
      const cheapProduct = new Product({
        ...mockProductData,
        price: 0.01
      });

      expect(cheapProduct.price).toBe(0.01);
    });

    it('handles products with no description', () => {
      const productWithoutDescription = new Product({
        ...mockProductData,
        description: ''
      });

      expect(productWithoutDescription.description).toBe('');
    });

    it('handles products with special characters in name', () => {
      const productWithSpecialChars = new Product({
        ...mockProductData,
        name: 'Product with émojis 🚀 and symbols @#$%'
      });

      expect(productWithSpecialChars.name).toBe('Product with émojis 🚀 and symbols @#$%');
    });
  });
}); 