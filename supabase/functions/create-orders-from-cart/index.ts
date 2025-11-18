import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateOrdersRequest {
  shipping_address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
    notes?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Não autenticado');
    }

    const { shipping_address }: CreateOrdersRequest = await req.json();

    console.log('Creating orders for user:', user.id);

    // Buscar items do carrinho
    const { data: cartItems, error: cartError } = await supabaseClient
      .from('cart_items')
      .select(`
        id,
        product_id,
        quantity,
        products (
          id,
          name,
          price,
          supplier_id
        )
      `)
      .eq('user_id', user.id);

    if (cartError) {
      console.error('Error fetching cart:', cartError);
      throw cartError;
    }

    if (!cartItems || cartItems.length === 0) {
      throw new Error('Carrinho vazio');
    }

    console.log('Cart items:', cartItems.length);

    // Agrupar items por fornecedor
    const itemsBySupplier: Record<string, any[]> = {};
    cartItems.forEach(item => {
      const supplierId = item.products.supplier_id;
      if (!itemsBySupplier[supplierId]) {
        itemsBySupplier[supplierId] = [];
      }
      itemsBySupplier[supplierId].push(item);
    });

    console.log('Suppliers:', Object.keys(itemsBySupplier).length);

    const createdOrders = [];

    // Criar um pedido para cada fornecedor
    for (const [supplierId, items] of Object.entries(itemsBySupplier)) {
      // Calcular total do pedido
      const total = items.reduce((sum, item) => {
        return sum + (item.products.price * item.quantity);
      }, 0);

      console.log(`Creating order for supplier ${supplierId}, total: ${total}`);

      // Criar o pedido
      const { data: order, error: orderError } = await supabaseClient
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: total,
          status: 'pending',
          shipping_address: JSON.stringify(shipping_address),
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        throw orderError;
      }

      console.log('Order created:', order.id);

      // Criar os order_items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.products.id,
        supplier_id: supplierId,
        quantity: item.quantity,
        price: item.products.price,
        status: 'pending',
      }));

      const { error: itemsError } = await supabaseClient
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        throw itemsError;
      }

      console.log('Order items created:', orderItems.length);

      createdOrders.push(order);
    }

    // Limpar o carrinho
    const { error: clearError } = await supabaseClient
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    if (clearError) {
      console.error('Error clearing cart:', clearError);
      throw clearError;
    }

    console.log('Cart cleared');

    return new Response(
      JSON.stringify({ 
        success: true, 
        orders: createdOrders,
        message: `${createdOrders.length} pedido(s) criado(s) com sucesso!`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in create-orders-from-cart:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro ao criar pedidos'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});