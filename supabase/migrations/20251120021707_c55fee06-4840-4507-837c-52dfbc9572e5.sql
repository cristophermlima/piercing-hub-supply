-- Drop the problematic policy
DROP POLICY IF EXISTS "Suppliers can view orders containing their products" ON orders;

-- Create a security definer function to check if user is a supplier for an order
CREATE OR REPLACE FUNCTION public.is_supplier_for_order(_order_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM order_items oi
    JOIN suppliers s ON oi.supplier_id = s.id
    WHERE oi.order_id = _order_id
    AND s.user_id = auth.uid()
  )
$$;

-- Recreate the policy using the security definer function
CREATE POLICY "Suppliers can view orders containing their products"
ON orders
FOR SELECT
USING (public.is_supplier_for_order(id));