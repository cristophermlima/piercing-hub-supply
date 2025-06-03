
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, DollarSign, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useSupplierProducts } from '@/hooks/useProducts';
import AddProductModal from '@/components/AddProductModal';

const SupplierDashboard = () => {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { data: products = [], isLoading } = useSupplierProducts();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock_quantity), 0);
  const lowStockProducts = products.filter(product => product.stock_quantity < 10).length;

  if (!user || profile?.user_type !== 'supplier') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-gray-600">Esta área é exclusiva para fornecedores.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard do Fornecedor</h1>
            <p className="text-gray-600 mt-2">
              Bem-vindo, {profile?.fantasy_name || profile?.full_name}
            </p>
          </div>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-black hover:bg-gray-800 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Produto
          </Button>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total em Estoque</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {totalValue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos com Estoque Baixo</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{lowStockProducts}</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de produtos */}
        <Card>
          <CardHeader>
            <CardTitle>Meus Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Carregando produtos...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg mb-4">Nenhum produto cadastrado</p>
                <Button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Produto
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {product.image_urls && product.image_urls[0] && (
                        <img 
                          src={product.image_urls[0]} 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">R$ {product.price.toFixed(2)}</Badge>
                          <Badge 
                            variant={product.stock_quantity < 10 ? "destructive" : "secondary"}
                          >
                            Estoque: {product.stock_quantity}
                          </Badge>
                          <Badge variant="secondary">{product.categories?.name}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <AddProductModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => setIsAddModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default SupplierDashboard;
