
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Clock, Package, Gem } from 'lucide-react';

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  supplier: string;
  category: string;
  productType: string;
  brand: string;
  size?: string;
  stock: number;
  availability: 'pronta-entrega' | 'sob-encomenda';
  image: string;
  sku: string;
  technicalDescription?: string;
  deliveryTime?: string;
  material?: string;
  threadType?: string;
  color?: string;
  region?: string;
  certification?: string;
  onAddToCart: (id: number) => void;
}

const categoryLabels: Record<string, string> = {
  'insumos-estereis': 'Insumos Estéreis',
  'equipamentos': 'Equipamentos',
  'joias-titanio': 'Joias de Titânio',
  'joias-ouro': 'Joias de Ouro'
};

const availabilityLabels: Record<string, string> = {
  'pronta-entrega': 'Pronta Entrega',
  'sob-encomenda': 'Sob Encomenda'
};

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  price,
  supplier,
  category,
  productType,
  brand,
  size,
  stock,
  availability,
  image,
  sku,
  technicalDescription,
  deliveryTime,
  material,
  threadType,
  color,
  region,
  certification,
  onAddToCart
}) => {
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
              {categoryLabels[category] || category}
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

          {isJewelry && (
            <div className="flex flex-wrap gap-1">
              {threadType && (
                <Badge variant="outline" className="text-xs">
                  Rosca: {threadType}
                </Badge>
              )}
              {certification && (
                <Badge variant="outline" className="text-xs text-green-700 border-green-300">
                  {certification}
                </Badge>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Badge 
                variant={availability === 'pronta-entrega' ? 'default' : 'secondary'}
                className={`text-xs ${
                  availability === 'pronta-entrega' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {availability === 'pronta-entrega' ? (
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
          
          {deliveryTime && (
            <div className="text-xs text-gray-500">
              <Clock className="h-3 w-3 inline mr-1" />
              Entrega: {deliveryTime}
            </div>
          )}

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
            
            <Button 
              onClick={() => onAddToCart(id)}
              className="w-full bg-black hover:bg-gray-800 text-white flex items-center justify-center space-x-2"
              disabled={stock === 0}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>{stock === 0 ? 'Sem Estoque' : 'Adicionar ao Carrinho'}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
