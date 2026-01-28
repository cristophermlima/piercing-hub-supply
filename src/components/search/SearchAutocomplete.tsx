import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useProducts } from '@/hooks/useProducts';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

interface Suggestion {
  id: string;
  name: string;
  category?: string;
  price: number;
  image?: string;
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  value,
  onChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const { data: products = [] } = useProducts();
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length >= 2) {
      const filtered = products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(value.toLowerCase()) ||
            p.description?.toLowerCase().includes(value.toLowerCase()) ||
            p.brand?.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 6)
        .map((p) => ({
          id: p.id,
          name: p.name,
          category: p.categories?.name,
          price: p.price,
          image: p.image_urls?.[0],
        }));
      setSuggestions(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [value, products]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (suggestion: Suggestion) => {
    onChange('');
    setIsOpen(false);
    navigate(`/product/${suggestion.id}`);
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Buscar produtos, marcas..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value.length >= 2 && suggestions.length > 0 && setIsOpen(true)}
          className="pl-10 pr-10 bg-white/10 border-gray-600 text-white placeholder:text-gray-400"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border z-50 overflow-hidden">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              onClick={() => handleSelect(suggestion)}
              className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer transition-colors"
            >
              {suggestion.image && (
                <img
                  src={suggestion.image}
                  alt={suggestion.name}
                  className="w-10 h-10 object-cover rounded"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {suggestion.name}
                </p>
                {suggestion.category && (
                  <p className="text-xs text-gray-500">{suggestion.category}</p>
                )}
              </div>
              <span className="text-sm font-semibold text-primary">
                R$ {suggestion.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
