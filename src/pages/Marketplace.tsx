
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { useToast } from '@/hooks/use-toast';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState(0);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const { toast } = useToast();

  const products = [
    {
      id: 1,
      name: 'Argola Segmento Cravejado',
      description: 'Argola segmento em titânio com zircônias, ideal para cartilagem e hélix',
      price: 39.00,
      supplier: 'Piercing Gold Brasil',
      material: 'Titânio',
      size: '10mm',
      category: 'Argolas',
      stock: 150,
      image: '/placeholder.svg'
    },
    {
      id: 2,
      name: 'Labret Titânio PVD Gold',
      description: 'Labret em titânio com banho PVD gold, rosca interna',
      price: 55.00,
      supplier: 'Top Piercing Suppliers',
      material: 'Titânio PVD Gold',
      size: '8mm',
      category: 'Labrets',
      stock: 80,
      image: '/placeholder.svg'
    },
    {
      id: 3,
      name: 'Argola Clicker Titânio',
      description: 'Argola clicker em titânio anodizado, fecho seguro',
      price: 45.00,
      supplier: 'Elite Joias Pro',
      material: 'Titânio Anodizado',
      size: '12mm',
      category: 'Argolas',
      stock: 120,
      image: '/placeholder.svg'
    },
    {
      id: 4,
      name: 'Agulha Descartável Estéril 14G',
      description: 'Agulha descartável estéril para body piercing, embalagem individual',
      price: 2.50,
      supplier: 'Medical Supply Pro',
      material: 'Aço Cirúrgico',
      size: '14G',
      category: 'Insumos',
      stock: 500,
      image: '/placeholder.svg'
    },
    {
      id: 5,
      name: 'Autoclave Digital 12L',
      description: 'Autoclave digital para esterilização de equipamentos, 12 litros',
      price: 1850.00,
      supplier: 'EquipMed Brasil',
      material: 'Inox',
      size: '12L',
      category: 'Equipamentos',
      stock: 5,
      image: '/placeholder.svg'
    },
    {
      id: 6,
      name: 'Barbell Curvo Titânio',
      description: 'Barbell curvo em titânio grau implante, rosca externa',
      price: 32.00,
      supplier: 'Piercing Gold Brasil',
      material: 'Titânio',
      size: '16mm',
      category: 'Barbells',
      stock: 200,
      image: '/placeholder.svg'
    }
  ];

  const suppliers = [...new Set(products.map(p => p.supplier))];
  const categories = [...new Set(products.map(p => p.category))];
  const materials = [...new Set(products.map(p => p.material))];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.size.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSupplier = !selectedSupplier || product.supplier === selectedSupplier;
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesMaterial = !selectedMaterial || product.material === selectedMaterial;
      
      return matchesSearch && matchesSupplier && matchesCategory && matchesMaterial;
    });
  }, [searchTerm, selectedSupplier, selectedCategory, selectedMaterial]);

  const addToCart = (productId: number) => {
    const product = products.find(p => p.id === productId);
    setCartItems(cartItems + 1);
    toast({
      title: "Produto adicionado",
      description: `${product?.name} foi adicionado ao carrinho`,
    });
    console.log(`Produto ${productId} adicionado ao carrinho`);
  };

  const clearFilters = () => {
    setSelectedSupplier('');
    setSelectedCategory('');
    setSelectedMaterial('');
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        cartItems={cartItems}
      />

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 py-4">
            <a href="/" className="text-gray-600 hover:text-black font-medium">Página Inicial</a>
            <a href="#" className="text-gray-600 hover:text-black font-medium">Base Fornecedores</a>
            <a href="#" className="text-gray-600 hover:text-black font-medium">Catálogo</a>
            <a href="#" className="text-black font-medium border-b-2 border-black">Produtos</a>
          </div>
        </div>
      </nav>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <h3 className="text-sm font-medium text-gray-700 mr-4">Filtros:</h3>
            
            <select 
              value={selectedSupplier} 
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="text-sm border border-gray-300 rounded px-3 py-1"
            >
              <option value="">Todos os Fornecedores</option>
              {suppliers.map(supplier => (
                <option key={supplier} value={supplier}>{supplier}</option>
              ))}
            </select>
            
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-sm border border-gray-300 rounded px-3 py-1"
            >
              <option value="">Todas as Categorias</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select 
              value={selectedMaterial} 
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="text-sm border border-gray-300 rounded px-3 py-1"
            >
              <option value="">Todos os Materiais</option>
              {materials.map(material => (
                <option key={material} value={material}>{material}</option>
              ))}
            </select>
            
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2">
            {selectedSupplier && (
              <Badge variant="secondary" className="bg-black text-white">
                {selectedSupplier}
                <button 
                  className="ml-2 text-xs"
                  onClick={() => setSelectedSupplier('')}
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedCategory && (
              <Badge variant="secondary" className="bg-black text-white">
                {selectedCategory}
                <button 
                  className="ml-2 text-xs"
                  onClick={() => setSelectedCategory('')}
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedMaterial && (
              <Badge variant="secondary" className="bg-black text-white">
                {selectedMaterial}
                <button 
                  className="ml-2 text-xs"
                  onClick={() => setSelectedMaterial('')}
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Results Counter */}
      <div className="container mx-auto px-4 py-4">
        <p className="text-gray-600">
          {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          {searchTerm && ` para "${searchTerm}"`}
        </p>
      </div>

      {/* Products Grid */}
      <main className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              supplier={product.supplier}
              material={product.material}
              size={product.size}
              image={product.image}
              onAddToCart={addToCart}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum produto encontrado com os filtros aplicados.</p>
            <Button className="mt-4" onClick={clearFilters}>
              Ver todos os produtos
            </Button>
          </div>
        )}
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
