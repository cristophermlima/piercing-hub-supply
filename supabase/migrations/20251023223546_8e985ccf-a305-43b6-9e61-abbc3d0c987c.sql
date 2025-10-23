-- Atualizar tabela de pedidos para suportar múltiplos fornecedores
-- Primeiro, adicionar colunas necessárias

ALTER TABLE orders ADD COLUMN IF NOT EXISTS supplier_id uuid REFERENCES suppliers(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes text;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_orders_supplier_id ON orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Atualizar políticas RLS para suppliers visualizarem seus pedidos
CREATE POLICY "Suppliers can view orders for their products"
ON orders FOR SELECT
USING (
  supplier_id IN (
    SELECT id FROM suppliers WHERE user_id = auth.uid()
  )
);

-- Suppliers podem atualizar status dos seus pedidos
CREATE POLICY "Suppliers can update their orders status"
ON orders FOR UPDATE
USING (
  supplier_id IN (
    SELECT id FROM suppliers WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  supplier_id IN (
    SELECT id FROM suppliers WHERE user_id = auth.uid()
  )
);

-- Atualizar order_items para permitir suppliers verem
CREATE POLICY "Suppliers can view their order items"
ON order_items FOR SELECT
USING (
  order_id IN (
    SELECT id FROM orders WHERE supplier_id IN (
      SELECT id FROM suppliers WHERE user_id = auth.uid()
    )
  )
);

-- Função para criar pedidos automaticamente separados por fornecedor
CREATE OR REPLACE FUNCTION create_orders_from_cart(
  p_user_id uuid,
  p_shipping_address jsonb
)
RETURNS TABLE(order_id uuid, supplier_id uuid) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_supplier_id uuid;
  v_order_id uuid;
  v_total numeric;
BEGIN
  -- Para cada fornecedor no carrinho, criar um pedido separado
  FOR v_supplier_id IN 
    SELECT DISTINCT p.supplier_id 
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = p_user_id
  LOOP
    -- Calcular total para este fornecedor
    SELECT COALESCE(SUM(p.price * ci.quantity), 0)
    INTO v_total
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = p_user_id AND p.supplier_id = v_supplier_id;
    
    -- Criar pedido para este fornecedor
    INSERT INTO orders (user_id, supplier_id, total_amount, shipping_address, status)
    VALUES (p_user_id, v_supplier_id, v_total, p_shipping_address, 'pending')
    RETURNING id INTO v_order_id;
    
    -- Adicionar itens do pedido
    INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
    SELECT 
      v_order_id,
      ci.product_id,
      ci.quantity,
      p.price,
      p.price * ci.quantity
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = p_user_id AND p.supplier_id = v_supplier_id;
    
    -- Retornar ID do pedido criado
    order_id := v_order_id;
    supplier_id := v_supplier_id;
    RETURN NEXT;
  END LOOP;
  
  -- Limpar carrinho após criar pedidos
  DELETE FROM cart_items WHERE user_id = p_user_id;
  
  RETURN;
END;
$$;