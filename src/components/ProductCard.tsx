import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Clock, Package, Gem, Plus, Minus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAddToCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { FavoriteButton } from '@/components/favorites/FavoriteButton';
import { StarRating } from '@/components/reviews/StarRating';
import { useProductRating } from '@/hooks/useReviews';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  supplier: string;
  category: string;
  brand: string;
  size?: string;
  stock: number;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  image: string;
  sku: string;
  technicalDescription?: string;
  material?: string;
  color?: string;
  region?: string;
}

const availabilityLabels: Record<string, string> = {
  'in_stock': 'Em Estoque',
  'low_stock': 'Estoque Baixo',
  'out_of_stock': 'Sem Estoque'
};

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  price,
  supplier,
  category,
  brand,
  size,
  stock,
  availability,
  image,
  sku,
  technicalDescription,
  material,
  color,
  region
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const addToCartMutation = useAddToCart();
  const [quantity, setQuantity] = React.useState(1);
  const { data: ratingData } = useProductRating(id);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    addToCartMutation.mutate({ productId: id, quantity });
  };

  const incrementQuantity = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleViewDetails = () => {
    navigate(`/product/${id}`);
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow duration-200 h-full flex flex-col cursor-pointer"
      onClick={handleViewDetails}
    >
      <CardContent className="p-4 flex flex-col h-full">
        <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden relative group">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {/* Favorite Button */}
          <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
            <FavoriteButton productId={id} />
          </div>
        </div>
        
        <div className="space-y-3 flex-1 flex flex-col">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg line-clamp-2">{name}</h3>
            <span className="text-lg font-bold text-primary whitespace-nowrap ml-2">
              R$ {price.toFixed(2)}
            </span>
          </div>

          {/* Rating */}
          {ratingData && ratingData.count > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={ratingData.average} size="sm" />
              <span className="text-sm text-muted-foreground">
                ({ratingData.count})
              </span>
            </div>
          )}
          
          <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
          
          {technicalDescription && (
            <p className="text-xs text-muted-foreground line-clamp-2">{technicalDescription}</p>
          )}
          
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
            {material && (
              <Badge variant="secondary" className="text-xs">
                <Gem className="h-3 w-3 mr-1" />
                {material}
              </Badge>
            )}
            {color && color !== 'Natural' && (
              <Badge variant="secondary" className="text-xs">
                {color}
              </Badge>
            )}
            {size && (
              <Badge variant="secondary" className="text-xs">
                {size}
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs">
              {brand}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Badge 
                variant={availability === 'in_stock' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {availability === 'in_stock' ? (
                  <Package className="h-3 w-3 mr-1" />
                ) : (
                  <Clock className="h-3 w-3 mr-1" />
                )}
                {availabilityLabels[availability]}
              </Badge>
            </div>
            <span className="text-muted-foreground">
              Estoque: {stock}
            </span>
          </div>

          {region && (
            <div className="text-xs text-muted-foreground">
              Região: {region}
            </div>
          )}
          
          <div className="border-t pt-3 mt-auto">
            <p className="text-sm text-muted-foreground mb-3">
              Por: <span className="font-medium">{supplier}</span>
            </p>
            <p className="text-xs text-muted-foreground mb-3">SKU: {sku}</p>
            
            {/* Seletor de quantidade */}
            <div className="flex items-center justify-center gap-3 mb-3" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => { e.stopPropagation(); decrementQuantity(); }}
                disabled={quantity <= 1}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-medium text-sm w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => { e.stopPropagation(); incrementQuantity(); }}
                disabled={quantity >= stock}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button 
              onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
              className="w-full"
              disabled={stock === 0 || availability === 'out_of_stock' || addToCartMutation.isPending}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              <span>
                {stock === 0 || availability === 'out_of_stock' 
                  ? 'Sem Estoque' 
                  : addToCartMutation.isPending 
                  ? 'Adicionando...' 
                  : 'Adicionar ao Carrinho'
                }
              </span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
