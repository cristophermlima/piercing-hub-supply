
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  supplier: string;
  material: string;
  size: string;
  image: string;
  onAddToCart: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  price,
  supplier,
  material,
  size,
  image,
  onAddToCart
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
            <span className="text-lg font-bold text-black">R${price.toFixed(2)}</span>
          </div>
          
          <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
          
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
              {material}
            </Badge>
            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
              {size}
            </Badge>
          </div>
          
          <div className="border-t pt-3">
            <p className="text-sm text-gray-500 mb-3">Por: {supplier}</p>
            
            <Button 
              onClick={() => onAddToCart(id)}
              className="w-full bg-black hover:bg-gray-800 text-white flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Adicionar ao Carrinho</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
