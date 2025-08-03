'use client';

import { useState, useEffect } from 'react';
import { ProductGrid } from '@/components/products/ProductGrid';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShoppingCart, Filter, Search, Zap } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/core/entities/Product';
import Link from 'next/link';

// Mock products for demo
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Ingresso Show de Rock',
    description: 'Ingresso para o maior show de rock do ano. Inclui acesso VIP e meet & greet.',
    price: 150.00,
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    category: 'Eventos',
    isNFT: true,
    rating: 4.8,
    reviewCount: 127,
    stock: 50,
    merchantId: 'merchant-1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Curso de Blockchain',
    description: 'Aprenda blockchain do zero ao avançado. 40 horas de conteúdo exclusivo.',
    price: 299.00,
    discountPercentage: 15,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop',
    category: 'Educação',
    isNFT: false,
    rating: 4.9,
    reviewCount: 89,
    stock: 100,
    merchantId: 'merchant-2',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'NFT Arte Digital',
    description: 'Coleção exclusiva de arte digital. Edição limitada de 100 peças.',
    price: 500.00,
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
    category: 'Arte',
    isNFT: true,
    rating: 4.7,
    reviewCount: 203,
    stock: 25,
    merchantId: 'merchant-3',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Workshop de Criptomoedas',
    description: 'Workshop presencial sobre investimentos em criptomoedas. Inclui material didático.',
    price: 199.00,
    imageUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=400&fit=crop',
    category: 'Educação',
    isNFT: false,
    rating: 4.6,
    reviewCount: 156,
    stock: 30,
    merchantId: 'merchant-4',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    name: 'Passaporte VIP Festival',
    description: 'Acesso VIP ao festival com área exclusiva, open bar e camarote.',
    price: 800.00,
    discountPercentage: 20,
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
    category: 'Eventos',
    isNFT: true,
    rating: 4.9,
    reviewCount: 78,
    stock: 20,
    merchantId: 'merchant-5',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    name: 'E-book Marketing Digital',
    description: 'Guia completo de marketing digital para empreendedores. 300 páginas de conteúdo.',
    price: 49.90,
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop',
    category: 'Educação',
    isNFT: false,
    rating: 4.5,
    reviewCount: 342,
    stock: 1000,
    merchantId: 'merchant-6',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export default function DemoPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { totalItems } = useCart();

  // Simulate loading products
  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const handleViewProduct = (product: Product) => {
    // TODO: Navigate to product detail page
    console.log('View product:', product);
  };

  const handleAddToWishlist = (product: Product) => {
    // TODO: Add to wishlist
    console.log('Add to wishlist:', product);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Xperience Hubs
              </span>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
            </div>

            {/* Cart Button */}
            <Button
              variant="outline"
              onClick={() => setCartOpen(true)}
              className="relative"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Carrinho
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Search */}
      <div className="md:hidden p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="border-b bg-muted/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4 overflow-x-auto">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              Categorias:
            </span>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category === 'all' ? 'Todas' : category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Loja Demo</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore nossa coleção de produtos digitais, NFTs e ingressos. 
            Experimente o carrinho de compras e o sistema de pagamento PIX.
          </p>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={filteredProducts}
          loading={loading}
          onViewProduct={handleViewProduct}
          onAddToWishlist={handleAddToWishlist}
        />
      </main>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </div>
  );
} 