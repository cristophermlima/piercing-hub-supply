import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface RecentlyViewedProduct {
  id: string;
  user_id: string;
  product_id: string;
  viewed_at: string;
  products?: {
    id: string;
    name: string;
    price: number;
    image_urls: string[];
    suppliers?: {
      company_name: string;
    };
  };
}

export const useRecentlyViewed = (limit = 10) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['recently-viewed', user?.id, limit],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('recently_viewed')
        .select(`
          *,
          products (
            id,
            name,
            price,
            image_urls,
            suppliers (company_name)
          )
        `)
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as RecentlyViewedProduct[];
    },
    enabled: !!user,
  });
};

export const useTrackProductView = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!user) return null;

      // Upsert to update viewed_at if already exists
      const { data, error } = await supabase
        .from('recently_viewed')
        .upsert(
          {
            user_id: user.id,
            product_id: productId,
            viewed_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id,product_id',
          }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recently-viewed'] });
    },
  });
};
