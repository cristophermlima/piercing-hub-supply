import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface StockAlert {
  id: string;
  supplier_id: string;
  product_id: string;
  threshold: number;
  is_active: boolean;
  last_notified_at: string | null;
  created_at: string;
  products?: {
    id: string;
    name: string;
    stock_quantity: number;
    image_urls: string[];
  };
}

export const useStockAlerts = (supplierId: string) => {
  return useQuery({
    queryKey: ['stock-alerts', supplierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stock_alerts')
        .select(`
          *,
          products (
            id,
            name,
            stock_quantity,
            image_urls
          )
        `)
        .eq('supplier_id', supplierId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as StockAlert[];
    },
    enabled: !!supplierId,
  });
};

export const useLowStockProducts = (supplierId: string) => {
  return useQuery({
    queryKey: ['low-stock-products', supplierId],
    queryFn: async () => {
      // Get all stock alerts for this supplier
      const { data: alerts, error: alertsError } = await supabase
        .from('stock_alerts')
        .select(`
          *,
          products (
            id,
            name,
            stock_quantity,
            image_urls,
            sku
          )
        `)
        .eq('supplier_id', supplierId)
        .eq('is_active', true);

      if (alertsError) throw alertsError;

      // Filter products that are below threshold
      const lowStock = (alerts as StockAlert[]).filter(
        alert => alert.products && alert.products.stock_quantity <= alert.threshold
      );

      return lowStock;
    },
    enabled: !!supplierId,
  });
};

export const useCreateStockAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      supplierId,
      productId,
      threshold,
    }: {
      supplierId: string;
      productId: string;
      threshold: number;
    }) => {
      const { data, error } = await supabase
        .from('stock_alerts')
        .insert({
          supplier_id: supplierId,
          product_id: productId,
          threshold,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-alerts'] });
      toast.success('Alerta de estoque criado!');
    },
    onError: () => {
      toast.error('Erro ao criar alerta');
    },
  });
};

export const useUpdateStockAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      threshold,
      isActive,
    }: {
      id: string;
      threshold?: number;
      isActive?: boolean;
    }) => {
      const updates: { threshold?: number; is_active?: boolean } = {};
      if (threshold !== undefined) updates.threshold = threshold;
      if (isActive !== undefined) updates.is_active = isActive;

      const { data, error } = await supabase
        .from('stock_alerts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-alerts'] });
      toast.success('Alerta atualizado!');
    },
    onError: () => {
      toast.error('Erro ao atualizar alerta');
    },
  });
};

export const useDeleteStockAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('stock_alerts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-alerts'] });
      toast.success('Alerta removido!');
    },
    onError: () => {
      toast.error('Erro ao remover alerta');
    },
  });
};
