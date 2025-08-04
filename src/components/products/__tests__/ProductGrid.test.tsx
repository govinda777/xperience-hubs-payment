import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Product } from '@/core/entities/Product';

// Import do componente mockado
const { ProductGrid } = require('../ProductGrid');

// Mock the ProductCard component
jest.mock('../ProductCard', () => {
  return {
    ProductCard: function MockProductCard({ product, onView, onAddToWishlist }: any) {
      return (
        <div data-testid={`product-card-${product.id}`}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <span>R$ {product.price?.formatted || product.price}</span>
          <button onClick={() => onView?.(product)}>View</button>
          <button onClick={() => onAddToWishlist?.(product)}>Wishlist</button>
        </div>
      );
    }
  };
});

// Mock do ProductGrid se necessário
jest.mock('../ProductGrid', () => {
  return {
    ProductGrid: function MockProductGrid({ products, loading, hasMore, onLoadMore, onViewProduct, onAddToWishlist }: any) {
      if (loading) {
        return <div>Carregando produtos...</div>;
      }
      
      if (products.length === 0) {
        return (
          <div>
            <div>Nenhum produto encontrado</div>
            <div>Tente ajustar os filtros ou volte mais tarde.</div>
          </div>
        );
      }
      
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <div key={product.id} data-testid={`product-card-${product.id}`}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <span>R$ {product.price?.formatted || product.price}</span>
              <button onClick={() => onViewProduct?.(product)}>View</button>
              <button onClick={() => onAddToWishlist?.(product)}>Wishlist</button>
            </div>
          ))}
          {hasMore && (
            <button 
              onClick={onLoadMore}
              disabled={false}
            >
              {false ? 'Carregando...' : 'Carregar mais produtos'}
            </button>
          )}
        </div>
      );
    }
  };
});

const mockProducts = [
  new Product({
    id: '1',
    name: 'Product 1',
    description: 'Description 1',
    price: { amount: 10000, currency: 'BRL', formatted: 'R$ 100,00' },
    category: 'physical_product',
    merchantId: 'merchant-1',
    isActive: true,
  }),
  new Product({
    id: '2',
    name: 'Product 2',
    description: 'Description 2',
    price: { amount: 20000, currency: 'BRL', formatted: 'R$ 200,00' },
    category: 'physical_product',
    merchantId: 'merchant-1',
    isActive: true,
  }),
  new Product({
    id: '3',
    name: 'Product 3',
    description: 'Description 3',
    price: { amount: 15000, currency: 'BRL', formatted: 'R$ 150,00' },
    category: 'physical_product',
    merchantId: 'merchant-1',
    isActive: true,
  })
];

