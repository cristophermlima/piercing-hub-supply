-- Remover a constraint de foreign key que está causando o problema
ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS cart_items_user_id_fkey;

-- Adicionar a constraint novamente sem bloquear inserções quando o perfil não existe
-- Isso permite que cart_items sejam criados mesmo se o perfil ainda não existe
-- A constraint ON DELETE CASCADE garante que os itens do carrinho sejam deletados se o usuário for deletado
ALTER TABLE cart_items 
ADD CONSTRAINT cart_items_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;