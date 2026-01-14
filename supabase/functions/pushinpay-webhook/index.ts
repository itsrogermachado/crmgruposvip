import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const contentType = req.headers.get('content-type') || ''
    let body: Record<string, string>

    if (contentType.includes('application/json')) {
      body = await req.json()
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.text()
      body = Object.fromEntries(new URLSearchParams(formData))
    } else {
      // Tentar parsear - PushinPay pode enviar sem Content-Type correto
      const text = await req.text()
      try {
        body = JSON.parse(text)
      } catch {
        body = Object.fromEntries(new URLSearchParams(text))
      }
    }

    console.log('Webhook received:', JSON.stringify(body))

    const { id, status, payer_name, payer_national_registration, end_to_end_id } = body

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID é obrigatório' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    // Find payment by external_payment_id
    const { data: payment, error: paymentFetchError } = await supabase
      .from('payments')
      .select('*, subscriptions!inner(*, subscription_plans!inner(*))')
      .eq('external_payment_id', id)
      .single()

    if (paymentFetchError || !payment) {
      console.error('Payment not found:', paymentFetchError)
      return new Response(JSON.stringify({ error: 'Pagamento não encontrado' }), { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    // Check if payment status indicates it's paid
    const isPaid = status === 'paid' || status === 'completed' || status === 'approved'

    if (isPaid) {
      const now = new Date()
      const durationDays = payment.subscriptions?.subscription_plans?.duration_days || 30
      const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000)

      // Update payment to paid
      const { error: paymentUpdateError } = await supabase
        .from('payments')
        .update({
          status: 'paid',
          paid_at: now.toISOString(),
          payer_name: payer_name || null,
          payer_document: payer_national_registration || null,
        })
        .eq('id', payment.id)

      if (paymentUpdateError) {
        console.error('Error updating payment:', paymentUpdateError)
        return new Response(JSON.stringify({ error: 'Erro ao atualizar pagamento' }), { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        })
      }

      // Update subscription to active
      const { error: subUpdateError } = await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          starts_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
        })
        .eq('id', payment.subscription_id)

      if (subUpdateError) {
        console.error('Error updating subscription:', subUpdateError)
        return new Response(JSON.stringify({ error: 'Erro ao atualizar assinatura' }), { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        })
      }

      console.log('Payment and subscription updated successfully')
    } else {
      console.log('Payment status not paid:', status)
    }

    return new Response(JSON.stringify({ success: true }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }
})
