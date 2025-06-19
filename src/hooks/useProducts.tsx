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
  console.log('🔍 [SUPPLIER CHECK] Verificando se supplier existe para usuário:', user.id);
  
  // Primeiro tentar buscar o supplier existente
  let { data: supplier, error: supplierError } = await supabase
    .from('suppliers')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  console.log('📋 [SUPPLIER CHECK] Resultado da busca do supplier:', { supplier, supplierError });

  if (supplierError && supplierError.code !== 'PGRST116') {
    console.error('❌ [SUPPLIER CHECK] Erro ao buscar supplier:', supplierError);
    throw new Error('Erro ao verificar fornecedor');
  }

  // Se não existe supplier, criar um novo
  if (!supplier) {
    console.log('➕ [SUPPLIER CHECK] Supplier não encontrado, criando novo...');
    
    // Primeiro verificar se o perfil existe na tabela profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    console.log('👤 [SUPPLIER CHECK] Verificação do perfil:', { profile, profileError });

    if (profileError) {
      console.error('❌ [SUPPLIER CHECK] Erro ao verificar perfil:', profileError);
    }

    // Se não existe perfil, criar um
    if (!profile) {
      console.log('➕ [SUPPLIER CHECK] Criando perfil antes do supplier...');
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
        console.error('❌ [SUPPLIER CHECK] Erro ao criar perfil:', createProfileError);
        throw new Error('Erro ao criar perfil do usuário');
      }
      console.log('✅ [SUPPLIER CHECK] Perfil criado com sucesso');
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
      console.error('❌ [SUPPLIER CHECK] Erro ao criar supplier:', createError);
      throw new Error('Erro ao criar fornecedor');
    }

    supplier = newSupplier;
    console.log('✅ [SUPPLIER CHECK] Supplier criado com sucesso:', supplier.id);
  } else {
    console.log('✅ [SUPPLIER CHECK] Supplier encontrado:', supplier.id);
  }

  return supplier;
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (productData: Omit<Product, 'id' | 'suppliers' | 'categories'>) => {
      if (!user) {
        console.error('❌ [ADD PRODUCT] Usuário não autenticado');
        throw new Error('Usuário não autenticado');
      }

      console.log('🚀 [ADD PRODUCT] Iniciando processo para usuário:', user.id);
      console.log('📦 [ADD PRODUCT] Dados recebidos do produto:', JSON.stringify(productData, null, 2));

      // Validar dados obrigatórios
      if (!productData.name || !productData.price) {
        console.error('❌ [ADD PRODUCT] Dados obrigatórios faltando:', { name: productData.name, price: productData.price });
        throw new Error('Nome e preço são obrigatórios');
      }

      // Garantir que o supplier existe
      const supplier = await ensureSupplierExists(user);
      console.log('🏢 [ADD PRODUCT] Supplier verificado:', supplier.id);

      // Preparar dados para inserção
      const insertData = {
        name: productData.name,
        description: productData.description || '',
        technical_description: productData.technical_description || null,
        price: Number(productData.price),
        stock_quantity: Number(productData.stock_quantity) || 0,
        sku: productData.sku || '',
        brand: productData.brand || '',
        material: productData.material || null,
        color: productData.color || null,
        size: productData.size || null,
        region: productData.region || null,
        availability: productData.availability || 'in_stock',
        image_urls: productData.image_urls || [],
        supplier_id: supplier.id,
        category_id: productData.category_id,
        is_active: productData.is_active !== undefined ? productData.is_active : true
      };

      console.log('💾 [ADD PRODUCT] Dados preparados para inserção:', JSON.stringify(insertData, null, 2));

      // Inserir no banco de dados
      const { data, error } = await supabase
        .from('products')
        .insert(insertData)
        .select(`
          *,
          suppliers(company_name, user_id),
          categories(name, slug)
        `)
        .single();

      if (error) {
        console.error('❌ [ADD PRODUCT] Erro ao inserir produto no banco:', error);
        console.error('❌ [ADD PRODUCT] Detalhes do erro:', JSON.stringify(error, null, 2));
        throw new Error(`Erro ao salvar produto: ${error.message}`);
      }
      
      if (!data) {
        console.error('❌ [ADD PRODUCT] Nenhum dado retornado após inserção');
        throw new Error('Nenhum dado retornado após inserção');
      }

      console.log('✅ [ADD PRODUCT] Produto inserido com sucesso no banco:', JSON.stringify(data, null, 2));
      return data;
    },
    onSuccess: (data) => {
      console.log('🎉 [ADD PRODUCT] onSuccess - produto salvo:', data.name);
      
      // Invalidar todas as queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['supplier-products'] });
      queryClient.invalidateQueries({ queryKey: ['supplier-products', user?.id] });
      
      // Forçar refetch imediato
      setTimeout(() => {
        console.log('🔄 [ADD PRODUCT] Forçando refetch das queries...');
        queryClient.refetchQueries({ queryKey: ['supplier-products', user?.id] });
        queryClient.refetchQueries({ queryKey: ['products'] });
      }, 100);
      
      toast({
        title: "Produto adicionado!",
        description: `${data.name} foi adicionado ao catálogo com sucesso.`,
      });
    },
    onError: (error: any) => {
      console.error('❌ [ADD PRODUCT] Erro no onError:', error);
      toast({
        title: "Erro ao adicionar produto",
        description: error.message || 'Erro desconhecido ao adicionar produto',
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
        console.log('❌ [SUPPLIER PRODUCTS] Nenhum usuário autenticado');
        return [];
      }

      console.log('🔍 [SUPPLIER PRODUCTS] Iniciando busca de produtos para usuário:', user.id);

      try {
        // Garantir que o supplier existe
        const supplier = await ensureSupplierExists(user);
        console.log('🏢 [SUPPLIER PRODUCTS] Buscando produtos do supplier:', supplier.id);

        // Buscar produtos do supplier
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            categories(name, slug)
          `)
          .eq('supplier_id', supplier.id)
          .order('created_at', { ascending: false });

        console.log('📊 [SUPPLIER PRODUCTS] Resultado da query produtos:', { 
          data: data ? `${data.length} produtos encontrados` : 'null', 
          error: error ? error.message : 'nenhum erro' 
        });

        if (error) {
          console.error('❌ [SUPPLIER PRODUCTS] Erro ao buscar produtos:', error);
          throw error;
        }

        console.log(`✅ [SUPPLIER PRODUCTS] ${data?.length || 0} produtos encontrados`);
        
        if (data && data.length > 0) {
          console.log('📋 [SUPPLIER PRODUCTS] Produtos encontrados:');
          data.forEach((product, index) => {
            console.log(`   ${index + 1}. ${product.name} (ID: ${product.id}) - SKU: ${product.sku} - Ativo: ${product.is_active}`);
          });
        }
        
        return data as Product[];
      } catch (error) {
        console.error('💥 [SUPPLIER PRODUCTS] Erro geral:', error);
        return [];
      }
    },
    enabled: !!user,
    retry: 1,
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 0
  });
};
