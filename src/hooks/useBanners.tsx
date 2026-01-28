import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PromotionalBanner {
  id: string;
  supplier_id: string | null;
  title: string;
  description: string | null;
  image_url: string;
  link_url: string | null;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  display_order: number;
  created_at: string;
}

export const useActiveBanners = () => {
  return useQuery({
    queryKey: ['active-banners'],
    queryFn: async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('promotional_banners')
        .select('*')
        .eq('is_active', true)
        .or(`end_date.is.null,end_date.gt.${now}`)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as PromotionalBanner[];
    },
  });
};

export const useSupplierBanners = (supplierId: string) => {
  return useQuery({
    queryKey: ['supplier-banners', supplierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promotional_banners')
        .select('*')
        .eq('supplier_id', supplierId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PromotionalBanner[];
    },
    enabled: !!supplierId,
  });
};

export const useCreateBanner = () => {
  type CreateBannerInput = {
    supplier_id: string;
    title: string;
    description?: string | null;
    image_url: string;
    link_url?: string | null;
    is_active?: boolean;
    display_order?: number;
  };
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (banner: CreateBannerInput) => {
      const { data, error } = await supabase
        .from('promotional_banners')
        .insert({
          supplier_id: banner.supplier_id,
          title: banner.title,
          description: banner.description || null,
          image_url: banner.image_url,
          link_url: banner.link_url || null,
          is_active: banner.is_active ?? true,
          display_order: banner.display_order ?? 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-banners'] });
      queryClient.invalidateQueries({ queryKey: ['active-banners'] });
      toast.success('Banner criado!');
    },
    onError: () => {
      toast.error('Erro ao criar banner');
    },
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PromotionalBanner> & { id: string }) => {
      const { data, error } = await supabase
        .from('promotional_banners')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-banners'] });
      queryClient.invalidateQueries({ queryKey: ['active-banners'] });
      toast.success('Banner atualizado!');
    },
    onError: () => {
      toast.error('Erro ao atualizar banner');
    },
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('promotional_banners')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-banners'] });
      queryClient.invalidateQueries({ queryKey: ['active-banners'] });
      toast.success('Banner removido!');
    },
    onError: () => {
      toast.error('Erro ao remover banner');
    },
  });
};
