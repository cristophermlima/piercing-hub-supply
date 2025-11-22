import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destinationZipCode, items } = await req.json();
    
    console.log('📦 Calculando frete para:', { destinationZipCode, items });

    // CEP de origem (você pode configurar isso)
    const originZipCode = "95088320"; // Caxias do Sul - RS

    // Calcular peso e valor total dos items
    let totalWeight = 0;
    let totalValue = 0;
    
    items.forEach((item: any) => {
      // Peso estimado por item em gramas (jóias geralmente são leves)
      const itemWeight = 50; // 50g por produto
      totalWeight += itemWeight * item.quantity;
      totalValue += item.price * item.quantity;
    });

    // Converter para kg
    const weightInKg = totalWeight / 1000;

    const frenetToken = Deno.env.get('FRENET_TOKEN');
    if (!frenetToken) {
      throw new Error('FRENET_TOKEN não configurado');
    }

    // Chamada à API Frenet
    const frenetResponse = await fetch('https://api.frenet.com.br/shipping/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': frenetToken,
      },
      body: JSON.stringify({
        SellerCEP: originZipCode,
        RecipientCEP: destinationZipCode,
        ShipmentInvoiceValue: totalValue,
        ShippingItemArray: [{
          Weight: weightInKg,
          Length: 15, // cm
          Height: 5,  // cm
          Width: 10,  // cm
          Quantity: items.length,
        }],
      }),
    });

    if (!frenetResponse.ok) {
      const errorText = await frenetResponse.text();
      console.error('❌ Erro na API Frenet:', errorText);
      throw new Error(`Frenet API error: ${frenetResponse.status}`);
    }

    const frenetData = await frenetResponse.json();
    console.log('✅ Resposta Frenet:', frenetData);

    // Formatar resposta
    const shippingOptions = frenetData.ShippingSevicesArray?.map((service: any) => ({
      carrier: service.Carrier,
      serviceCode: service.ServiceCode,
      serviceDescription: service.ServiceDescription,
      price: service.ShippingPrice,
      deliveryTime: service.DeliveryTime,
      originalDeliveryTime: service.OriginalDeliveryTime,
    })) || [];

    return new Response(
      JSON.stringify({ 
        success: true,
        options: shippingOptions 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Erro ao calcular frete:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
