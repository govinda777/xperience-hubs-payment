'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Trash2, Minus, Plus, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/core/entities/Product';

interface CartItemProps {
  product: Product;
  quantity: number;
  onRemove?: (productId: string) => void;
}

export function CartItem({ product, quantity, onRemove }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    try {
      await updateQuantity(product.id, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await removeFromCart(product.id);
      onRemove?.(product.id);
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getDiscountedPrice = () => {
    if (product.discountPercentage && product.discountPercentage > 0) {
      return product.price * (1 - product.discountPercentage / 100);
    }
    return product.price;
  };

  const itemPrice = getDiscountedPrice();
  const totalPrice = itemPrice * quantity;

  return (
    <Card className="cart-item">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <img
              src={product.imageUrl || '/placeholder-product.jpg'}
              alt={product.name}
              className="cart-item-image"
            />
          </div>

          {/* Product Details */}
          <div className="cart-item-details flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="cart-item-title font-medium text-sm">
                  {product.name}
                </h3>
                <p className="cart-item-price text-sm text-muted-foreground">
                  {formatPrice(itemPrice)} cada
                </p>
                
                {/* NFT Badge */}
                {product.isNFT && (
                  <Badge className="mt-1 bg-purple-500 text-white text-xs">
                    NFT
                  </Badge>
                )}
              </div>

              {/* Remove Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                disabled={isUpdating}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Quantity Controls */}
            <div className="cart-item-quantity flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={isUpdating || quantity <= 1}
                  className="quantity-button"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                
                <span className="w-8 text-center text-sm font-medium">
                  {quantity}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={isUpdating}
                  className="quantity-button"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>

              {/* Total Price */}
              <div className="text-right">
                <div className="text-sm font-semibold text-primary">
                  {formatPrice(totalPrice)}
                </div>
                {product.discountPercentage && product.discountPercentage > 0 && (
                  <div className="text-xs text-muted-foreground line-through">
                    {formatPrice(product.price * quantity)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 