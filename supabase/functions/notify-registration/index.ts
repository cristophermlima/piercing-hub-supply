import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RegistrationData {
  fullName: string;
  email: string;
  userType: string;
  cnpj?: string;
  fantasyName?: string;
  commercialContact?: string;
  companyAddress?: string;
  certificateUrl?: string;
}

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
    }: RegistrationData = await req.json();

    console.log('Received registration notification request:', { 
      fullName, 
      email, 
      userType,
      cnpj,
      fantasyName,
      certificateUrl 
    });

    // Build the email HTML
    let htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
          🆕 Novo Cadastro para Aprovação
        </h1>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #4F46E5; margin-top: 0;">Informações do Cadastro</h2>
          
          <p><strong>📋 Tipo:</strong> ${userType === 'piercer' ? 'Body Piercer' : 'Fornecedor'}</p>
          <p><strong>👤 Nome:</strong> ${fullName}</p>
          <p><strong>📧 Email:</strong> ${email}</p>
          <p><strong>📄 CPF/CNPJ:</strong> ${cnpj || 'Não informado'}</p>
    `;
    
    if (userType === 'supplier') {
      htmlContent += `
          <p><strong>🏢 Nome Fantasia:</strong> ${fantasyName || 'Não informado'}</p>
          <p><strong>📞 Contato Comercial:</strong> ${commercialContact || 'Não informado'}</p>
          <p><strong>📍 Endereço:</strong> ${companyAddress || 'Não informado'}</p>
      `;
    }
    
    if (certificateUrl) {
      htmlContent += `
          <div style="margin-top: 20px; padding: 15px; background-color: #e8f4fd; border-radius: 8px;">
            <p><strong>📎 Certificado:</strong></p>
            <a href="${certificateUrl}" style="color: #4F46E5; word-break: break-all;" target="_blank">
              ${certificateUrl}
            </a>
          </div>
      `;
    }
    
    const brazilDate = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    
    htmlContent += `
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>⏰ Data/Hora:</strong> ${brazilDate}</p>
        </div>
        
        <div style="background-color: #4F46E5; color: white; padding: 15px; border-radius: 8px; text-align: center;">
          <p style="margin: 0;">➡️ Acesse o painel para aprovar ou rejeitar este cadastro.</p>
        </div>
      </div>
    `;

    console.log('Sending email notification via Resend...');
    
    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "PiercerHub <onboarding@resend.dev>",
      to: ["mattheuslima0251@gmail.com"], // Admin email
      subject: `🆕 Novo Cadastro: ${userType === 'piercer' ? 'Body Piercer' : 'Fornecedor'} - ${fullName}`,
      html: htmlContent,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email notification sent successfully',
        emailResponse 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: any) {
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
