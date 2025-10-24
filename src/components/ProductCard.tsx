
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Clock, Package, Gem, Plus, Minus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAddToCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';

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

  const isJewelry = category.includes('joias');

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      <CardContent className="p-4 flex flex-col h-full">
        <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
        </div>
        
        <div className="space-y-3 flex-1 flex flex-col">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{name}</h3>
            <span className="text-lg font-bold text-black whitespace-nowrap ml-2">
              R$ {price.toFixed(2)}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
          
          {technicalDescription && (
            <p className="text-xs text-gray-500 line-clamp-2">{technicalDescription}</p>
          )}
          
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
              {category}
            </Badge>
            {material && (
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                <Gem className="h-3 w-3 mr-1" />
                {material}
              </Badge>
            )}
            {color && color !== 'Natural' && (
              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                {color}
              </Badge>
            )}
            {size && (
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                {size}
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
              {brand}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Badge 
                variant={availability === 'in_stock' ? 'default' : 'secondary'}
                className={`text-xs ${
                  availability === 'in_stock' 
                    ? 'bg-green-100 text-green-700' 
                    : availability === 'low_stock'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {availability === 'in_stock' ? (
                  <Package className="h-3 w-3 mr-1" />
                ) : (
                  <Clock className="h-3 w-3 mr-1" />
                )}
                {availabilityLabels[availability]}
              </Badge>
            </div>
            <span className="text-gray-500">
              Estoque: {stock}
            </span>
          </div>

          {region && (
            <div className="text-xs text-gray-500">
              Região: {region}
            </div>
          )}
          
          <div className="border-t pt-3 mt-auto">
            <p className="text-sm text-gray-500 mb-3">
              Por: <span className="font-medium">{supplier}</span>
            </p>
            <p className="text-xs text-gray-400 mb-3">SKU: {sku}</p>
            
            {/* Seletor de quantidade */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <Button
                variant="outline"
                size="sm"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-medium text-sm w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={incrementQuantity}
                disabled={quantity >= stock}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button 
              onClick={handleAddToCart}
              className="w-full bg-black hover:bg-gray-800 text-white flex items-center justify-center space-x-2"
              disabled={stock === 0 || availability === 'out_of_stock' || addToCartMutation.isPending}
            >
              <ShoppingCart className="h-4 w-4" />
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
