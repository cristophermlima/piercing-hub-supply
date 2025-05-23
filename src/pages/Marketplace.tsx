
import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState(0);

  const products = [
    {
      id: 1,
      name: 'Argola',
      description: 'Argola segmento cravejado',
      price: 39.00,
      supplier: 'Piercing Gold Brasil',
      material: 'Titânio',
      size: '10mm',
      image: '/placeholder.svg'
    },
    {
      id: 2,
      name: 'Labret',
      description: 'Labret titânio pvd gold',
      price: 55.00,
      supplier: 'Top Piercing Suppliers',
      material: 'Titânio PVD Gold',
      size: '8mm',
      image: '/placeholder.svg'
    },
    {
      id: 3,
      name: 'Argola',
      description: 'Argola titânio pvd gold',
      price: 45.00,
      supplier: 'Elite Joias Pro',
      material: 'Titânio PVD Gold',
      size: '12mm',
      image: '/placeholder.svg'
    }
  ];

  const addToCart = (productId: number) => {
    setCartItems(cartItems + 1);
    console.log(`Produto ${productId} adicionado ao carrinho`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Menu className="h-6 w-6 md:hidden" />
              <h1 className="text-2xl font-bold">PiercerHub</h1>
              <span className="text-sm text-gray-300">Marketplace</span>
            </div>
            
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Ex: argola em titânio 8mm"
                  className="pl-10 bg-white text-black"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                {cartItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs bg-red-500">
                    {cartItems}
                  </Badge>
                )}
              </div>
              <User className="h-6 w-6" />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 py-4">
            <a href="#" className="text-gray-600 hover:text-black font-medium">Página Inicial</a>
            <a href="#" className="text-gray-600 hover:text-black font-medium">Base Fornecedores</a>
            <a href="#" className="text-gray-600 hover:text-black font-medium">Catálogo</a>
            <a href="#" className="text-black font-medium border-b-2 border-black">Produtos</a>
          </div>
        </div>
      </nav>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">Todos os Fornecedores</Button>
            <Button variant="outline" size="sm">Piercing Gold Brasil</Button>
            <Button variant="outline" size="sm">Top Piercing Suppliers</Button>
            <Button variant="outline" size="sm">Gemas & Piercings</Button>
            <Button variant="outline" size="sm">Elite Joias Pro</Button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <span className="text-lg font-bold">R${product.price.toFixed(2)}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm">{product.description}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">{product.material}</Badge>
                    <Badge variant="secondary" className="text-xs">{product.size}</Badge>
                  </div>
                  
                  <p className="text-sm text-gray-500">Fornecedor: {product.supplier}</p>
                  
                  <Button 
                    onClick={() => addToCart(product.id)}
                    className="w-full bg-black hover:bg-gray-800 text-white"
                  >
                    Adicionar ao Carrinho
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-2">PiercerHub Marketplace</h3>
          <p className="text-gray-400">Conectando profissionais do body piercing</p>
        </div>
      </footer>
    </div>
  );
};

export default Marketplace;
