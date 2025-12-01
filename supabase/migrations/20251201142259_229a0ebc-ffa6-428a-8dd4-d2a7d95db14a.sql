-- Atualizar constraint de status para incluir 'processing'
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_status_check;
ALTER TABLE order_items ADD CONSTRAINT order_items_status_check 
  CHECK (status = ANY (ARRAY['pending'::text, 'processing'::text, 'confirmed'::text, 'shipped'::text, 'delivered'::text, 'cancelled'::text]));

-- Adicionar campos de CPF/CNPJ e telefone no profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cpf_cnpj text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_number text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS certificate_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS certificate_approved boolean DEFAULT false;

-- Atualizar constraint de status na tabela orders também
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
  CHECK (status = ANY (ARRAY['pending'::text, 'processing'::text, 'confirmed'::text, 'shipped'::text, 'delivered'::text, 'cancelled'::text]));