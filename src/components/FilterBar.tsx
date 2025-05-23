
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FilterBarProps {
  suppliers: string[];
  categories: string[];
  materials: string[];
  selectedSupplier: string;
  selectedCategory: string;
  selectedMaterial: string;
  onSupplierChange: (supplier: string) => void;
  onCategoryChange: (category: string) => void;
  onMaterialChange: (material: string) => void;
  onClearFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  suppliers,
  categories,
  materials,
  selectedSupplier,
  selectedCategory,
  selectedMaterial,
  onSupplierChange,
  onCategoryChange,
  onMaterialChange,
  onClearFilters
}) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <h3 className="text-sm font-medium text-gray-700 mr-4">Filtros:</h3>
          
          <select 
            value={selectedSupplier} 
            onChange={(e) => onSupplierChange(e.target.value)}
            className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Todos os Fornecedores</option>
            {suppliers.map(supplier => (
              <option key={supplier} value={supplier}>{supplier}</option>
            ))}
          </select>
          
          <select 
            value={selectedCategory} 
            onChange={(e) => onCategoryChange(e.target.value)}
            className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Todas as Categorias</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select 
            value={selectedMaterial} 
            onChange={(e) => onMaterialChange(e.target.value)}
            className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Todos os Materiais</option>
            {materials.map(material => (
              <option key={material} value={material}>{material}</option>
            ))}
          </select>
          
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Limpar Filtros
          </Button>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2">
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
          {selectedCategory && (
            <Badge variant="secondary" className="bg-black text-white">
              {selectedCategory}
              <button 
                className="ml-2 text-xs hover:bg-gray-700 rounded px-1"
                onClick={() => onCategoryChange('')}
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
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
