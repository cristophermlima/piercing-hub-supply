
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/hooks/useProducts';

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  user_id: string;
  created_at: string;
  products: Product;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (productId: string, quantity?: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar itens do carrinho do banco de dados
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (
            id,
            name,
            description,
            price,
            image_urls,
            suppliers (
              company_name
            )
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao buscar carrinho:', error);
        throw error;
      }

      return data as CartItem[];
    },
    enabled: !!user
  });

  // Mutation para adicionar item ao carrinho
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
      if (!user) throw new Error('Usuário não autenticado');

      // Verificar se o item já existe no carrinho
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();

      if (existingItem) {
        // Se existe, atualizar quantidade
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Se não existe, criar novo item
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
      toast({
        title: "Produto adicionado!",
        description: "Item adicionado ao carrinho com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Erro ao adicionar ao carrinho:', error);
      toast({
        title: "Erro ao adicionar",
        description: "Não foi possível adicionar o item ao carrinho.",
        variant: "destructive"
      });
    }
  });

  // Mutation para atualizar quantidade
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (quantity <= 0) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', itemId)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
    },
    onError: (error) => {
      console.error('Erro ao atualizar quantidade:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a quantidade.",
        variant: "destructive"
      });
    }
  });

  // Mutation para remover item
  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
      toast({
        title: "Item removido",
        description: "Item removido do carrinho.",
      });
    },
    onError: (error) => {
      console.error('Erro ao remover item:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o item.",
        variant: "destructive"
      });
    }
  });

  // Mutation para limpar carrinho
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
      toast({
        title: "Carrinho limpo",
        description: "Todos os itens foram removidos do carrinho.",
      });
    }
  });

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.products.price * item.quantity), 0);

  const contextValue: CartContextType = {
    items,
    addToCart: (productId: string, quantity = 1) => 
      addToCartMutation.mutate({ productId, quantity }),
    updateQuantity: (itemId: string, quantity: number) => 
      updateQuantityMutation.mutate({ itemId, quantity }),
    removeFromCart: (itemId: string) => 
      removeFromCartMutation.mutate(itemId),
    clearCart: () => clearCartMutation.mutate(),
    totalItems,
    totalPrice,
    isLoading
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const useAddToCart = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  return {
    mutate: ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      addToCart(productId, quantity);
    },
    isPending: false // Simplificado para compatibilidade
  };
};
