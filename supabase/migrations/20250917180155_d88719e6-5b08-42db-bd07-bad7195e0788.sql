-- Ensure categories exist and return their IDs
-- Insert 'Joias de Titânio' if not exists
INSERT INTO public.categories (name, slug, description)
SELECT 'Joias de Titânio', 'joias-titanio', 'Joias e piercings em titânio grau cirúrgico'
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories WHERE slug = 'joias-titanio'
);

-- Insert 'Joias de Ouro' if not exists
INSERT INTO public.categories (name, slug, description)
SELECT 'Joias de Ouro', 'joias-ouro', 'Joias e piercings em ouro 14k e 18k'
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories WHERE slug = 'joias-ouro'
);

-- Return the IDs for further use in the app
SELECT id, name, slug FROM public.categories WHERE slug IN ('joias-titanio', 'joias-ouro') ORDER BY name;