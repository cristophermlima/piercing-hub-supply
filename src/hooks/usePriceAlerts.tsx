import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface PriceAlert {
  id: string;
  user_id: string;
  product_id: string;
  target_price: number;
  original_price: number;
  is_active: boolean;
  triggered_at: string | null;
  created_at: string;
  products?: {
    id: string;
    name: string;
    price: number;
    image_urls: string[];
  };
}

export const usePriceAlerts = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['price-alerts', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('price_alerts')
        .select(`
          *,
          products (
            id,
            name,
            price,
            image_urls
          )
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PriceAlert[];
    },
    enabled: !!user,
  });
};

export const useProductPriceAlert = (productId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['price-alert', productId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('price_alerts')
        .select('*')
        .eq('user_id', user!.id)
        .eq('product_id', productId)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data as PriceAlert | null;
    },
    enabled: !!user && !!productId,
  });
};

export const useCreatePriceAlert = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      productId,
      targetPrice,
      originalPrice,
    }: {
      productId: string;
      targetPrice: number;
      originalPrice: number;
    }) => {
      const { data, error } = await supabase
        .from('price_alerts')
        .insert({
          user_id: user!.id,
          product_id: productId,
          target_price: targetPrice,
          original_price: originalPrice,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['price-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['price-alert', variables.productId] });
      toast.success('Alerta de preço criado!');
    },
    onError: () => {
      toast.error('Erro ao criar alerta de preço');
    },
  });
};

export const useDeletePriceAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('price_alerts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['price-alert'] });
      toast.success('Alerta removido!');
    },
    onError: () => {
      toast.error('Erro ao remover alerta');
    },
  });
};
