-- Adicionar CEP aos fornecedores e custo de frete aos pedidos
ALTER TABLE suppliers 
ADD COLUMN IF NOT EXISTS zipcode TEXT;

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping_method TEXT,
ADD COLUMN IF NOT EXISTS shipping_deadline INTEGER;