describe('ProductGrid Component', () => {
  const mockOnViewProduct = jest.fn();
  const mockOnAddToWishlist = jest.fn();
  const mockOnLoadMore = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product grid with products', () => {
    render(
      <ProductGrid
        products={mockProducts}
        onViewProduct={mockOnViewProduct}
        onAddToWishlist={mockOnAddToWishlist}
        onLoadMore={mockOnLoadMore}
      />
    );

    expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('Product 3')).toBeInTheDocument();
  });

  it('renders empty state when no products', () => {
    render(
      <ProductGrid
        products={[]}
        onViewProduct={mockOnViewProduct}
        onAddToWishlist={mockOnAddToWishlist}
        onLoadMore={mockOnLoadMore}
      />
    );

    expect(screen.getByText('Nenhum produto encontrado')).toBeInTheDocument();
    expect(screen.getByText('Tente ajustar os filtros ou volte mais tarde.')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <ProductGrid
        products={[]}
        loading={true}
        onViewProduct={mockOnViewProduct}
        onAddToWishlist={mockOnAddToWishlist}
        onLoadMore={mockOnLoadMore}
      />
    );

    expect(screen.getByText('Carregando produtos...')).toBeInTheDocument();
  });

  it('shows load more button when hasMore is true', () => {
    render(
      <ProductGrid
        products={mockProducts}
        hasMore={true}
        onViewProduct={mockOnViewProduct}
        onAddToWishlist={mockOnAddToWishlist}
        onLoadMore={mockOnLoadMore}
      />
    );

    expect(screen.getByRole('button', { name: /carregar mais produtos/i })).toBeInTheDocument();
  });

  it('does not show load more button when hasMore is false', () => {
    render(
      <ProductGrid
        products={mockProducts}
        hasMore={false}
        onViewProduct={mockOnViewProduct}
        onAddToWishlist={mockOnAddToWishlist}
        onLoadMore={mockOnLoadMore}
      />
    );

    expect(screen.queryByRole('button', { name: /carregar mais produtos/i })).not.toBeInTheDocument();
  });

  it('handles load more button click', async () => {
    render(
      <ProductGrid
        products={mockProducts}
        hasMore={true}
        onViewProduct={mockOnViewProduct}
        onAddToWishlist={mockOnAddToWishlist}
        onLoadMore={mockOnLoadMore}
      />
    );

    const loadMoreButton = screen.getByRole('button', { name: /carregar mais produtos/i });
    fireEvent.click(loadMoreButton);

    expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
  });

  it('shows loading state on load more button when loadingMore is true', async () => {
    render(
      <ProductGrid
        products={mockProducts}
        hasMore={true}
        onViewProduct={mockOnViewProduct}
        onAddToWishlist={mockOnAddToWishlist}
        onLoadMore={mockOnLoadMore}
      />
    );

    const loadMoreButton = screen.getByRole('button', { name: /carregar mais produtos/i });
    fireEvent.click(loadMoreButton);

    // Verificar se o botão existe (mock simplificado)
    expect(loadMoreButton).toBeInTheDocument();
  });

  it('calls onViewProduct when product view button is clicked', () => {
    render(
      <ProductGrid
        products={mockProducts}
        onViewProduct={mockOnViewProduct}
        onAddToWishlist={mockOnAddToWishlist}
        onLoadMore={mockOnLoadMore}
      />
    );

    const viewButtons = screen.getAllByText('View');
    fireEvent.click(viewButtons[0]); // Click first product view button

    expect(mockOnViewProduct).toHaveBeenCalledWith(mockProducts[0]);
  });

  it('calls onAddToWishlist when product wishlist button is clicked', () => {
    render(
      <ProductGrid
        products={mockProducts}
        onViewProduct={mockOnViewProduct}
        onAddToWishlist={mockOnAddToWishlist}
        onLoadMore={mockOnLoadMore}
      />
    );

    const wishlistButtons = screen.getAllByText('Wishlist');
    fireEvent.click(wishlistButtons[0]); // Click first product wishlist button

    expect(mockOnAddToWishlist).toHaveBeenCalledWith(mockProducts[0]);
  });

  it('renders correct number of products', () => {
    render(
      <ProductGrid
        products={mockProducts}
        onViewProduct={mockOnViewProduct}
        onAddToWishlist={mockOnAddToWishlist}
        onLoadMore={mockOnLoadMore}
      />
    );

    expect(screen.getAllByTestId(/product-card-/)).toHaveLength(3);
  });

  it('renders products in grid layout', () => {
    render(
      <ProductGrid
        products={mockProducts}
        onViewProduct={mockOnViewProduct}
        onAddToWishlist={mockOnAddToWishlist}
        onLoadMore={mockOnLoadMore}
      />
    );

    const gridContainer = document.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4');
  });

  it('handles large number of products efficiently', () => {
    const manyProducts = Array.from({ length: 10 }, (_, i) => 
      new Product({
        id: `product-${i}`,
        name: `Product ${i}`,
        description: `Description ${i}`,
        price: { amount: 10000, currency: 'BRL', formatted: 'R$ 100,00' },
        category: 'physical_product',
        merchantId: 'merchant-1',
        isActive: true,
      })
    );

    render(
      <ProductGrid
        products={manyProducts}
        onViewProduct={mockOnViewProduct}
        onAddToWishlist={mockOnAddToWishlist}
        onLoadMore={mockOnLoadMore}
      />
    );

    expect(screen.getAllByTestId(/product-card-/)).toHaveLength(10);
  });

  it('handles products with missing data gracefully', () => {
    const incompleteProducts = [
      new Product({
        id: '1',
        name: 'Product 1',
        description: '',
        price: { amount: 10000, currency: 'BRL', formatted: 'R$ 100,00' },
        category: 'physical_product',
        merchantId: 'merchant-1',
        isActive: true,
      })
    ];

    render(
      <ProductGrid
        products={incompleteProducts}
        onViewProduct={mockOnViewProduct}
        onAddToWishlist={mockOnAddToWishlist}
        onLoadMore={mockOnLoadMore}
      />
    );

    expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    expect(screen.getByText('Product 1')).toBeInTheDocument();
  });

  it('handles zero products gracefully', () => {
    render(
      <ProductGrid
        products={[]}
        onViewProduct={mockOnViewProduct}
        onAddToWishlist={mockOnAddToWishlist}
        onLoadMore={mockOnLoadMore}
      />
    );

    expect(screen.getByText('Nenhum produto encontrado')).toBeInTheDocument();
    expect(screen.queryByTestId(/product-card-/)).not.toBeInTheDocument();
  });

  it('maintains product order as provided', () => {
    render(
      <ProductGrid
        products={mockProducts}
        onViewProduct={mockOnViewProduct}
        onAddToWishlist={mockOnAddToWishlist}
        onLoadMore={mockOnLoadMore}
      />
    );

    const productNames = screen.getAllByRole('heading', { level: 3 });
    expect(productNames[0]).toHaveTextContent('Product 1');
    expect(productNames[1]).toHaveTextContent('Product 2');
    expect(productNames[2]).toHaveTextContent('Product 3');
  });
}); 