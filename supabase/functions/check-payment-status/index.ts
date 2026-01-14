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
    const pushinpayApiKey = Deno.env.get('PUSHINPAY_API_KEY')!

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

    // Check status on PushinPay API
    const externalId = payment.external_payment_id
    if (!externalId) {
      return new Response(
        JSON.stringify({ status: 'pending', error: 'ID externo não encontrado' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Use correct PushinPay endpoint: /api/transactions/{id}
    const pushinpayResponse = await fetch(
      `https://api.pushinpay.com.br/api/transactions/${externalId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${pushinpayApiKey}`,
          'Accept': 'application/json',
        },
      }
    )

    if (!pushinpayResponse.ok) {
      const errorBody = await pushinpayResponse.text()
      console.error('PushinPay API error:', pushinpayResponse.status, errorBody)
      return new Response(
        JSON.stringify({ status: 'pending', error: 'Erro ao consultar status' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const pushinpayData = await pushinpayResponse.json()
    console.log('PushinPay status response:', JSON.stringify(pushinpayData))

    const pushinpayStatus = pushinpayData.status?.toLowerCase()
    const isPaid = pushinpayStatus === 'paid' || pushinpayStatus === 'completed' || pushinpayStatus === 'approved'

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
          payer_name: pushinpayData.payer_name || null,
          payer_document: pushinpayData.payer_national_registration?.replace(/\D/g, '') || null,
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
