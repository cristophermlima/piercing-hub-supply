
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, Package, Clock } from 'lucide-react';
import { CartItem as CartItemType } from '@/hooks/useCart';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  isUpdating: boolean;
  isRemoving: boolean;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating,
  isRemoving
}) => {
  return (
    <div className="flex items-center space-x-4 border-b border-gray-100 pb-4">
      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
        <img 
          src={item.products.image_urls?.[0] || '/placeholder.svg'} 
          alt={item.products.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1">
        <h3 className="font-semibold">{item.products.name}</h3>
        <div className="flex gap-2 mt-1">
          <Badge variant="secondary" className="text-xs">
            {item.products.brand}
          </Badge>
          <Badge 
            variant="secondary" 
            className={`text-xs ${
              item.products.availability === 'in_stock' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {item.products.availability === 'in_stock' ? (
              <Package className="h-3 w-3 mr-1" />
            ) : (
              <Clock className="h-3 w-3 mr-1" />
            )}
            {item.products.availability === 'in_stock' ? 'Em Estoque' : 'Estoque Baixo'}
          </Badge>
        </div>
        <p className="text-xs text-gray-500 mt-1">SKU: {item.products.sku}</p>
        <p className="text-lg font-bold mt-1">R$ {item.products.price.toFixed(2)}</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          disabled={isUpdating}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          disabled={isUpdating}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="ml-2 text-red-600 hover:text-red-700"
          onClick={() => onRemove(item.id)}
          disabled={isRemoving}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
