
import React, { useState } from 'react';
import { Plus, Package, Users, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SupplierDashboard = () => {
  const [products] = useState([
    { id: 1, name: 'Argola', description: 'Argola segmento cravejado', price: 39.00, stock: 150 },
    { id: 2, name: 'Labret', description: 'Labret titânio pvd gold', price: 55.00, stock: 80 },
    { id: 3, name: 'Barbell', description: 'Barbell curvo em titânio', price: 45.00, stock: 120 }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Painel do Fornecedor</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm">Piercing Gold Brasil</span>
              <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <a href="#" className="flex items-center space-x-3 p-2 rounded-lg bg-black text-white">
                    <Package className="h-5 w-5" />
                    <span>Produtos</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
                    <Users className="h-5 w-5" />
                    <span>Pedidos</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
                    <BarChart3 className="h-5 w-5" />
                    <span>Relatórios</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
                    <Settings className="h-5 w-5" />
                    <span>Configurações</span>
                  </a>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total de Produtos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{products.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pedidos Este Mês</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">47</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Faturamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 5.234</div>
                </CardContent>
              </Card>
            </div>

            {/* Products Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Meus Produtos</CardTitle>
                  <Button className="bg-black hover:bg-gray-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Produto
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold">R$ {product.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">Estoque: {product.stock}</p>
                        </div>
                        <Badge variant={product.stock > 50 ? "default" : "destructive"}>
                          {product.stock > 50 ? "Em estoque" : "Baixo estoque"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;
