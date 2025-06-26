
-- Buscar as categorias existentes para pegar os IDs corretos
SELECT id, name, slug FROM public.categories 
WHERE slug IN ('joias-titanio', 'joias-ouro') 
OR name ILIKE '%titânio%' 
OR name ILIKE '%ouro%'
ORDER BY name;
