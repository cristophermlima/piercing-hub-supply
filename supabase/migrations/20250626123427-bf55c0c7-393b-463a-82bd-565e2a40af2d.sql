
-- Buscar todas as categorias existentes para obter seus IDs
SELECT id, name, slug FROM public.categories WHERE slug IN ('joias-titanio', 'joias-ouro') ORDER BY name;
