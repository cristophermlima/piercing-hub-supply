
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

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
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          suppliers(company_name, user_id),
          categories(name, slug)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar produtos:', error);
        throw error;
      }
      
      return data as Product[];
    }
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (productData: Omit<Product, 'id' | 'suppliers' | 'categories'>) => {
      if (!user) throw new Error('Usuário não autenticado');

      // Buscar o supplier_id do usuário atual
      const { data: supplier, error: supplierError } = await supabase
        .from('suppliers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (supplierError || !supplier) {
        throw new Error('Usuário não é um fornecedor válido');
      }

      const { data, error } = await supabase
        .from('products')
        .insert({
          ...productData,
          supplier_id: supplier.id
        })
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
      console.error('Erro ao adicionar produto:', error);
      toast({
        title: "Erro ao adicionar produto",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

export const useSupplierProducts = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['supplier-products', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: supplier, error: supplierError } = await supabase
        .from('suppliers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (supplierError || !supplier) return [];

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name, slug)
        `)
        .eq('supplier_id', supplier.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
    enabled: !!user
  });
};
