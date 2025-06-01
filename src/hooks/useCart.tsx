
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import { mockProducts } from '@/data/mockProducts';

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  products: {
    id: string;
    name: string;
    price: number;
    sku: string;
    brand: string;
    image_urls: string[];
    availability: string;
    suppliers: {
      company_name: string;
    };
  };
}

// Sistema de carrinho local para produtos mock
const LOCAL_CART_KEY = 'piercer_hub_cart';

const getLocalCart = (userId: string): CartItem[] => {
  try {
    const stored = localStorage.getItem(`${LOCAL_CART_KEY}_${userId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const setLocalCart = (userId: string, items: CartItem[]) => {
  localStorage.setItem(`${LOCAL_CART_KEY}_${userId}`, JSON.stringify(items));
};

export const useCart = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['cart', user?.id],
    queryFn: async () => {
      if (!user) return [];

      try {
        // Tentar buscar do banco de dados primeiro
        const { data, error } = await supabase
          .from('cart_items')
          .select(`
            *,
            products(
              id,
              name,
              price,
              sku,
              brand,
              image_urls,
              availability,
              suppliers(company_name)
            )
          `)
          .eq('user_id', user.id);

        if (error && error.code !== '22P02') {
          throw error;
        }

        // Se há dados no banco, retorna eles
        if (data && data.length > 0) {
          return data as CartItem[];
        }

        // Caso contrário, usar carrinho local com produtos mock
        return getLocalCart(user.id);
      } catch (error) {
        console.log('Usando carrinho local para produtos demo');
        return getLocalCart(user.id);
      }
    },
    enabled: !!user
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
      if (!user) throw new Error('User not authenticated');

      // Verificar se é um produto mock
      const isMockProduct = productId.startsWith('mock-');
      
      if (isMockProduct) {
        // Gerenciar carrinho local para produtos mock
        const mockProduct = mockProducts.find(p => p.id === productId);
        if (!mockProduct) throw new Error('Produto não encontrado');

        const localCart = getLocalCart(user.id);
        const existingItemIndex = localCart.findIndex(item => item.product_id === productId);

        let updatedCart;
        if (existingItemIndex >= 0) {
          // Atualizar quantidade do item existente
          updatedCart = [...localCart];
          updatedCart[existingItemIndex].quantity += quantity;
        } else {
          // Adicionar novo item
          const newItem: CartItem = {
            id: `cart-${Date.now()}-${Math.random()}`,
            user_id: user.id,
            product_id: productId,
            quantity,
            products: {
              id: mockProduct.id,
              name: mockProduct.name,
              price: mockProduct.price,
              sku: mockProduct.sku,
              brand: mockProduct.brand,
              image_urls: [mockProduct.image],
              availability: mockProduct.availability,
              suppliers: {
                company_name: mockProduct.supplier
              }
            }
          };
          updatedCart = [...localCart, newItem];
        }

        setLocalCart(user.id, updatedCart);
        return updatedCart;
      } else {
        // Tentar adicionar ao banco para produtos reais
        const { data: existingItem } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .single();

        if (existingItem) {
          const { data, error } = await supabase
            .from('cart_items')
            .update({ quantity: existingItem.quantity + quantity })
            .eq('id', existingItem.id)
            .select()
            .single();

          if (error) throw error;
          return data;
        } else {
          const { data, error } = await supabase
            .from('cart_items')
            .insert({
              user_id: user.id,
              product_id: productId,
              quantity
            })
            .select()
            .single();

          if (error) throw error;
          return data;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        title: "Produto adicionado!",
        description: "Item adicionado ao carrinho com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Erro ao adicionar ao carrinho:', error);
      toast({
        title: "Erro ao adicionar ao carrinho",
        description: "Não foi possível adicionar o item ao carrinho.",
        variant: "destructive"
      });
    }
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      if (!user) return;

      // Verificar se é item local
      if (id.startsWith('cart-')) {
        const localCart = getLocalCart(user.id);
        
        if (quantity <= 0) {
          // Remover item
          const updatedCart = localCart.filter(item => item.id !== id);
          setLocalCart(user.id, updatedCart);
          return null;
        } else {
          // Atualizar quantidade
          const updatedCart = localCart.map(item =>
            item.id === id ? { ...item, quantity } : item
          );
          setLocalCart(user.id, updatedCart);
          return updatedCart.find(item => item.id === id);
        }
      } else {
        // Item do banco de dados
        if (quantity <= 0) {
          const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', id);

          if (error) throw error;
          return null;
        }

        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) return;

      // Verificar se é item local
      if (id.startsWith('cart-')) {
        const localCart = getLocalCart(user.id);
        const updatedCart = localCart.filter(item => item.id !== id);
        setLocalCart(user.id, updatedCart);
      } else {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', id);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        title: "Item removido",
        description: "Produto removido do carrinho",
      });
    }
  });
};
