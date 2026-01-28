-- Tabela de endereços múltiplos
CREATE TABLE public.user_addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  label TEXT NOT NULL DEFAULT 'Casa',
  recipient_name TEXT NOT NULL,
  street TEXT NOT NULL,
  number TEXT NOT NULL,
  complement TEXT,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de alertas de preço
CREATE TABLE public.price_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  target_price NUMERIC NOT NULL,
  original_price NUMERIC NOT NULL,
  is_active BOOLEAN DEFAULT true,
  triggered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de solicitações de devolução
CREATE TABLE public.return_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  refund_amount NUMERIC,
  images TEXT[] DEFAULT '{}',
  supplier_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de banners promocionais
CREATE TABLE public.promotional_banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de configurações de alerta de estoque
CREATE TABLE public.stock_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  threshold INTEGER NOT NULL DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  last_notified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id)
);

-- Enable RLS
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotional_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_addresses
CREATE POLICY "Users can view their addresses" ON public.user_addresses
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add addresses" ON public.user_addresses
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their addresses" ON public.user_addresses
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their addresses" ON public.user_addresses
FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for price_alerts
CREATE POLICY "Users can view their price alerts" ON public.price_alerts
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create price alerts" ON public.price_alerts
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their price alerts" ON public.price_alerts
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their price alerts" ON public.price_alerts
FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for return_requests
CREATE POLICY "Users can view their return requests" ON public.return_requests
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create return requests" ON public.return_requests
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Suppliers can view return requests for their orders" ON public.return_requests
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders o
    WHERE o.id = return_requests.order_id
    AND is_supplier_for_order(o.id)
  )
);

CREATE POLICY "Suppliers can update return requests" ON public.return_requests
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM orders o
    WHERE o.id = return_requests.order_id
    AND is_supplier_for_order(o.id)
  )
);

-- RLS Policies for promotional_banners
CREATE POLICY "Anyone can view active banners" ON public.promotional_banners
FOR SELECT USING (is_active = true);

CREATE POLICY "Suppliers can manage their banners" ON public.promotional_banners
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM suppliers
    WHERE suppliers.id = promotional_banners.supplier_id
    AND suppliers.user_id = auth.uid()
  )
);

-- RLS Policies for stock_alerts
CREATE POLICY "Suppliers can view their stock alerts" ON public.stock_alerts
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM suppliers
    WHERE suppliers.id = stock_alerts.supplier_id
    AND suppliers.user_id = auth.uid()
  )
);

CREATE POLICY "Suppliers can manage their stock alerts" ON public.stock_alerts
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM suppliers
    WHERE suppliers.id = stock_alerts.supplier_id
    AND suppliers.user_id = auth.uid()
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_user_addresses_updated_at
BEFORE UPDATE ON public.user_addresses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_return_requests_updated_at
BEFORE UPDATE ON public.return_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();