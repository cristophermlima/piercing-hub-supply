
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, Package, Clock, MessageSquare, Mail, ShoppingCart } from 'lucide-react';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { useCart, useUpdateCartItem, useRemoveFromCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: cartItems = [], isLoading } = useCart();
  const updateCartMutation = useUpdateCartItem();
  const removeFromCartMutation = useRemoveFromCart();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user && !isLoading) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  const updateQuantity = (id: string, newQuantity: number) => {
    updateCartMutation.mutate({ id, quantity: newQuantity });
  };

  const removeItem = (id: string) => {
    removeFromCartMutation.mutate(id);
  };

  // Group items by supplier
  const itemsBySupplier = cartItems.reduce((acc, item) => {
    const supplierName = item.products.suppliers?.company_name || 'Fornecedor não encontrado';
    if (!acc[supplierName]) {
      acc[supplierName] = [];
    }
    acc[supplierName].push(item);
    return acc;
  }, {} as Record<string, typeof cartItems>);

  const getTotalBySupplier = (supplierItems: typeof cartItems) => {
    return supplierItems.reduce((total, item) => total + (item.products.price * item.quantity), 0);
  };

  const getGrandTotal = () => {
    return cartItems.reduce((total, item) => total + (item.products.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    toast({
      title: "Pedidos enviados!",
      description: "Seus pedidos foram enviados para os fornecedores via WhatsApp e e-mail",
    });
    console.log('Processando checkout para fornecedores:', Object.keys(itemsBySupplier));
  };

  const totalItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          cartItems={0}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Carregando carrinho...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        cartItems={totalItemsCount}
      />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Carrinho Multi-Fornecedor</h1>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
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
                      <div key={item.id} className="flex items-center space-x-4 border-b border-gray-100 pb-4">
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
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={updateCartMutation.isPending}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={updateCartMutation.isPending}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-2 text-red-600 hover:text-red-700"
                            onClick={() => removeItem(item.id)}
                            disabled={removeFromCartMutation.isPending}
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
                    onClick={handleCheckout}
                  >
                    Enviar Pedidos aos Fornecedores
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
