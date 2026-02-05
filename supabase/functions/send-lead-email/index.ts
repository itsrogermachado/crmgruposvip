 import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
 import { Resend } from "https://esm.sh/resend@2.0.0";
 import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
 
 const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
 };
 
 interface LeadEmailRequest {
   email: string;
   ebookUrl?: string;
 }
 
 const getEmailHtml = (ebookUrl: string) => `
 <!DOCTYPE html>
 <html>
 <head>
   <meta charset="utf-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
 </head>
 <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
   <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
     <tr>
       <td align="center">
         <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
           
           <!-- Header -->
           <tr>
             <td style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center;">
               <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                 🎉 Seu Guia Chegou!
               </h1>
               <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
                 CRM Grupos VIP
               </p>
             </td>
           </tr>
           
           <!-- Content -->
           <tr>
             <td style="padding: 40px 30px;">
               <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 22px;">
                 Olá! Bem-vindo(a) à nossa comunidade! 👋
               </h2>
               
               <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                 Você solicitou nosso guia gratuito e aqui está ele! 
                 Preparamos um material especial com as <strong>5 melhores estratégias</strong> 
                 para aumentar a retenção no seu grupo VIP.
               </p>
               
               <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                 Este guia foi criado com base em nossa experiência ajudando 
                 centenas de gestores de grupos VIP a profissionalizar seus negócios.
               </p>
               
               <!-- Download Button -->
               <table width="100%" cellpadding="0" cellspacing="0">
                 <tr>
                   <td align="center" style="padding: 20px 0;">
                     <a href="${ebookUrl}" 
                        style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 18px; font-weight: bold; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);">
                       📥 Baixar E-book Grátis
                     </a>
                   </td>
                 </tr>
               </table>
               
               <!-- What's inside -->
               <div style="background-color: #f8fafc; border-radius: 8px; padding: 25px; margin: 30px 0;">
                 <h3 style="margin: 0 0 15px; color: #1f2937; font-size: 18px;">
                   📖 O que você vai aprender:
                 </h3>
                 <ul style="margin: 0; padding: 0 0 0 20px; color: #4b5563; font-size: 15px; line-height: 1.8;">
                   <li>Como criar um onboarding memorável</li>
                   <li>Lembretes inteligentes que aumentam renovações</li>
                   <li>Calendário de conteúdo que engaja</li>
                   <li>Estratégias de preço para fidelização</li>
                   <li>Pesquisas que previnem cancelamentos</li>
                 </ul>
               </div>
               
               <!-- CTA -->
               <div style="background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%); border-radius: 8px; padding: 25px; text-align: center;">
                 <h3 style="margin: 0 0 10px; color: #1e40af; font-size: 18px;">
                   🚀 Quer automatizar tudo isso?
                 </h3>
                 <p style="margin: 0 0 20px; color: #3730a3; font-size: 15px;">
                   Teste o CRM Grupos VIP gratuitamente por 7 dias!
                 </p>
                 <a href="https://crmgruposvip.lovable.app/auth" 
                    style="display: inline-block; background-color: #1d4ed8; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-size: 16px; font-weight: bold;">
                   Começar Grátis →
                 </a>
               </div>
             </td>
           </tr>
           
           <!-- Footer -->
           <tr>
             <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
               <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                 CRM Grupos VIP - Gerencie seu grupo com simplicidade
               </p>
               <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                 Você recebeu este email porque solicitou nosso guia gratuito.
               </p>
             </td>
           </tr>
           
         </table>
       </td>
     </tr>
   </table>
 </body>
 </html>
 `;
 
 serve(async (req: Request) => {
   if (req.method === "OPTIONS") {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     const { email, ebookUrl }: LeadEmailRequest = await req.json();
 
     if (!email) {
       throw new Error("Email is required");
     }
 
     // Validate email format
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!emailRegex.test(email)) {
       throw new Error("Invalid email format");
     }
 
     // Use provided URL or default
     const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
     const finalEbookUrl = ebookUrl || 
       `${supabaseUrl}/storage/v1/object/public/comprovantes/ebooks/ebook-retencao-grupos-vip.pdf`;
 
     const emailResponse = await resend.emails.send({
       from: "CRM Grupos VIP <onboarding@resend.dev>",
       to: [email],
       subject: "🎁 Seu Guia Gratuito: 5 Estratégias para Aumentar a Retenção",
       html: getEmailHtml(finalEbookUrl),
     });
 
     console.log("Email sent successfully:", emailResponse);
 
     return new Response(
       JSON.stringify({ success: true, data: emailResponse }),
       { headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   } catch (error: any) {
     console.error("Error sending email:", error);
     return new Response(
       JSON.stringify({ error: error.message }),
       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   }
 });