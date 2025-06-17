
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useSupplierProducts, useDeleteProduct, useToggleProductStatus } from '@/hooks/useProducts';
import AddProductModal from '@/components/AddProductModal';
import EditProductModal from '@/components/EditProductModal';
import SupplierHeader from '@/components/SupplierHeader';

const SupplierProducts = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: products = [], isLoading: productsLoading, refetch, isRefetching } = useSupplierProducts();
  const deleteProduct = useDeleteProduct();
  const toggleStatus = useToggleProductStatus();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  console.log('SupplierProducts - Auth loading:', authLoading);
  console.log('SupplierProducts - User:', user);
  console.log('SupplierProducts - Profile:', profile);
  console.log('SupplierProducts - Products:', products);

  // Show loading while authentication is being checked
  if (authLoading) {
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

  // Show error if user is not available after loading
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Não Autenticado</h2>
            <p className="text-gray-600 mb-4">Você precisa fazer login para acessar esta página.</p>
            <Button onClick={() => window.location.href = '/auth'}>
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user is supplier - prioritize user metadata over profile data
  const userType = profile?.user_type || user?.user_metadata?.user_type;
  const isSupplier = userType === 'supplier';

  console.log('SupplierProducts - User type:', userType, 'Is supplier:', isSupplier);

  if (!isSupplier) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-gray-600 mb-4">Esta área é exclusiva para fornecedores.</p>
            <Button onClick={() => window.location.href = '/marketplace'}>
              Ir para Marketplace
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await deleteProduct.mutateAsync(productId);
        refetch();
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
      }
    }
  };

  const handleToggleStatus = async (productId: string, currentStatus: boolean) => {
    try {
      await toggleStatus.mutateAsync({ productId, isActive: !currentStatus });
      refetch();
    } catch (error) {
      console.error('Erro ao alterar status do produto:', error);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleModalSuccess = () => {
    setIsAddModalOpen(false);
    refetch();
  };

  const handleEditSuccess = () => {
    setEditingProduct(null);
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SupplierHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Meus Produtos</h1>
            <p className="text-gray-600 mt-1">
              Gerencie seu catálogo de produtos
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleRefresh}
              disabled={isRefetching}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Button>
          </div>
        </div>

        {/* Filtros e Busca */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar produtos por nome ou SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="text-sm text-gray-500">
                {filteredProducts.length} de {products.length} produtos
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Produtos */}
        <Card>
          <CardContent className="p-0">
            {productsLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Carregando produtos...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Plus className="h-16 w-16 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {products.length === 0 ? 'Nenhum produto cadastrado' : 'Nenhum produto encontrado'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {products.length === 0 
                    ? 'Comece adicionando seu primeiro produto ao catálogo'
                    : 'Tente ajustar os filtros de busca'
                  }
                </p>
                {products.length === 0 && (
                  <Button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Produto
                  </Button>
                )}
              </div>
            ) : (
              <div className="divide-y">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        {product.image_urls && product.image_urls[0] && (
                          <img 
                            src={product.image_urls[0]} 
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg border"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <Badge 
                              variant={product.is_active ? "default" : "secondary"}
                              className={product.is_active ? "bg-green-100 text-green-800" : ""}
                            >
                              {product.is_active ? 'Ativo' : 'Inativo'}
                            </Badge>
                            <Badge 
                              variant={product.stock_quantity > 10 ? "default" : "destructive"}
                            >
                              {product.availability === 'in_stock' ? 'Em estoque' : 
                               product.availability === 'low_stock' ? 'Estoque baixo' : 'Sem estoque'}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                          
                          <div className="flex items-center space-x-4 text-sm">
                            <span><strong>SKU:</strong> {product.sku}</span>
                            <span><strong>Preço:</strong> R$ {product.price.toFixed(2)}</span>
                            <span><strong>Estoque:</strong> {product.stock_quantity}</span>
                            <span><strong>Categoria:</strong> {product.categories?.name}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(product.id, product.is_active)}
                          disabled={toggleStatus.isPending}
                        >
                          {product.is_active ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={deleteProduct.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modais */}
        <AddProductModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleModalSuccess}
        />

        {editingProduct && (
          <EditProductModal
            isOpen={true}
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onSuccess={handleEditSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default SupplierProducts;
