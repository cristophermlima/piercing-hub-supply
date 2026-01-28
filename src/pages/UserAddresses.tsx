import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { AddressList } from '@/components/address/AddressList';
import { useCart } from '@/hooks/useCart';

const UserAddresses = () => {
  const navigate = useNavigate();
  const { items: cartItems = [] } = useCart();
  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchTerm=""
        onSearchChange={() => {}}
        cartItems={totalCartItems}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/profile')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Meus Endereços</h1>
        </div>

        <AddressList />
      </div>
    </div>
  );
};

export default UserAddresses;
