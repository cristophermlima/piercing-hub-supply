-- Adicionar campo de observações/notas nos order_items para o fornecedor
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS notes TEXT;

-- Adicionar campo de informações de contato do cliente no pedido
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email TEXT;