
import React, { useState } from 'react';
import Header from '@/components/Header';
import EmptyCart from '@/components/cart/EmptyCart';
import SupplierSection from '@/components/cart/SupplierSection';
import OrderSummary from '@/components/cart/OrderSummary';
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
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {Object.entries(itemsBySupplier).map(([supplier, items]) => (
                <SupplierSection
                  key={supplier}
                  supplier={supplier}
                  items={items}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                  isUpdating={updateCartMutation.isPending}
                  isRemoving={removeFromCartMutation.isPending}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary
                itemsBySupplier={itemsBySupplier}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
