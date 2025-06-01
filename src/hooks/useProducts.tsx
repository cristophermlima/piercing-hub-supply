
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { mockProducts } from '@/data/mockProducts';

export interface Product {
  id: string;
  name: string;
  description: string;
  technical_description?: string;
  price: number;
  stock_quantity: number;
  sku: string;
  brand: string;
  material?: string;
  color?: string;
  size?: string;
  region?: string;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  image_urls: string[];
  supplier_id: string;
  category_id: string;
  is_active: boolean;
  suppliers?: {
    company_name: string;
    user_id: string;
  };
  categories?: {
    name: string;
    slug: string;
  };
}

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            suppliers(company_name, user_id),
            categories(name, slug)
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Se não há produtos no banco, retorna os produtos mock
        if (!data || data.length === 0) {
          console.log('Usando produtos fictícios para demonstração');
          return mockProducts.map(product => ({
            ...product,
            stock_quantity: product.stock,
            image_urls: [product.image],
            supplier_id: 'mock-supplier',
            category_id: 'mock-category',
            is_active: true,
            suppliers: { company_name: product.supplier, user_id: 'mock-user' },
            categories: { name: product.category, slug: product.category }
          }));
        }
        
        return data as Product[];
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        // Em caso de erro, retorna produtos mock
        return mockProducts.map(product => ({
          ...product,
          stock_quantity: product.stock,
          image_urls: [product.image],
          supplier_id: 'mock-supplier',
          category_id: 'mock-category',
          is_active: true,
          suppliers: { company_name: product.supplier, user_id: 'mock-user' },
          categories: { name: product.category, slug: product.category }
        }));
      }
    }
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (productData: Omit<Product, 'id' | 'suppliers' | 'categories'>) => {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Produto adicionado!",
        description: "Produto foi adicionado ao catálogo com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao adicionar produto",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};
