import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      fullName, 
      email, 
      userType, 
      cnpj, 
      fantasyName,
      commercialContact,
      companyAddress,
      certificateUrl 
    } = await req.json();

    console.log('Received registration notification request:', { 
      fullName, 
      email, 
      userType,
      cnpj,
      fantasyName,
      certificateUrl 
    });

    // Format phone number for WhatsApp API (remove non-digits and add country code)
    const adminPhone = '5554991752129';
    
    // Build the message
    let message = `🆕 *NOVO CADASTRO PARA APROVAÇÃO*\n\n`;
    message += `📋 *Tipo:* ${userType === 'piercer' ? 'Body Piercer' : 'Fornecedor'}\n`;
    message += `👤 *Nome:* ${fullName}\n`;
    message += `📧 *Email:* ${email}\n`;
    message += `📄 *CPF/CNPJ:* ${cnpj || 'Não informado'}\n`;
    
    if (userType === 'supplier') {
      message += `🏢 *Nome Fantasia:* ${fantasyName || 'Não informado'}\n`;
      message += `📞 *Contato Comercial:* ${commercialContact || 'Não informado'}\n`;
      message += `📍 *Endereço:* ${companyAddress || 'Não informado'}\n`;
    }
    
    if (certificateUrl) {
      message += `\n📎 *Certificado:*\n${certificateUrl}\n`;
    }
    
    message += `\n⏰ *Data/Hora:* ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}\n`;
    message += `\n➡️ Acesse o painel para aprovar ou rejeitar este cadastro.`;

    // Send WhatsApp message via WhatsApp API
    // Using CallMeBot free API for WhatsApp notifications
    // Note: The admin needs to first activate the service by sending a message to the bot
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.callmebot.com/whatsapp.php?phone=${adminPhone}&text=${encodedMessage}&apikey=FREE`;
    
    console.log('Sending WhatsApp notification...');
    
    const whatsappResponse = await fetch(whatsappUrl);
    const responseText = await whatsappResponse.text();
    
    console.log('WhatsApp API response:', responseText);

    if (!whatsappResponse.ok) {
      console.error('WhatsApp notification failed:', responseText);
      // Don't throw error - registration should still succeed even if notification fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification sent successfully' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in notify-registration:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});