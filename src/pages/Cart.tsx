
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: number;
  name: string;
  price: number;
  supplier: string;
  material: string;
  size: string;
  quantity: number;
  image: string;
}

const Cart = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Argola Segmento Cravejado',
      price: 39.00,
      supplier: 'Piercing Gold Brasil',
      material: 'Titânio',
      size: '10mm',
      quantity: 2,
      image: '/placeholder.svg'
    },
    {
      id: 2,
      name: 'Labret Titânio PVD Gold',
      price: 55.00,
      supplier: 'Top Piercing Suppliers',
      material: 'Titânio PVD Gold',
      size: '8mm',
      quantity: 1,
      image: '/placeholder.svg'
    },
    {
      id: 6,
      name: 'Barbell Curvo Titânio',
      price: 32.00,
      supplier: 'Piercing Gold Brasil',
      material: 'Titânio',
      size: '16mm',
      quantity: 3,
      image: '/placeholder.svg'
    }
  ]);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
    toast({
      title: "Item removido",
      description: "Produto removido do carrinho",
    });
  };

  // Group items by supplier
  const itemsBySupplier = cartItems.reduce((acc, item) => {
    if (!acc[item.supplier]) {
      acc[item.supplier] = [];
    }
    acc[item.supplier].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  const getTotalBySupplier = (supplierItems: CartItem[]) => {
    return supplierItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getGrandTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    toast({
      title: "Pedido enviado!",
      description: "Seus pedidos foram enviados para os fornecedores",
    });
    console.log('Processando checkout para fornecedores:', Object.keys(itemsBySupplier));
  };

  const totalItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        cartItems={totalItemsCount}
      />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Carrinho de Compras</h1>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">Seu carrinho está vazio</p>
              <Button asChild>
                <a href="/marketplace">Continuar Comprando</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {Object.entries(itemsBySupplier).map(([supplier, items]) => (
                <Card key={supplier}>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{supplier}</span>
                      <Badge variant="outline">
                        {items.length} item{items.length !== 1 ? 's' : ''}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 border-b border-gray-100 pb-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {item.material}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {item.size}
                            </Badge>
                          </div>
                          <p className="text-lg font-bold mt-1">R$ {item.price.toFixed(2)}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-2 text-red-600 hover:text-red-700"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex justify-between items-center pt-2 font-semibold">
                      <span>Subtotal {supplier}:</span>
                      <span>R$ {getTotalBySupplier(items).toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
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
                  
                  <p className="text-sm text-gray-600">
                    Frete será calculado individualmente por cada fornecedor
                  </p>
                  
                  <Button 
                    className="w-full bg-black hover:bg-gray-800"
                    onClick={handleCheckout}
                  >
                    Finalizar Compra
                  </Button>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/marketplace">Continuar Comprando</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
