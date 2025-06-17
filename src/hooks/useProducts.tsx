
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

const ensureSupplierExists = async (user: any) => {
  console.log('Verificando se supplier existe para usuário:', user.id);
  
  // Primeiro tentar buscar o supplier existente
  let { data: supplier, error: supplierError } = await supabase
    .from('suppliers')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (supplierError && supplierError.code !== 'PGRST116') {
    console.error('Erro ao buscar supplier:', supplierError);
    throw new Error('Erro ao verificar fornecedor');
  }

  // Se não existe supplier, criar um novo
  if (!supplier) {
    console.log('Supplier não encontrado, criando novo...');
    
    // Primeiro verificar se o perfil existe na tabela profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Erro ao verificar perfil:', profileError);
    }

    // Se não existe perfil, criar um
    if (!profile) {
      console.log('Criando perfil antes do supplier...');
      const { error: createProfileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || 'Usuário',
          user_type: user.user_metadata?.user_type || 'supplier',
          cnpj: user.user_metadata?.cnpj || '',
          fantasy_name: user.user_metadata?.fantasy_name || '',
          commercial_contact: user.user_metadata?.commercial_contact || '',
          company_address: user.user_metadata?.company_address || ''
        });

      if (createProfileError) {
        console.error('Erro ao criar perfil:', createProfileError);
        throw new Error('Erro ao criar perfil do usuário');
      }
    }

    // Agora criar o supplier
    const { data: newSupplier, error: createError } = await supabase
      .from('suppliers')
      .insert({
        user_id: user.id,
        company_name: user.user_metadata?.fantasy_name || user.user_metadata?.full_name || 'Fornecedor'
      })
      .select('id')
      .single();

    if (createError) {
      console.error('Erro ao criar supplier:', createError);
      throw new Error('Erro ao criar fornecedor');
    }

    supplier = newSupplier;
    console.log('Supplier criado com sucesso:', supplier.id);
  } else {
    console.log('Supplier encontrado:', supplier.id);
  }

  return supplier;
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (productData: Omit<Product, 'id' | 'suppliers' | 'categories'>) => {
      if (!user) throw new Error('Usuário não autenticado');

      console.log('Tentando adicionar produto para usuário:', user.id);

      // Garantir que o supplier existe
      const supplier = await ensureSupplierExists(user);

      console.log('Inserindo produto com supplier_id:', supplier.id);

      const { data, error } = await supabase
        .from('products')
        .insert({
          ...productData,
          supplier_id: supplier.id
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao inserir produto:', error);
        throw error;
      }
      
      console.log('Produto inserido com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      // Invalidar todas as queries relacionadas a produtos
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['supplier-products'] });
      
      // Forçar um refetch imediato
      queryClient.refetchQueries({ queryKey: ['supplier-products'] });
      
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

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (productData: Partial<Product> & { id: string }) => {
      const { id, ...updateData } = productData;
      
      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['supplier-products'] });
      toast({
        title: "Produto atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: "Erro ao atualizar produto",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      return productId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['supplier-products'] });
      toast({
        title: "Produto excluído!",
        description: "O produto foi removido do catálogo.",
      });
    },
    onError: (error) => {
      console.error('Erro ao excluir produto:', error);
      toast({
        title: "Erro ao excluir produto",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

export const useToggleProductStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ productId, isActive }: { productId: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from('products')
        .update({ is_active: isActive })
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['supplier-products'] });
      toast({
        title: data.is_active ? "Produto ativado!" : "Produto desativado!",
        description: data.is_active ? "O produto está visível no marketplace." : "O produto foi ocultado do marketplace.",
      });
    },
    onError: (error) => {
      console.error('Erro ao alterar status do produto:', error);
      toast({
        title: "Erro ao alterar status",
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
      if (!user) {
        console.log('Nenhum usuário autenticado para buscar produtos');
        return [];
      }

      console.log('Buscando produtos para usuário:', user.id);

      try {
        // Garantir que o supplier existe
        const supplier = await ensureSupplierExists(user);

        console.log('Buscando produtos do supplier:', supplier.id);

        // Buscar produtos do supplier
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            categories(name, slug)
          `)
          .eq('supplier_id', supplier.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao buscar produtos do supplier:', error);
          throw error;
        }

        console.log('Produtos encontrados:', data?.length || 0);
        return data as Product[];
      } catch (error) {
        console.error('Erro geral ao buscar produtos do supplier:', error);
        return [];
      }
    },
    enabled: !!user,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 0
  });
};
