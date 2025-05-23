
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface AdvancedFiltersProps {
  suppliers: string[];
  categories: string[];
  productTypes: string[];
  brands: string[];
  availabilities: string[];
  materials: string[];
  colors: string[];
  regions: string[];
  selectedSupplier: string;
  selectedCategory: string;
  selectedProductType: string;
  selectedBrand: string;
  selectedAvailability: string;
  selectedMaterial: string;
  selectedColor: string;
  selectedRegion: string;
  priceRange: [number, number];
  onSupplierChange: (supplier: string) => void;
  onCategoryChange: (category: string) => void;
  onProductTypeChange: (type: string) => void;
  onBrandChange: (brand: string) => void;
  onAvailabilityChange: (availability: string) => void;
  onMaterialChange: (material: string) => void;
  onColorChange: (color: string) => void;
  onRegionChange: (region: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

const categoryLabels: Record<string, string> = {
  'insumos-estereis': 'Insumos Estéreis',
  'equipamentos': 'Equipamentos',
  'joias-titanio': 'Joias de Titânio',
  'joias-ouro': 'Joias de Ouro'
};

const productTypeLabels: Record<string, string> = {
  'luvas': 'Luvas',
  'mascaras': 'Máscaras',
  'agulhas': 'Agulhas',
  'campos-cirurgicos': 'Campos Cirúrgicos',
  'antisepticos': 'Antissépticos',
  'autoclaves': 'Autoclaves',
  'cubas-ultrassonicas': 'Cubas Ultrassônicas',
  'macas': 'Macas',
  'seladoras': 'Seladoras',
  'swabs': 'Swabs',
  'argola': 'Argolas',
  'labret': 'Labretes',
  'barbell': 'Barbells',
  'esferas': 'Esferas',
  'plugs': 'Plugs',
  'tunnels': 'Tunnels'
};

const availabilityLabels: Record<string, string> = {
  'pronta-entrega': 'Pronta Entrega',
  'sob-encomenda': 'Sob Encomenda'
};

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  suppliers,
  categories,
  productTypes,
  brands,
  availabilities,
  materials,
  colors,
  regions,
  selectedSupplier,
  selectedCategory,
  selectedProductType,
  selectedBrand,
  selectedAvailability,
  selectedMaterial,
  selectedColor,
  selectedRegion,
  onSupplierChange,
  onCategoryChange,
  onProductTypeChange,
  onBrandChange,
  onAvailabilityChange,
  onMaterialChange,
  onColorChange,
  onRegionChange,
  onClearFilters
}) => {
  const hasActiveFilters = selectedSupplier || selectedCategory || selectedProductType || 
                          selectedBrand || selectedAvailability || selectedMaterial || 
                          selectedColor || selectedRegion;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filtros Avançados</CardTitle>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              <X className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="">Todas</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {categoryLabels[category] || category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Produto</label>
            <select 
              value={selectedProductType} 
              onChange={(e) => onProductTypeChange(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="">Todos</option>
              {productTypes.map(type => (
                <option key={type} value={type}>
                  {productTypeLabels[type] || type}
                </option>
              ))}
            </select>
          </div>

          {materials.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
              <select 
                value={selectedMaterial} 
                onChange={(e) => onMaterialChange(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">Todos</option>
                {materials.map(material => (
                  <option key={material} value={material}>{material}</option>
                ))}
              </select>
            </div>
          )}

          {colors.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cor</label>
              <select 
                value={selectedColor} 
                onChange={(e) => onColorChange(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">Todas</option>
                {colors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fornecedor</label>
            <select 
              value={selectedSupplier} 
              onChange={(e) => onSupplierChange(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="">Todos</option>
              {suppliers.map(supplier => (
                <option key={supplier} value={supplier}>{supplier}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
            <select 
              value={selectedBrand} 
              onChange={(e) => onBrandChange(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="">Todas</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          {regions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Região</label>
              <select 
                value={selectedRegion} 
                onChange={(e) => onRegionChange(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">Todas</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilidade</label>
            <select 
              value={selectedAvailability} 
              onChange={(e) => onAvailabilityChange(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="">Todas</option>
              {availabilities.map(availability => (
                <option key={availability} value={availability}>
                  {availabilityLabels[availability] || availability}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Filtros Ativos:</p>
            <div className="flex flex-wrap gap-2">
              {selectedCategory && (
                <Badge variant="secondary" className="bg-black text-white">
                  {categoryLabels[selectedCategory] || selectedCategory}
                  <button 
                    className="ml-2 text-xs hover:bg-gray-700 rounded px-1"
                    onClick={() => onCategoryChange('')}
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedProductType && (
                <Badge variant="secondary" className="bg-black text-white">
                  {productTypeLabels[selectedProductType] || selectedProductType}
                  <button 
                    className="ml-2 text-xs hover:bg-gray-700 rounded px-1"
                    onClick={() => onProductTypeChange('')}
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedMaterial && (
                <Badge variant="secondary" className="bg-black text-white">
                  {selectedMaterial}
                  <button 
                    className="ml-2 text-xs hover:bg-gray-700 rounded px-1"
                    onClick={() => onMaterialChange('')}
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedColor && (
                <Badge variant="secondary" className="bg-black text-white">
                  {selectedColor}
                  <button 
                    className="ml-2 text-xs hover:bg-gray-700 rounded px-1"
                    onClick={() => onColorChange('')}
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedSupplier && (
                <Badge variant="secondary" className="bg-black text-white">
                  {selectedSupplier}
                  <button 
                    className="ml-2 text-xs hover:bg-gray-700 rounded px-1"
                    onClick={() => onSupplierChange('')}
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedBrand && (
                <Badge variant="secondary" className="bg-black text-white">
                  {selectedBrand}
                  <button 
                    className="ml-2 text-xs hover:bg-gray-700 rounded px-1"
                    onClick={() => onBrandChange('')}
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedRegion && (
                <Badge variant="secondary" className="bg-black text-white">
                  {selectedRegion}
                  <button 
                    className="ml-2 text-xs hover:bg-gray-700 rounded px-1"
                    onClick={() => onRegionChange('')}
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedAvailability && (
                <Badge variant="secondary" className="bg-black text-white">
                  {availabilityLabels[selectedAvailability] || selectedAvailability}
                  <button 
                    className="ml-2 text-xs hover:bg-gray-700 rounded px-1"
                    onClick={() => onAvailabilityChange('')}
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedFilters;
