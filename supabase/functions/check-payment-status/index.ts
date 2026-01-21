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
    const { paymentId } = await req.json()

    if (!paymentId) {
      return new Response(
        JSON.stringify({ error: 'paymentId é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const misticClientId = Deno.env.get('MISTIC_CLIENT_ID')!
    const misticClientSecret = Deno.env.get('MISTIC_CLIENT_SECRET')!

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    // Get payment from database
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*, subscriptions!inner(*, subscription_plans!inner(*))')
      .eq('id', paymentId)
      .single()

    if (paymentError || !payment) {
      console.error('Payment not found:', paymentError)
      return new Response(
        JSON.stringify({ error: 'Pagamento não encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // If already paid, return immediately
    if (payment.status === 'paid') {
      return new Response(
        JSON.stringify({ status: 'paid', paid_at: payment.paid_at }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check status on Mistic Pay API
    // Use payment.id as transactionId since that's what we send to Mistic
    const transactionId = payment.external_payment_id || payment.id

    const misticResponse = await fetch('https://api.misticpay.com/api/transactions/check', {
      method: 'POST',
      headers: {
        'ci': misticClientId,
        'cs': misticClientSecret,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ transactionId }),
    })

    if (!misticResponse.ok) {
      const errorBody = await misticResponse.text()
      console.error('Mistic Pay API error:', misticResponse.status, errorBody)
      return new Response(
        JSON.stringify({ status: 'pending', error: 'Erro ao consultar status' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const misticData = await misticResponse.json()
    console.log('Mistic Pay status response:', JSON.stringify(misticData))

    // Map Mistic status to our status
    // Mistic statuses: COMPLETO, PENDENTE, FALHA, EXPIRADO
    const misticStatus = (misticData.data?.status || misticData.status || '').toUpperCase()
    const isPaid = misticStatus === 'COMPLETO' || misticStatus === 'COMPLETED' || misticStatus === 'PAID' || misticStatus === 'APPROVED'

    if (isPaid && payment.status !== 'paid') {
      const now = new Date()
      const durationDays = payment.subscriptions?.subscription_plans?.duration_days || 30
      const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000)

      // Update payment to paid
      const { error: paymentUpdateError } = await supabase
        .from('payments')
        .update({
          status: 'paid',
          paid_at: now.toISOString(),
          payer_name: misticData.data?.payerName || misticData.payerName || null,
          payer_document: (misticData.data?.payerDocument || misticData.payerDocument || '').replace(/\D/g, '') || null,
        })
        .eq('id', payment.id)

      if (paymentUpdateError) {
        console.error('Error updating payment:', paymentUpdateError)
        return new Response(
          JSON.stringify({ status: 'pending', error: 'Erro ao atualizar pagamento' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
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
        return new Response(
          JSON.stringify({ status: 'pending', error: 'Erro ao atualizar assinatura' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('Payment confirmed via polling for payment:', payment.id)

      return new Response(
        JSON.stringify({ status: 'paid', paid_at: now.toISOString() }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ status: 'pending' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Check payment status error:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
