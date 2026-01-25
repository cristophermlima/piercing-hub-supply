import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TrackingEvent {
  id: string;
  order_id: string;
  status: string;
  description: string | null;
  location: string | null;
  created_at: string;
}

export const ORDER_STATUS_LABELS: Record<string, { label: string; description: string }> = {
  pending: { label: 'Pendente', description: 'Aguardando confirmação do fornecedor' },
  confirmed: { label: 'Confirmado', description: 'Pedido confirmado pelo fornecedor' },
  processing: { label: 'Em Preparação', description: 'Seu pedido está sendo preparado' },
  shipped: { label: 'Enviado', description: 'Pedido enviado para transportadora' },
  in_transit: { label: 'Em Trânsito', description: 'Pedido a caminho do destino' },
  out_for_delivery: { label: 'Saiu para Entrega', description: 'Pedido saiu para entrega' },
  delivered: { label: 'Entregue', description: 'Pedido entregue com sucesso!' },
  cancelled: { label: 'Cancelado', description: 'Pedido cancelado' },
  completed: { label: 'Concluído', description: 'Pedido finalizado' },
};

export const useOrderTracking = (orderId: string) => {
  return useQuery({
    queryKey: ['order-tracking', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_tracking')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as TrackingEvent[];
    },
    enabled: !!orderId,
  });
};

export const useAddTrackingEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      status,
      description,
      location,
    }: {
      orderId: string;
      status: string;
      description?: string;
      location?: string;
    }) => {
      const { data, error } = await supabase
        .from('order_tracking')
        .insert({
          order_id: orderId,
          status,
          description: description || ORDER_STATUS_LABELS[status]?.description || null,
          location: location || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order-tracking', variables.orderId] });
      toast.success('Rastreio atualizado!');
    },
    onError: () => {
      toast.error('Erro ao atualizar rastreio');
    },
  });
};
