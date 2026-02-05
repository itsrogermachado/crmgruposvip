 import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
 import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
 import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
 };
 
 const EBOOK_CONTENT = {
   title: "5 Estratégias para Aumentar a Retenção no Seu Grupo VIP",
   subtitle: "Guia Prático - Por CRM Grupos VIP",
   intro: `A alta rotatividade é o maior desafio de quem gerencia grupos VIP. 
 Membros entram empolgados, mas muitos não renovam. O resultado? 
 Receita instável e muito trabalho para repor quem saiu.
 
 Neste guia, você vai descobrir 5 estratégias testadas e comprovadas 
 para aumentar a retenção do seu grupo e criar uma base de membros fiéis.`,
   strategies: [
     {
       title: "1. Onboarding Memorável",
       content: `A primeira impressão define tudo. Um membro que se sente 
 bem-vindo desde o início tem 3x mais chances de renovar.
 
 O que fazer:
 • Envie uma mensagem de boas-vindas personalizada com o nome
 • Crie um "Guia do Novo Membro" com as regras e benefícios
 • Apresente o novo membro ao grupo (com permissão)
 • Entregue um "presente de entrada" exclusivo
 
 Dica: Automatize esse processo para não esquecer nenhum membro.`
     },
     {
       title: "2. Lembretes Inteligentes de Renovação",
       content: `Muitos membros não renovam simplesmente porque esquecem. 
 A solução? Lembretes estratégicos nos momentos certos.
 
 Cronograma ideal:
 • 7 dias antes: Lembrete amigável + benefícios do mês
 • 3 dias antes: Urgência leve + bônus para renovação antecipada
 • 1 dia antes: Último aviso + medo de perder acesso
 • No dia: Mensagem de "sentiremos sua falta" se não renovar
 
 Modelo de mensagem:
 "Oi [Nome]! Sua assinatura vence em 3 dias. 
 Renove agora e ganhe [bônus exclusivo]! 
 Link: [link de pagamento]"`
     },
     {
       title: "3. Calendário de Conteúdo Exclusivo",
       content: `Membros precisam sentir que estão recebendo valor constante.
 Crie expectativa com entregas programadas.
 
 Exemplo de calendário semanal:
 • Segunda: Dica rápida / Insight do mercado
 • Quarta: Conteúdo principal da semana
 • Sexta: Resumo + Prévia do próximo conteúdo
 
 Regra de ouro: Nunca deixe mais de 3 dias sem entregar valor.
 
 Bônus: Crie "eventos exclusivos" mensais (lives, Q&A, desafios).`
     },
     {
       title: "4. Preço Especial de Renovação",
       content: `Oferecer um desconto para quem renova antes do vencimento
 é uma das táticas mais eficazes para retenção.
 
 Estratégias que funcionam:
 • Desconto de 10-20% para renovação antecipada (até 5 dias antes)
 • Plano anual com economia significativa
 • Bônus exclusivo para "veteranos" (3+ renovações)
 
 Psicologia: O membro sente que está sendo recompensado 
 pela fidelidade, não pressionado a pagar.`
     },
     {
       title: "5. Pesquisa de Satisfação Preventiva",
       content: `Não espere o membro cancelar para descobrir o problema.
 Pergunte regularmente como está a experiência.
 
 Quando aplicar:
 • 7 dias após entrada (primeiras impressões)
 • Mensalmente (NPS rápido de 1 pergunta)
 • Antes do vencimento (chance de resolver problemas)
 
 Pergunta poderosa:
 "De 0 a 10, qual a chance de você recomendar nosso grupo 
 para um amigo? Por quê?"
 
 Membros que respondem 9-10 são promotores. 
 Abaixo de 7? Entre em contato pessoalmente.`
     }
   ],
   conclusion: `Implementar essas 5 estratégias pode parecer trabalhoso, 
 mas a boa notícia é que a maioria pode ser automatizada.
 
 Com o CRM Grupos VIP, você pode:
 - Configurar lembretes automáticos de renovação
 - Gerenciar todos os membros em um só lugar
 - Acompanhar quem vai vencer e quando
 - Enviar mensagens personalizadas via WhatsApp
 - Controlar pagamentos e receita do seu grupo
 
 Teste grátis por 7 dias e veja a diferença!`,
   cta: "Acesse: crmgruposvip.lovable.app"
 };
 
 async function generateEbookPDF(): Promise<Uint8Array> {
   const pdfDoc = await PDFDocument.create();
   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
   const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
   
   const pageWidth = 595;
   const pageHeight = 842;
   const margin = 50;
   const lineHeight = 18;
   const primaryColor = rgb(0.2, 0.4, 0.8);
   const textColor = rgb(0.2, 0.2, 0.2);
   
   // Helper function to add text with word wrap
   const addWrappedText = (
     page: any, 
     text: string, 
     x: number, 
     startY: number, 
     maxWidth: number, 
     fontSize: number,
     usedFont: any,
     color: any = textColor
   ): number => {
     const words = text.split(' ');
     let line = '';
     let y = startY;
     
     for (const word of words) {
       const testLine = line + word + ' ';
       const testWidth = usedFont.widthOfTextAtSize(testLine, fontSize);
       
       if (testWidth > maxWidth && line !== '') {
         page.drawText(line.trim(), { x, y, size: fontSize, font: usedFont, color });
         line = word + ' ';
         y -= lineHeight;
       } else {
         line = testLine;
       }
     }
     
     if (line.trim()) {
       page.drawText(line.trim(), { x, y, size: fontSize, font: usedFont, color });
       y -= lineHeight;
     }
     
     return y;
   };
 
   // Cover Page
   let page = pdfDoc.addPage([pageWidth, pageHeight]);
   page.drawRectangle({
     x: 0,
     y: pageHeight - 200,
     width: pageWidth,
     height: 200,
     color: primaryColor,
   });
   
   page.drawText("GUIA GRATUITO", {
     x: margin,
     y: pageHeight - 80,
     size: 14,
     font: font,
     color: rgb(1, 1, 1),
   });
   
   page.drawText("5 Estratégias para", {
     x: margin,
     y: pageHeight - 120,
     size: 28,
     font: fontBold,
     color: rgb(1, 1, 1),
   });
   
   page.drawText("Aumentar a Retenção", {
     x: margin,
     y: pageHeight - 155,
     size: 28,
     font: fontBold,
     color: rgb(1, 1, 1),
   });
   
   page.drawText("no Seu Grupo VIP", {
     x: margin,
     y: pageHeight - 190,
     size: 28,
     font: fontBold,
     color: rgb(1, 1, 1),
   });
 
   page.drawText("Por CRM Grupos VIP", {
     x: margin,
     y: pageHeight - 250,
     size: 16,
     font: font,
     color: primaryColor,
   });
 
   // Intro text on cover
   let yPos = pageHeight - 320;
   const introLines = EBOOK_CONTENT.intro.split('\n');
   for (const line of introLines) {
     if (line.trim()) {
       yPos = addWrappedText(page, line.trim(), margin, yPos, pageWidth - margin * 2, 12, font);
     }
     yPos -= 8;
   }
 
   // Strategy Pages
   for (const strategy of EBOOK_CONTENT.strategies) {
     page = pdfDoc.addPage([pageWidth, pageHeight]);
     
     // Header bar
     page.drawRectangle({
       x: 0,
       y: pageHeight - 60,
       width: pageWidth,
       height: 60,
       color: primaryColor,
     });
     
     page.drawText(strategy.title, {
       x: margin,
       y: pageHeight - 40,
       size: 18,
       font: fontBold,
       color: rgb(1, 1, 1),
     });
     
     yPos = pageHeight - 100;
     const contentLines = strategy.content.split('\n');
     for (const line of contentLines) {
       if (line.trim()) {
         const isListItem = line.trim().startsWith('•');
         yPos = addWrappedText(
           page, 
           line.trim(), 
           isListItem ? margin + 10 : margin, 
           yPos, 
           pageWidth - margin * 2 - (isListItem ? 10 : 0), 
           12, 
           font
         );
       }
       yPos -= 6;
     }
   }
 
   // Conclusion Page
   page = pdfDoc.addPage([pageWidth, pageHeight]);
   
   page.drawRectangle({
     x: 0,
     y: pageHeight - 60,
     width: pageWidth,
     height: 60,
     color: primaryColor,
   });
   
   page.drawText("Conclusão: Automatize e Escale", {
     x: margin,
     y: pageHeight - 40,
     size: 18,
     font: fontBold,
     color: rgb(1, 1, 1),
   });
   
   yPos = pageHeight - 100;
   const conclusionLines = EBOOK_CONTENT.conclusion.split('\n');
   for (const line of conclusionLines) {
     if (line.trim()) {
      const isCheckItem = line.trim().startsWith('-') && !line.trim().startsWith('--');
       yPos = addWrappedText(
         page, 
         line.trim(), 
         isCheckItem ? margin + 10 : margin, 
         yPos, 
         pageWidth - margin * 2, 
         12, 
         isCheckItem ? fontBold : font,
         isCheckItem ? primaryColor : textColor
       );
     }
     yPos -= 6;
   }
   
   // CTA Box
   page.drawRectangle({
     x: margin,
     y: yPos - 80,
     width: pageWidth - margin * 2,
     height: 60,
     color: rgb(0.95, 0.95, 1),
     borderColor: primaryColor,
     borderWidth: 2,
   });
   
   page.drawText("Teste grátis por 7 dias!", {
     x: margin + 20,
     y: yPos - 45,
     size: 16,
     font: fontBold,
     color: primaryColor,
   });
   
   page.drawText(EBOOK_CONTENT.cta, {
     x: margin + 20,
     y: yPos - 65,
     size: 12,
     font: font,
     color: textColor,
   });
 
   return await pdfDoc.save();
 }
 
 serve(async (req: Request) => {
   if (req.method === "OPTIONS") {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
     const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
     const supabase = createClient(supabaseUrl, supabaseKey);
 
     // Generate PDF
     const pdfBytes = await generateEbookPDF();
     
     // Upload to storage
     const fileName = "ebook-retencao-grupos-vip.pdf";
     const { data, error } = await supabase.storage
       .from("comprovantes")
       .upload(`ebooks/${fileName}`, pdfBytes, {
         contentType: "application/pdf",
         upsert: true,
       });
 
     if (error) {
       throw new Error(`Upload failed: ${error.message}`);
     }
 
     // Get public URL
     const { data: urlData } = supabase.storage
       .from("comprovantes")
       .getPublicUrl(`ebooks/${fileName}`);
 
     return new Response(
       JSON.stringify({ 
         success: true, 
         url: urlData.publicUrl,
         message: "E-book generated and uploaded successfully" 
       }),
       { headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   } catch (error: any) {
     console.error("Error generating ebook:", error);
     return new Response(
       JSON.stringify({ error: error.message }),
       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   }
 });