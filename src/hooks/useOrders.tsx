import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
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

  // Criar pedidos a partir do carrinho (comentado até implementar RPC)
  const createOrdersMutation = useMutation({
    mutationFn: async (shippingAddress: any) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      // TODO: Implementar criação de pedidos
      throw new Error('Funcionalidade em desenvolvimento');
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
      if (!user) return [];

      // Primeiro buscar o supplier_id do usuário
      const { data: supplier } = await supabase
        .from('suppliers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!supplier) return [];

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
            created_at
          )
        `)
        .eq('supplier_id', supplier.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as any;
    },
    enabled: !!user,
  });

  // Atualizar status do pedido
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
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
