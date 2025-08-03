'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShoppingCart, Heart, Eye, Star, Tag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/core/entities/Product';

interface ProductCardProps {
  product: Product;
  onView?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
}

export function ProductCard({ product, onView, onAddToWishlist }: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await addToCart(product, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = () => {
    onView?.(product);
  };

  const handleWishlist = () => {
    onAddToWishlist?.(product);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <Card 
      className="product-card group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden">
          <img
            src={product.imageUrl || '/placeholder-product.jpg'}
            alt={product.name}
            className="product-image w-full h-full object-cover"
          />
          <div className="product-overlay" />
        </div>

        {/* Product Actions */}
        <div className="product-actions">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleView}
            className="rounded-full w-10 h-10 p-0"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleWishlist}
            className="rounded-full w-10 h-10 p-0"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        {/* Discount Badge */}
        {product.discountPercentage && product.discountPercentage > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            -{product.discountPercentage}%
          </Badge>
        )}

        {/* NFT Badge */}
        {product.isNFT && (
          <Badge className="absolute top-2 right-2 bg-purple-500 text-white">
            NFT
          </Badge>
        )}
      </div>

      <CardHeader className="p-4">
        <div className="space-y-2">
          {/* Category */}
          <div className="flex items-center text-xs text-muted-foreground">
            <Tag className="w-3 h-3 mr-1" />
            {product.category}
          </div>

          {/* Title */}
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {product.name}
          </CardTitle>

          {/* Description */}
          <CardDescription className="line-clamp-2 text-sm">
            {product.description}
          </CardDescription>

          {/* Rating */}
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < (product.rating || 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            {product.discountPercentage && product.discountPercentage > 0 ? (
              <>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(product.price * (1 - product.discountPercentage / 100))}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-primary">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={isLoading || isInCart(product.id)}
          className="w-full"
          size="lg"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {isLoading 
            ? 'Adicionando...' 
            : isInCart(product.id) 
              ? 'No Carrinho' 
              : 'Adicionar ao Carrinho'
          }
        </Button>
      </CardContent>
    </Card>
  );
} 