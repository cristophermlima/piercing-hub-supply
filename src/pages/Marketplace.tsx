
import React, { useState } from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import FilterBar from '@/components/FilterBar';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');

  const { data: products = [], isLoading } = useProducts();
  const { items: cartItems = [] } = useCart();

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSupplier = !selectedSupplier || product.suppliers?.company_name === selectedSupplier;
    const matchesCategory = !selectedCategory || product.categories?.name === selectedCategory;
    const matchesMaterial = !selectedMaterial || product.material === selectedMaterial;

    return matchesSearch && matchesSupplier && matchesCategory && matchesMaterial;
  });

  // Get unique values for filters
  const suppliers = [...new Set(products.map(p => p.suppliers?.company_name).filter(Boolean))];
  const categories = [...new Set(products.map(p => p.categories?.name).filter(Boolean))];
  const materials = [...new Set(products.map(p => p.material).filter(Boolean))];

  const clearFilters = () => {
    setSelectedSupplier('');
    setSelectedCategory('');
    setSelectedMaterial('');
  };

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          cartItems={totalCartItems}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Carregando produtos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        cartItems={totalCartItems}
      />

      <FilterBar
        suppliers={suppliers}
        categories={categories}
        materials={materials}
        selectedSupplier={selectedSupplier}
        selectedCategory={selectedCategory}
        selectedMaterial={selectedMaterial}
        onSupplierChange={setSelectedSupplier}
        onCategoryChange={setSelectedCategory}
        onMaterialChange={setSelectedMaterial}
        onClearFilters={clearFilters}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Marketplace ({filteredProducts.length} produtos)
          </h1>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum produto encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description || ''}
                price={product.price}
                supplier={product.suppliers?.company_name || 'Fornecedor não encontrado'}
                category={product.categories?.name || 'Categoria não encontrada'}
                brand={product.brand || ''}
                size={product.size}
                stock={product.stock_quantity}
                availability={product.availability}
                image={product.image_urls?.[0] || '/placeholder.svg'}
                sku={product.sku || ''}
                technicalDescription={product.technical_description}
                material={product.material}
                color={product.color}
                region={product.region}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
