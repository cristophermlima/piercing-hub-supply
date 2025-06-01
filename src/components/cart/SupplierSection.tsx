
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Mail } from 'lucide-react';
import CartItem from './CartItem';
import { CartItem as CartItemType } from '@/hooks/useCart';

interface SupplierSectionProps {
  supplier: string;
  items: CartItemType[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  isUpdating: boolean;
  isRemoving: boolean;
}

const SupplierSection: React.FC<SupplierSectionProps> = ({
  supplier,
  items,
  onUpdateQuantity,
  onRemove,
  isUpdating,
  isRemoving
}) => {
  const getTotalBySupplier = (supplierItems: CartItemType[]) => {
    return supplierItems.reduce((total, item) => total + (item.products.price * item.quantity), 0);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div>
            <span className="text-lg">{supplier}</span>
            <Badge variant="outline" className="ml-3">
              {items.length} item{items.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-1" />
              WhatsApp
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-1" />
              E-mail
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
            isUpdating={isUpdating}
            isRemoving={isRemoving}
          />
        ))}
        
        <div className="flex justify-between items-center pt-2 font-semibold">
          <span>Subtotal {supplier}:</span>
          <span>R$ {getTotalBySupplier(items).toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierSection;
