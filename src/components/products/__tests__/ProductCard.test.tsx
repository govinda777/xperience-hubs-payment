import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductCard } from '../ProductCard';
import { Product } from '@/core/entities/Product';

// Mock the useCart hook
jest.mock('@/hooks/useCart', () => ({
  useCart: () => ({
    addToCart: jest.fn(),
    isInCart: jest.fn(() => false)
  })
}));

// Mock Next.js Image component
jest.mock('next/image', () => {
  return ({ src, alt, ...props }: any) => {
    return <img src={src} alt={alt} {...props} />;
  };
});

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'This is a test product description',
  price: 99.99,
  imageUrl: 'https://example.com/test-image.jpg',
  category: 'Electronics',
  isNFT: false,
  rating: 4.5,
  reviewCount: 25,
  stock: 10,
  merchantId: 'merchant-1',
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockNFTProduct: Product = {
  ...mockProduct,
  id: '2',
  name: 'NFT Product',
  isNFT: true
};

const mockDiscountedProduct: Product = {
  ...mockProduct,
  id: '3',
  name: 'Discounted Product',
  discountPercentage: 20
};

describe('ProductCard Component', () => {
  const mockOnView = jest.fn();
  const mockOnAddToWishlist = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product information correctly', () => {
    render(
      <ProductCard 
        product={mockProduct}
        onView={mockOnView}
        onAddToWishlist={mockOnAddToWishlist}
      />
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('This is a test product description')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('R$ 99,99')).toBeInTheDocument();
    expect(screen.getByText('(25)')).toBeInTheDocument();
  });

  it('renders product image with correct attributes', () => {
    render(
      <ProductCard 
        product={mockProduct}
        onView={mockOnView}
        onAddToWishlist={mockOnAddToWishlist}
      />
    );

    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/test-image.jpg');
  });

  it('renders fallback image when imageUrl is not provided', () => {
    const productWithoutImage = { ...mockProduct, imageUrl: undefined };
    
    render(
      <ProductCard 
        product={productWithoutImage}
        onView={mockOnView}
        onAddToWishlist={mockOnAddToWishlist}
      />
    );

    const image = screen.getByAltText('Test Product');
    expect(image).toHaveAttribute('src', '/placeholder-product.jpg');
  });

  it('displays NFT badge for NFT products', () => {
    render(
      <ProductCard 
        product={mockNFTProduct}
        onView={mockOnView}
        onAddToWishlist={mockOnAddToWishlist}
      />
    );

    expect(screen.getByText('NFT')).toBeInTheDocument();
  });

  it('displays discount badge for discounted products', () => {
    render(
      <ProductCard 
        product={mockDiscountedProduct}
        onView={mockOnView}
        onAddToWishlist={mockOnAddToWishlist}
      />
    );

    expect(screen.getByText('-20%')).toBeInTheDocument();
  });

  it('displays discounted price correctly', () => {
    render(
      <ProductCard 
        product={mockDiscountedProduct}
        onView={mockOnView}
        onAddToWishlist={mockOnAddToWishlist}
      />
    );

    // Original price should be displayed with line-through
    expect(screen.getByText('R$ 99,99')).toHaveClass('line-through');
    // Discounted price should be displayed prominently
    expect(screen.getByText('R$ 79,99')).toBeInTheDocument();
  });

  it('renders star rating correctly', () => {
    render(
      <ProductCard 
        product={mockProduct}
        onView={mockOnView}
        onAddToWishlist={mockOnAddToWishlist}
      />
    );

    // Should render 5 stars (4.5 rating should show 4 filled + 1 empty)
    const stars = screen.getAllByRole('img', { hidden: true });
    expect(stars).toHaveLength(5);
  });

  it('handles add to cart button click', async () => {
    const mockAddToCart = jest.fn();
    jest.doMock('@/hooks/useCart', () => ({
      useCart: () => ({
        addToCart: mockAddToCart,
        isInCart: jest.fn(() => false)
      })
    }));

    render(
      <ProductCard 
        product={mockProduct}
        onView={mockOnView}
        onAddToWishlist={mockOnAddToWishlist}
      />
    );

    const addToCartButton = screen.getByRole('button', { name: /adicionar ao carrinho/i });
    fireEvent.click(addToCartButton);

    await waitFor(() => {
      expect(addToCartButton).toHaveTextContent('Adicionando...');
    });
  });

  it('handles view button click', () => {
    render(
      <ProductCard 
        product={mockProduct}
        onView={mockOnView}
        onAddToWishlist={mockOnAddToWishlist}
      />
    );

    const viewButton = screen.getByRole('button', { name: '' }); // Eye icon
    fireEvent.click(viewButton);

    expect(mockOnView).toHaveBeenCalledWith(mockProduct);
  });

  it('handles wishlist button click', () => {
    render(
      <ProductCard 
        product={mockProduct}
        onView={mockOnView}
        onAddToWishlist={mockOnAddToWishlist}
      />
    );

    const wishlistButton = screen.getAllByRole('button', { name: '' })[1]; // Heart icon
    fireEvent.click(wishlistButton);

    expect(mockOnAddToWishlist).toHaveBeenCalledWith(mockProduct);
  });

  it('shows "No Carrinho" when product is already in cart', () => {
    jest.doMock('@/hooks/useCart', () => ({
      useCart: () => ({
        addToCart: jest.fn(),
        isInCart: jest.fn(() => true)
      })
    }));

    render(
      <ProductCard 
        product={mockProduct}
        onView={mockOnView}
        onAddToWishlist={mockOnAddToWishlist}
      />
    );

    expect(screen.getByText('No Carrinho')).toBeInTheDocument();
  });

  it('disables add to cart button when product is in cart', () => {
    jest.doMock('@/hooks/useCart', () => ({
      useCart: () => ({
        addToCart: jest.fn(),
        isInCart: jest.fn(() => true)
      })
    }));

    render(
      <ProductCard 
        product={mockProduct}
        onView={mockOnView}
        onAddToWishlist={mockOnAddToWishlist}
      />
    );

    const addToCartButton = screen.getByRole('button', { name: /no carrinho/i });
    expect(addToCartButton).toBeDisabled();
  });

  it('handles hover effects', () => {
    render(
      <ProductCard 
        product={mockProduct}
        onView={mockOnView}
        onAddToWishlist={mockOnAddToWishlist}
      />
    );

    const card = screen.getByText('Test Product').closest('.product-card');
    expect(card).toHaveClass('group');
  });

  it('formats price correctly for different values', () => {
    const expensiveProduct = { ...mockProduct, price: 1299.99 };
    
    render(
      <ProductCard 
        product={expensiveProduct}
        onView={mockOnView}
        onAddToWishlist={mockOnAddToWishlist}
      />
    );

    expect(screen.getByText('R$ 1.299,99')).toBeInTheDocument();
  });

  it('handles products with zero rating', () => {
    const noRatingProduct = { ...mockProduct, rating: 0, reviewCount: 0 };
    
    render(
      <ProductCard 
        product={noRatingProduct}
        onView={mockOnView}
        onAddToWishlist={mockOnAddToWishlist}
      />
    );

    expect(screen.getByText('(0)')).toBeInTheDocument();
  });

  it('handles products with undefined rating', () => {
    const undefinedRatingProduct = { ...mockProduct, rating: undefined, reviewCount: undefined };
    
    render(
      <ProductCard 
        product={undefinedRatingProduct}
        onView={mockOnView}
        onAddToWishlist={mockOnAddToWishlist}
      />
    );

    expect(screen.getByText('(0)')).toBeInTheDocument();
  });

  it('renders with proper accessibility attributes', () => {
    render(
      <ProductCard 
        product={mockProduct}
        onView={mockOnView}
        onAddToWishlist={mockOnAddToWishlist}
      />
    );

    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();

    const addToCartButton = screen.getByRole('button', { name: /adicionar ao carrinho/i });
    expect(addToCartButton).toBeInTheDocument();
  });

  it('handles long product names gracefully', () => {
    const longNameProduct = {
      ...mockProduct,
      name: 'This is a very long product name that might overflow the container and need to be handled properly'
    };
    
    render(
      <ProductCard 
        product={longNameProduct}
        onView={mockOnView}
        onAddToWishlist={mockOnAddToWishlist}
      />
    );

    expect(screen.getByText(longNameProduct.name)).toBeInTheDocument();
  });

  it('handles long descriptions gracefully', () => {
    const longDescProduct = {
      ...mockProduct,
      description: 'This is a very long product description that might overflow the container and need to be handled properly with proper text truncation and ellipsis'
    };
    
    render(
      <ProductCard 
        product={longDescProduct}
        onView={mockOnView}
        onAddToWishlist={mockOnAddToWishlist}
      />
    );

    expect(screen.getByText(longDescProduct.description)).toBeInTheDocument();
  });

  it('handles error during add to cart', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockAddToCart = jest.fn().mockRejectedValue(new Error('Cart error'));
    
    jest.doMock('@/hooks/useCart', () => ({
      useCart: () => ({
        addToCart: mockAddToCart,
        isInCart: jest.fn(() => false)
      })
    }));

    render(
      <ProductCard 
        product={mockProduct}
        onView={mockOnView}
        onAddToWishlist={mockOnAddToWishlist}
      />
    );

    const addToCartButton = screen.getByRole('button', { name: /adicionar ao carrinho/i });
    fireEvent.click(addToCartButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error adding to cart:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
}); 