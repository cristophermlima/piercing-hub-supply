import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  products: {
    name: string;
    image_urls: string[];
  };
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  shipping_address: any;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

export const useOrders = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Buscar pedidos do usuário (piercer)
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (
              name,
              image_urls
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as any as Order[];
    },
    enabled: !!user,
  });

  // Criar pedidos a partir do carrinho
  const createOrdersMutation = useMutation({
    mutationFn: async (shippingAddress: any) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { data, error } = await supabase.functions.invoke('create-orders-from-cart', {
        body: { shipping_address: shippingAddress },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Pedidos criados com sucesso!');
    },
    onError: (error: Error) => {
      console.error('Erro ao criar pedidos:', error);
      toast.error('Erro ao criar pedidos', {
        description: error.message,
      });
    },
  });

  return {
    orders,
    isLoading,
    createOrders: createOrdersMutation.mutate,
    isCreatingOrders: createOrdersMutation.isPending,
  };
};

// Hook para fornecedores visualizarem pedidos recebidos
export const useSupplierOrders = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['supplier-orders', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('🔴 [SUPPLIER ORDERS] Sem usuário');
        return [];
      }

      console.log('🔍 [SUPPLIER ORDERS] Buscando supplier para user_id:', user.id);

      // Primeiro buscar o supplier_id do usuário
      const { data: supplier, error: supplierError } = await supabase
        .from('suppliers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      console.log('📊 [SUPPLIER ORDERS] Supplier encontrado:', supplier, 'Error:', supplierError);

      if (!supplier) {
        console.log('🔴 [SUPPLIER ORDERS] Nenhum supplier encontrado para este usuário');
        return [];
      }

      console.log('🔍 [SUPPLIER ORDERS] Buscando pedidos para supplier_id:', supplier.id);

      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          products (
            name,
            image_urls,
            sku
          ),
          orders!inner (
            id,
            user_id,
            status,
            total_amount,
            shipping_address,
            customer_name,
            customer_phone,
            customer_email,
            created_at
          )
        `)
        .eq('supplier_id', supplier.id)
        .order('created_at', { ascending: false });

      console.log('📦 [SUPPLIER ORDERS] Pedidos encontrados:', data?.length || 0, 'Error:', error);

      if (error) {
        console.error('❌ [SUPPLIER ORDERS] Erro ao buscar pedidos:', error);
        throw error;
      }
      return data as any;
    },
    enabled: !!user,
  });

  // Atualizar status do pedido
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      console.log('🔄 Atualizando status:', { orderId, status });
      
      // Atualizar apenas nos order_items (fornecedor tem permissão)
      const { error: itemsError, data } = await supabase
        .from('order_items')
        .update({ status })
        .eq('order_id', orderId)
        .select();

      console.log('✅ Items atualizados:', data);
      if (itemsError) {
        console.error('❌ Erro ao atualizar items:', itemsError);
        throw itemsError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-orders'] });
      toast.success('Status atualizado com sucesso!');
    },
    onError: (error: Error) => {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    },
  });

  // Adicionar código de rastreamento
  const updateTrackingMutation = useMutation({
    mutationFn: async ({ orderId, trackingCode }: { orderId: string; trackingCode: string }) => {
      // Atualizar no order_items
      const { error } = await supabase
        .from('order_items')
        .update({ tracking_code: trackingCode })
        .eq('order_id', orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-orders'] });
      toast.success('Rastreamento atualizado!');
    },
    onError: (error: Error) => {
      console.error('Erro ao atualizar rastreamento:', error);
      toast.error('Erro ao atualizar rastreamento');
    },
  });

  return {
    orders,
    isLoading,
    updateStatus: updateStatusMutation.mutate,
    updateTracking: updateTrackingMutation.mutate,
    isUpdating: updateStatusMutation.isPending || updateTrackingMutation.isPending,
  };
};
