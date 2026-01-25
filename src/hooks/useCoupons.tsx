import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value: number;
  max_uses: number | null;
  uses_count: number;
  supplier_id: string | null;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
}

export const useValidateCoupon = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ code, orderTotal }: { code: string; orderTotal: number }) => {
      if (!user) throw new Error('Usuário não autenticado');

      // Fetch the coupon
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      if (!coupon) throw new Error('Cupom não encontrado');

      // Check validity
      const now = new Date();
      if (coupon.valid_from && new Date(coupon.valid_from) > now) {
        throw new Error('Cupom ainda não está válido');
      }
      if (coupon.valid_until && new Date(coupon.valid_until) < now) {
        throw new Error('Cupom expirado');
      }
      if (coupon.max_uses && coupon.uses_count >= coupon.max_uses) {
        throw new Error('Cupom atingiu o limite de uso');
      }
      if (orderTotal < coupon.min_order_value) {
        throw new Error(`Valor mínimo do pedido: R$ ${coupon.min_order_value.toFixed(2)}`);
      }

      // Check if user already used this coupon
      const { data: existingUse } = await supabase
        .from('coupon_uses')
        .select('id')
        .eq('coupon_id', coupon.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingUse) {
        throw new Error('Você já usou este cupom');
      }

      // Calculate discount
      let discount = 0;
      if (coupon.discount_type === 'percentage') {
        discount = (orderTotal * coupon.discount_value) / 100;
      } else {
        discount = Math.min(coupon.discount_value, orderTotal);
      }

      return {
        coupon: coupon as Coupon,
        discount,
      };
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useApplyCoupon = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      couponId,
      orderId,
      discountApplied,
    }: {
      couponId: string;
      orderId: string;
      discountApplied: number;
    }) => {
      if (!user) throw new Error('Usuário não autenticado');

      // Insert coupon use
      const { error: useError } = await supabase
        .from('coupon_uses')
        .insert({
          coupon_id: couponId,
          user_id: user.id,
          order_id: orderId,
          discount_applied: discountApplied,
        });

      if (useError) throw useError;

      // Increment uses_count manually
      const { data: currentCoupon } = await supabase
        .from('coupons')
        .select('uses_count')
        .eq('id', couponId)
        .single();

      if (currentCoupon) {
        await supabase
          .from('coupons')
          .update({ uses_count: (currentCoupon.uses_count || 0) + 1 })
          .eq('id', couponId);
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
};

// Hook for suppliers to manage their coupons
export const useSupplierCoupons = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['supplier-coupons', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // First get supplier ID
      const { data: supplier } = await supabase
        .from('suppliers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!supplier) return [];

      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('supplier_id', supplier.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Coupon[];
    },
    enabled: !!user,
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (couponData: {
      code: string;
      description?: string;
      discount_type: 'percentage' | 'fixed';
      discount_value: number;
      min_order_value?: number;
      max_uses?: number;
      valid_until?: string;
    }) => {
      if (!user) throw new Error('Usuário não autenticado');

      // Get supplier ID
      const { data: supplier } = await supabase
        .from('suppliers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!supplier) throw new Error('Fornecedor não encontrado');

      const { data, error } = await supabase
        .from('coupons')
        .insert({
          ...couponData,
          code: couponData.code.toUpperCase(),
          supplier_id: supplier.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-coupons'] });
      toast.success('Cupom criado com sucesso!');
    },
    onError: (error: Error) => {
      if (error.message.includes('duplicate')) {
        toast.error('Já existe um cupom com este código');
      } else {
        toast.error('Erro ao criar cupom');
      }
    },
  });
};

export const useToggleCouponStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ couponId, isActive }: { couponId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('coupons')
        .update({ is_active: !isActive })
        .eq('id', couponId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-coupons'] });
      toast.success('Status do cupom atualizado!');
    },
    onError: () => {
      toast.error('Erro ao atualizar cupom');
    },
  });
};
