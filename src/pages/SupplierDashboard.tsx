
import React, { useState } from 'react';
import { Plus, Package, Users, BarChart3, Settings, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import CatalogUpload from '@/components/CatalogUpload';
import AddProductModal from '@/components/AddProductModal';

const SupplierDashboard = () => {
  const navigate = useNavigate();
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  
  const [products] = useState([
    { 
      id: 1, 
      name: 'Labret Titânio Premium 8mm', 
      description: 'Labret em titânio G23 com rosca interna', 
      price: 45.90, 
      stock: 150,
      material: 'Titânio',
      category: 'joias-titanio',
      jewelryType: 'labret',
      sizeMm: 8,
      thicknessMm: 1.2,
      lengthMm: 8,
      color: 'Natural'
    },
    { 
      id: 2, 
      name: 'Argola Segmento Ouro 18k 10mm', 
      description: 'Argola segmento em ouro 18k polido', 
      price: 450.00, 
      stock: 25,
      material: 'Ouro 18k',
      category: 'joias-ouro',
      jewelryType: 'argola-segmento',
      sizeMm: 10,
      thicknessMm: 1.2,
      diameterMm: 10,
      color: 'Dourado'
    },
    { 
      id: 3, 
      name: 'Barbell Curvo Titânio 12mm', 
      description: 'Barbell curvo em titânio com esferas', 
      price: 65.00, 
      stock: 120,
      material: 'Titânio',
      category: 'joias-titanio',
      jewelryType: 'barbell',
      sizeMm: 12,
      thicknessMm: 1.6,
      lengthMm: 12,
      color: 'Natural'
    },
    {
      id: 4,
      name: 'Plugs Titânio Rosqueado 14mm',
      description: 'Plugs em titânio com rosca dupla',
      price: 85.00,
      stock: 80,
      material: 'Titânio',
      category: 'joias-titanio',
      jewelryType: 'plugs',
      sizeMm: 14,
      thicknessMm: 14,
      color: 'Natural'
    },
    {
      id: 5,
      name: 'Argola Captive Ouro 14k 8mm',
      description: 'Argola captive em ouro 14k com esfera',
      price: 320.00,
      stock: 35,
      material: 'Ouro 14k',
      category: 'joias-ouro',
      jewelryType: 'argola-captive',
      sizeMm: 8,
      thicknessMm: 1.2,
      diameterMm: 8,
      color: 'Dourado'
    }
  ]);

  const handleProductAdded = () => {
    // Aqui você atualizaria a lista de produtos
    console.log('Produto adicionado com sucesso!');
  };

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
                  <button 
                    onClick={() => navigate('/supplier/orders')}
                    className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-left"
                  >
                    <Users className="h-5 w-5" />
                    <span>Pedidos</span>
                  </button>
                  <button 
                    onClick={() => navigate('/supplier/reports')}
                    className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-left"
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span>Relatórios</span>
                  </button>
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
                  <p className="text-xs text-gray-500">+2 este mês</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pedidos Este Mês</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">47</div>
                  <p className="text-xs text-green-600">+12% vs mês anterior</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Faturamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 15.234</div>
                  <p className="text-xs text-green-600">+8% vs mês anterior</p>
                </CardContent>
              </Card>
            </div>

            {/* Products Section with Tabs */}
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Produtos</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="list" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="list">Lista de Produtos</TabsTrigger>
                    <TabsTrigger value="upload">Upload de Catálogo</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="list" className="space-y-4 mt-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Meus Produtos</h3>
                      <Button 
                        className="bg-black hover:bg-gray-800"
                        onClick={() => setIsAddProductModalOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Produto
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {products.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Package className="h-8 w-8 text-gray-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{product.name}</h4>
                              <p className="text-sm text-gray-600">{product.description}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {product.material}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {product.jewelryType}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {product.sizeMm}mm
                                </Badge>
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${
                                    product.category === 'joias-ouro' 
                                      ? 'bg-yellow-100 text-yellow-700' 
                                      : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {product.category === 'joias-ouro' ? 'Ouro' : 'Titânio'}
                                </Badge>
                              </div>
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
                  </TabsContent>
                  
                  <TabsContent value="upload" className="mt-6">
                    <CatalogUpload />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AddProductModal 
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onSuccess={handleProductAdded}
      />
    </div>
  );
};

export default SupplierDashboard;
