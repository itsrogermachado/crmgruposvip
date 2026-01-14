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
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const pushinPayKey = Deno.env.get('PUSHINPAY_API_KEY')!

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    // Verify user
    const token = authHeader.replace('Bearer ', '')
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token)
    
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    const userId = claimsData.claims.sub as string

    const { planId } = await req.json()

    if (!planId) {
      return new Response(JSON.stringify({ error: 'planId é obrigatório' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    // Fetch plan details
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .eq('is_active', true)
      .single()

    if (planError || !plan) {
      return new Response(JSON.stringify({ error: 'Plano não encontrado' }), { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    // Create PIX charge on PushinPay
    // Include webhook secret token in URL for authentication
    const webhookSecret = Deno.env.get('PUSHINPAY_WEBHOOK_SECRET') || ''
    const webhookUrl = `${supabaseUrl}/functions/v1/pushinpay-webhook?token=${encodeURIComponent(webhookSecret)}`
    
    const pushinPayResponse = await fetch('https://api.pushinpay.com.br/api/pix/cashIn', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pushinPayKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        value: plan.price_cents,
        webhook_url: webhookUrl,
      }),
    })

    if (!pushinPayResponse.ok) {
      const errorText = await pushinPayResponse.text()
      console.error('PushinPay error:', errorText)
      return new Response(JSON.stringify({ error: 'Erro ao criar cobrança PIX' }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    const pixData = await pushinPayResponse.json()
    console.log('PushinPay response:', pixData)

    // Use service role to create records (bypass RLS)
    const supabaseServiceRole = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Create subscription with pending status
    const { data: subscription, error: subError } = await supabaseServiceRole
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        status: 'pending',
      })
      .select()
      .single()

    if (subError) {
      console.error('Subscription error:', subError)
      return new Response(JSON.stringify({ error: 'Erro ao criar assinatura' }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    // Create payment with pending status
    const { data: payment, error: paymentError } = await supabaseServiceRole
      .from('payments')
      .insert({
        user_id: userId,
        subscription_id: subscription.id,
        amount_cents: plan.price_cents,
        status: 'pending',
        external_payment_id: pixData.id,
        payment_method: 'pix',
      })
      .select()
      .single()

    if (paymentError) {
      console.error('Payment error:', paymentError)
      return new Response(JSON.stringify({ error: 'Erro ao criar pagamento' }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    return new Response(JSON.stringify({
      paymentId: payment.id,
      subscriptionId: subscription.id,
      qrCode: pixData.qr_code,
      qrCodeBase64: pixData.qr_code_base64,
      externalId: pixData.id,
      value: pixData.value,
      status: pixData.status,
    }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }
})
