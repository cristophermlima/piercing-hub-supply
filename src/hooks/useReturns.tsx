import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface ReturnRequest {
  id: string;
  order_id: string;
  user_id: string;
  reason: string;
  description: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'refunded';
  refund_amount: number | null;
  images: string[];
  supplier_response: string | null;
  created_at: string;
  updated_at: string;
  orders?: {
    id: string;
    total_amount: number;
    created_at: string;
  };
}

export const RETURN_REASONS = [
  { value: 'defective', label: 'Produto com defeito' },
  { value: 'wrong_product', label: 'Produto errado enviado' },
  { value: 'damaged', label: 'Produto danificado na entrega' },
  { value: 'not_as_described', label: 'Produto diferente do anunciado' },
  { value: 'changed_mind', label: 'Desisti da compra' },
  { value: 'other', label: 'Outro motivo' },
];

export const RETURN_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendente', color: 'bg-yellow-500' },
  approved: { label: 'Aprovado', color: 'bg-green-500' },
  rejected: { label: 'Recusado', color: 'bg-red-500' },
  refunded: { label: 'Reembolsado', color: 'bg-blue-500' },
};

export const useReturnRequests = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['return-requests', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('return_requests')
        .select(`
          *,
          orders (
            id,
            total_amount,
            created_at
          )
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ReturnRequest[];
    },
    enabled: !!user,
  });
};

export const useCreateReturnRequest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      orderId,
      reason,
      description,
      images,
    }: {
      orderId: string;
      reason: string;
      description?: string;
      images?: string[];
    }) => {
      const { data, error } = await supabase
        .from('return_requests')
        .insert({
          order_id: orderId,
          user_id: user!.id,
          reason,
          description,
          images: images || [],
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['return-requests'] });
      toast.success('Solicitação de devolução criada!');
    },
    onError: () => {
      toast.error('Erro ao criar solicitação');
    },
  });
};

export const useUpdateReturnRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      supplierResponse,
      refundAmount,
    }: {
      id: string;
      status: string;
      supplierResponse?: string;
      refundAmount?: number;
    }) => {
      const { data, error } = await supabase
        .from('return_requests')
        .update({
          status,
          supplier_response: supplierResponse,
          refund_amount: refundAmount,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['return-requests'] });
      toast.success('Solicitação atualizada!');
    },
    onError: () => {
      toast.error('Erro ao atualizar solicitação');
    },
  });
};
