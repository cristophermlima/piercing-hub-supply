import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  images: string[];
  created_at: string;
  updated_at: string;
  user_name?: string;
}

export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      // First get reviews
      const { data: reviews, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Then get profile names for each review
      const userIds = [...new Set(reviews.map(r => r.user_id))];
      
      if (userIds.length === 0) return [];

      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p.full_name]) || []);

      return reviews.map(review => ({
        ...review,
        user_name: profileMap.get(review.user_id) || 'Usuário',
      })) as Review[];
    },
    enabled: !!productId,
  });
};

export const useProductRating = (productId: string) => {
  return useQuery({
    queryKey: ['product-rating', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('rating')
        .eq('product_id', productId);

      if (error) throw error;
      
      if (!data || data.length === 0) {
        return { average: 0, count: 0 };
      }

      const total = data.reduce((acc, review) => acc + review.rating, 0);
      return {
        average: total / data.length,
        count: data.length,
      };
    },
    enabled: !!productId,
  });
};

export const useAddReview = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      productId,
      rating,
      comment,
      images = [],
    }: {
      productId: string;
      rating: number;
      comment?: string;
      images?: string[];
    }) => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('product_reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          rating,
          comment,
          images,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['product-rating', variables.productId] });
      toast.success('Avaliação enviada com sucesso!');
    },
    onError: (error: Error) => {
      if (error.message.includes('duplicate')) {
        toast.error('Você já avaliou este produto');
      } else {
        toast.error('Erro ao enviar avaliação');
      }
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reviewId,
      productId,
      rating,
      comment,
      images,
    }: {
      reviewId: string;
      productId: string;
      rating?: number;
      comment?: string;
      images?: string[];
    }) => {
      const updates: Record<string, unknown> = {};
      if (rating !== undefined) updates.rating = rating;
      if (comment !== undefined) updates.comment = comment;
      if (images !== undefined) updates.images = images;

      const { data, error } = await supabase
        .from('product_reviews')
        .update(updates)
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;
      return { ...data, productId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', data.productId] });
      queryClient.invalidateQueries({ queryKey: ['product-rating', data.productId] });
      toast.success('Avaliação atualizada!');
    },
    onError: () => {
      toast.error('Erro ao atualizar avaliação');
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reviewId, productId }: { reviewId: string; productId: string }) => {
      const { error } = await supabase
        .from('product_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
      return productId;
    },
    onSuccess: (productId) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['product-rating', productId] });
      toast.success('Avaliação removida!');
    },
    onError: () => {
      toast.error('Erro ao remover avaliação');
    },
  });
};
