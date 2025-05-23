
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import AdvancedFilters from '@/components/AdvancedFilters';
import { useToast } from '@/hooks/use-toast';
import { products, suppliers, categories, productTypes, brands, availabilities } from '@/data/products';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState(0);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProductType, setSelectedProductType] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const { toast } = useToast();

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (product.technicalDescription && product.technicalDescription.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSupplier = !selectedSupplier || product.supplier === selectedSupplier;
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesProductType = !selectedProductType || product.productType === selectedProductType;
      const matchesBrand = !selectedBrand || product.brand === selectedBrand;
      const matchesAvailability = !selectedAvailability || product.availability === selectedAvailability;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesSupplier && matchesCategory && matchesProductType && 
             matchesBrand && matchesAvailability && matchesPrice;
    });
  }, [searchTerm, selectedSupplier, selectedCategory, selectedProductType, selectedBrand, selectedAvailability, priceRange]);

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
    setSelectedProductType('');
    setSelectedBrand('');
    setSelectedAvailability('');
    setPriceRange([0, 5000]);
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

      <div className="container mx-auto px-4 py-8">
        {/* Advanced Filters */}
        <AdvancedFilters
          suppliers={suppliers}
          categories={categories}
          productTypes={productTypes}
          brands={brands}
          availabilities={availabilities}
          selectedSupplier={selectedSupplier}
          selectedCategory={selectedCategory}
          selectedProductType={selectedProductType}
          selectedBrand={selectedBrand}
          selectedAvailability={selectedAvailability}
          priceRange={priceRange}
          onSupplierChange={setSelectedSupplier}
          onCategoryChange={setSelectedCategory}
          onProductTypeChange={setSelectedProductType}
          onBrandChange={setSelectedBrand}
          onAvailabilityChange={setSelectedAvailability}
          onPriceRangeChange={setPriceRange}
          onClearFilters={clearFilters}
        />

        {/* Results Counter */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            {searchTerm && ` para "${searchTerm}"`}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
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
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-2">PiercerHub Marketplace</h3>
          <p className="text-gray-400">Conectando profissionais do body piercing com fornecedores especializados</p>
          <p className="text-gray-400 text-sm mt-2">Insumos • Equipamentos • Materiais Estéreis</p>
        </div>
      </footer>
    </div>
  );
};

export default Marketplace;
