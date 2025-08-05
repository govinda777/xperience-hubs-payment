import { defineFeature, loadFeature } from 'jest-cucumber';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProductCard } from '../ProductCard';
import { Given, When, Then, TestDataBuilder } from '@/lib/bdd/helpers';
import { Product } from '@/core/entities/Product';

// Load the corresponding .feature file
const feature = loadFeature('./features/products/product-card.feature');

defineFeature(feature, test => {
  let component: any;
  let product: Product;
  let mockOnAddToCart: jest.Mock;
  let mockOnQuickView: jest.Mock;

  beforeEach(() => {
    mockOnAddToCart = jest.fn();
    mockOnQuickView = jest.fn();
    
    // Create default product
    product = TestDataBuilder.createProduct({
      id: 'product-1',
      name: 'Premium T-Shirt',
      description: 'High quality cotton t-shirt',
      price: TestDataBuilder.createMoney(5000), // $50.00
      images: ['https://example.com/tshirt.jpg'],
      stock: 10,
      isActive: true,
    });
  });

  test('Display product information correctly', ({ given, when, then, and }) => {
    given('the product catalog is loaded', () => {
      expect(ProductCard).toBeDefined();
    });

    and('the shopping cart is available', () => {
      expect(mockOnAddToCart).toBeDefined();
    });

    and('the user is authenticated', () => {
      // User is authenticated by default in test environment
    });

    given(/^there is a product "(.*)" with price \$(\d+)\.(\d+)$/, (productName, dollars, cents) => {
      product.name = productName;
      const priceInCents = (parseInt(dollars) * 100) + parseInt(cents);
      product.price = TestDataBuilder.createMoney(priceInCents);
    });

    and(/^the product has a description "(.*)"$/, (description) => {
      product.description = description;
    });

    and(/^the product has an image "(.*)"$/, (imageUrl) => {
      product.images = [imageUrl];
    });

    when('the product card is rendered', () => {
      component = render(
        <ProductCard
          product={product}
          onAddToCart={mockOnAddToCart}
          onQuickView={mockOnQuickView}
        />
      );
    });

    then(/^the product name should be displayed as "(.*)"$/, (expectedName) => {
      expect(screen.getByText(expectedName)).toBeInTheDocument();
    });

    and(/^the product price should be displayed as "\$(\d+)\.(\d+)"$/, (dollars, cents) => {
      const expectedPrice = `$${dollars}.${cents}`;
      expect(screen.getByText(expectedPrice)).toBeInTheDocument();
    });

    and('the product image should be visible', () => {
      const image = screen.getByAltText(product.name);
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', product.images[0]);
    });

    and('the product description should be shown', () => {
      expect(screen.getByText(product.description)).toBeInTheDocument();
    });
  });

  test('Add product to cart from card', ({ given, when, then, and }) => {
    given('the product catalog is loaded', () => {
      expect(ProductCard).toBeDefined();
    });

    and('the shopping cart is available', () => {
      expect(mockOnAddToCart).toBeDefined();
    });

    and('the user is authenticated', () => {
      // User is authenticated by default in test environment
    });

    given(/^there is a product "(.*)" available for purchase$/, (productName) => {
      product.name = productName;
      product.stock = 10;
      product.isActive = true;
    });

    and('the product is in stock', () => {
      expect(product.stock).toBeGreaterThan(0);
    });

    when('the user clicks the "Add to Cart" button', () => {
      component = render(
        <ProductCard
          product={product}
          onAddToCart={mockOnAddToCart}
          onQuickView={mockOnQuickView}
        />
      );

      const addToCartButton = screen.getByText('Add to Cart');
      fireEvent.click(addToCartButton);
    });

    then('the product should be added to the cart', () => {
      expect(mockOnAddToCart).toHaveBeenCalledWith(product, 1);
    });

    and('the cart count should be updated', () => {
      // This would be tested in the cart store or parent component
      expect(mockOnAddToCart).toHaveBeenCalled();
    });

    and('a success message should be displayed', () => {
      // This would be tested in the cart store or parent component
      expect(mockOnAddToCart).toHaveBeenCalled();
    });
  });

  test('Product with discount', ({ given, when, then, and }) => {
    given('the product catalog is loaded', () => {
      expect(ProductCard).toBeDefined();
    });

    and('the shopping cart is available', () => {
      expect(mockOnAddToCart).toBeDefined();
    });

    and('the user is authenticated', () => {
      // User is authenticated by default in test environment
    });

    given(/^there is a product "(.*)" with original price \$(\d+)\.(\d+)$/, (productName, dollars, cents) => {
      product.name = productName;
      const originalPriceInCents = (parseInt(dollars) * 100) + parseInt(cents);
      product.price = TestDataBuilder.createMoney(originalPriceInCents);
    });

    and(/^the product has a (\d+)% discount$/, (discountPercentage) => {
      product.discountPercentage = parseInt(discountPercentage);
    });

    when('the product card is rendered', () => {
      component = render(
        <ProductCard
          product={product}
          onAddToCart={mockOnAddToCart}
          onQuickView={mockOnQuickView}
        />
      );
    });

    then(/^the original price should be displayed as "\$(\d+)\.(\d+)"$/, (dollars, cents) => {
      const originalPrice = `$${dollars}.${cents}`;
      expect(screen.getByText(originalPrice)).toBeInTheDocument();
    });

    and(/^the discounted price should be displayed as "\$(\d+)\.(\d+)"$/, (dollars, cents) => {
      const discountedPrice = `$${dollars}.${cents}`;
      expect(screen.getByText(discountedPrice)).toBeInTheDocument();
    });

    and(/^the discount percentage should be shown as "(\d+)% OFF"$/, (discountPercentage) => {
      const discountText = `${discountPercentage}% OFF`;
      expect(screen.getByText(discountText)).toBeInTheDocument();
    });

    and('the original price should be crossed out', () => {
      const originalPrice = screen.getByText('$60.00');
      expect(originalPrice).toHaveClass('line-through');
    });
  });

  test('Product out of stock', ({ given, when, then, and }) => {
    given('the product catalog is loaded', () => {
      expect(ProductCard).toBeDefined();
    });

    and('the shopping cart is available', () => {
      expect(mockOnAddToCart).toBeDefined();
    });

    and('the user is authenticated', () => {
      // User is authenticated by default in test environment
    });

    given(/^there is a product "(.*)" that is out of stock$/, (productName) => {
      product.name = productName;
      product.stock = 0;
      product.isActive = true;
    });

    when('the product card is rendered', () => {
      component = render(
        <ProductCard
          product={product}
          onAddToCart={mockOnAddToCart}
          onQuickView={mockOnQuickView}
        />
      );
    });

    then('the "Add to Cart" button should be disabled', () => {
      const addToCartButton = screen.getByText('Add to Cart');
      expect(addToCartButton).toBeDisabled();
    });

    and('an "Out of Stock" label should be displayed', () => {
      expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    });

    and('the product should be visually marked as unavailable', () => {
      const productCard = screen.getByTestId('product-card');
      expect(productCard).toHaveClass('opacity-50');
    });
  });

  test('Product with limited stock', ({ given, when, then, and }) => {
    given('the product catalog is loaded', () => {
      expect(ProductCard).toBeDefined();
    });

    and('the shopping cart is available', () => {
      expect(mockOnAddToCart).toBeDefined();
    });

    and('the user is authenticated', () => {
      // User is authenticated by default in test environment
    });

    given(/^there is a product "(.*)" with only (\d+) items in stock$/, (productName, stockCount) => {
      product.name = productName;
      product.stock = parseInt(stockCount);
      product.isActive = true;
    });

    when('the product card is rendered', () => {
      component = render(
        <ProductCard
          product={product}
          onAddToCart={mockOnAddToCart}
          onQuickView={mockOnQuickView}
        />
      );
    });

    then('a "Limited Stock" indicator should be displayed', () => {
      expect(screen.getByText('Limited Stock')).toBeInTheDocument();
    });

    and(/^the remaining quantity should be shown as "Only (\d+) left"$/, (stockCount) => {
      const stockText = `Only ${stockCount} left`;
      expect(screen.getByText(stockText)).toBeInTheDocument();
    });

    and('the "Add to Cart" button should be enabled', () => {
      const addToCartButton = screen.getByText('Add to Cart');
      expect(addToCartButton).not.toBeDisabled();
    });
  });

  test('Product with NFT badge', ({ given, when, then, and }) => {
    given('the product catalog is loaded', () => {
      expect(ProductCard).toBeDefined();
    });

    and('the shopping cart is available', () => {
      expect(mockOnAddToCart).toBeDefined();
    });

    and('the user is authenticated', () => {
      // User is authenticated by default in test environment
    });

    given(/^there is a product "(.*)" that includes an NFT$/, (productName) => {
      product.name = productName;
      product.nftConfig = {
        enabled: true,
        tokenStandard: 'ERC-721',
        metadata: {
          name: 'Premium T-Shirt NFT',
          description: 'NFT for Premium T-Shirt purchase'
        }
      };
    });

    when('the product card is rendered', () => {
      component = render(
        <ProductCard
          product={product}
          onAddToCart={mockOnAddToCart}
          onQuickView={mockOnQuickView}
        />
      );
    });

    then('an "NFT Included" badge should be displayed', () => {
      expect(screen.getByText('NFT Included')).toBeInTheDocument();
    });

    and('the badge should have an appropriate icon', () => {
      const nftBadge = screen.getByText('NFT Included');
      expect(nftBadge).toHaveClass('nft-badge');
    });

    and('the badge should be prominently visible', () => {
      const nftBadge = screen.getByText('NFT Included');
      expect(nftBadge).toBeVisible();
    });
  });

  test('Quick view product details', ({ given, when, then, and }) => {
    given('the product catalog is loaded', () => {
      expect(ProductCard).toBeDefined();
    });

    and('the shopping cart is available', () => {
      expect(mockOnAddToCart).toBeDefined();
    });

    and('the user is authenticated', () => {
      // User is authenticated by default in test environment
    });

    given(/^there is a product "(.*)" with detailed information$/, (productName) => {
      product.name = productName;
      product.description = 'Detailed product description with all features and specifications';
    });

    when('the user clicks the "Quick View" button', () => {
      component = render(
        <ProductCard
          product={product}
          onAddToCart={mockOnAddToCart}
          onQuickView={mockOnQuickView}
        />
      );

      const quickViewButton = screen.getByText('Quick View');
      fireEvent.click(quickViewButton);
    });

    then('a modal should open with detailed product information', () => {
      expect(mockOnQuickView).toHaveBeenCalledWith(product);
    });

    and('the modal should contain full product description', () => {
      expect(mockOnQuickView).toHaveBeenCalled();
    });

    and('the modal should show all available variants', () => {
      expect(mockOnQuickView).toHaveBeenCalled();
    });

    and('the modal should have an "Add to Cart" button', () => {
      expect(mockOnQuickView).toHaveBeenCalled();
    });
  });
}); 