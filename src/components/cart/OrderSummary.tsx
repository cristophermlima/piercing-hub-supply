
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/hooks/useCart';

interface OrderSummaryProps {
  itemsBySupplier: Record<string, CartItem[]>;
  onCheckout: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ itemsBySupplier, onCheckout }) => {
  const getTotalBySupplier = (supplierItems: CartItem[]) => {
    return supplierItems.reduce((total, item) => total + (item.products.price * item.quantity), 0);
  };

  const getGrandTotal = () => {
    return Object.values(itemsBySupplier)
      .flat()
      .reduce((total, item) => total + (item.products.price * item.quantity), 0);
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(itemsBySupplier).map(([supplier, items]) => (
          <div key={supplier} className="flex justify-between">
            <span className="text-sm text-gray-600">{supplier}</span>
            <span className="font-medium">R$ {getTotalBySupplier(items).toFixed(2)}</span>
          </div>
        ))}
        
        <div className="border-t pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total Geral</span>
            <span>R$ {getGrandTotal().toFixed(2)}</span>
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
          <h4 className="font-medium mb-2">Como funciona:</h4>
          <ul className="space-y-1 text-xs">
            <li>• Frete calculado por cada fornecedor</li>
            <li>• Pedidos enviados via WhatsApp/E-mail</li>
            <li>• Negociação direta com fornecedor</li>
            <li>• Pagamento conforme acordo</li>
          </ul>
        </div>
        
        <Button 
          className="w-full bg-black hover:bg-gray-800"
          onClick={onCheckout}
        >
          Enviar Pedidos aos Fornecedores
        </Button>
        
        <Button variant="outline" className="w-full" asChild>
          <a href="/marketplace">Continuar Comprando</a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
