import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Buscar clientes que vencem hoje e não foram notificados
    // Com a conversão para DATE, podemos comparar diretamente
    const today = new Date().toISOString().split('T')[0]
    
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('*')
      .eq('vencimento_notificado', false)
      .eq('data_vencimento', today)
      .eq('status', 'Ativo')

    if (clientsError) throw clientsError

    const results = []

    for (const client of clients) {
      // 2. Criar notificação no banco
      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: client.user_id,
          title: 'Cliente Vencendo!',
          message: `O cliente ${client.nome} vence hoje (${client.data_vencimento}).`,
          client_id: client.id
        })

      if (notifError) {
        console.error('Erro ao criar notificação:', notifError)
        continue
      }

      // 3. Marcar como notificado para não repetir amanhã
      await supabase
        .from('clients')
        .update({ vencimento_notificado: true })
        .eq('id', client.id)
      
      results.push({ clientId: client.id, notified: true })
    }

    return new Response(JSON.stringify({ success: true, processed: results.length, clients: results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
