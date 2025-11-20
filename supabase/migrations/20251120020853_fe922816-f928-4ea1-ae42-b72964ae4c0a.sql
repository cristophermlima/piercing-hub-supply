-- Permitir que fornecedores vejam pedidos que contém seus produtos
CREATE POLICY "Suppliers can view orders containing their products"
ON orders
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM order_items oi
    JOIN suppliers s ON oi.supplier_id = s.id
    WHERE oi.order_id = orders.id
    AND s.user_id = auth.uid()
  )
);