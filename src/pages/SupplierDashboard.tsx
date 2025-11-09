
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, DollarSign, TrendingUp, Eye, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useSupplierProducts } from '@/hooks/useProducts';
import { useNavigate } from 'react-router-dom';
import SupplierHeader from '@/components/SupplierHeader';

const SupplierDashboard = () => {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: products = [], isLoading } = useSupplierProducts();
  const navigate = useNavigate();

  console.log('Dashboard - User:', user);
  console.log('Dashboard - Profile:', profile);
  console.log('Dashboard - Profile loading:', profileLoading);

  // Show loading only if user is not available
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Carregando...</h2>
            <p className="text-gray-600">Verificando autenticação...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user is supplier - prioritize user metadata over profile data
  const userType = profile?.user_type || user?.user_metadata?.user_type;
  const isSupplier = userType === 'supplier';

  console.log('Dashboard - User type:', userType, 'Is supplier:', isSupplier);

  if (!isSupplier) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-gray-600 mb-4">Esta área é exclusiva para fornecedores.</p>
            <Button onClick={() => navigate('/marketplace')}>
              Ir para Marketplace
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.is_active).length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock_quantity), 0);
  const lowStockProducts = products.filter(product => product.stock_quantity < 10).length;

  // Get display name from profile
  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Fornecedor';

  return (
    <div className="min-h-screen bg-gray-50">
      <SupplierHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Bem-vindo, {displayName}
            </p>
          </div>
          <Button 
            onClick={() => navigate('/supplier/products')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Package className="h-4 w-4 mr-2" />
            Gerenciar Produtos
          </Button>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                {activeProducts} ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total em Estoque</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {totalValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Valor total do inventário
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos com Estoque Baixo</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{lowStockProducts}</div>
              <p className="text-xs text-muted-foreground">
                Produtos com menos de 10 unidades
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos Ativos</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeProducts}</div>
              <p className="text-xs text-muted-foreground">
                Visíveis no marketplace
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" 
                onClick={() => navigate('/supplier/products')}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Gerenciar Produtos</h3>
                  <p className="text-sm text-gray-600">Adicionar, editar ou remover produtos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate('/supplier/orders')}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Pedidos</h3>
                  <p className="text-sm text-gray-600">Visualizar e gerenciar pedidos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate('/supplier/reports')}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Relatórios</h3>
                  <p className="text-sm text-gray-600">Acompanhar vendas e métricas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Produtos Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Produtos Recentes
              <Button variant="outline" onClick={() => navigate('/supplier/products')}>
                Ver Todos
              </Button>
            </CardTitle>
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
                  onClick={() => navigate('/supplier/products')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Produto
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {product.image_urls && product.image_urls[0] && (
                        <img 
                          src={product.image_urls[0]} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">R$ {product.price.toFixed(2)}</Badge>
                          <Badge 
                            variant={product.stock_quantity < 10 ? "destructive" : "secondary"}
                          >
                            Estoque: {product.stock_quantity}
                          </Badge>
                          <Badge variant={product.is_active ? "default" : "secondary"}>
                            {product.is_active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplierDashboard;
