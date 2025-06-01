
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

const EmptyCart = () => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 text-lg mb-4">Seu carrinho está vazio</p>
        <Button asChild>
          <a href="/marketplace">Continuar Comprando</a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyCart;
