-- Remover foreign key constraint do user_id que está causando o erro
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;