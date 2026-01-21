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
    const misticClientId = Deno.env.get('MISTIC_CLIENT_ID')!
    const misticClientSecret = Deno.env.get('MISTIC_CLIENT_SECRET')!

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

    // Use service role to create records (bypass RLS)
    const supabaseServiceRole = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Create subscription with pending status first to get the ID
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

    // Create payment with pending status first to get the ID for transactionId
    const { data: payment, error: paymentError } = await supabaseServiceRole
      .from('payments')
      .insert({
        user_id: userId,
        subscription_id: subscription.id,
        amount_cents: plan.price_cents,
        status: 'pending',
        payment_method: 'pix',
      })
      .select()
      .single()

    if (paymentError) {
      console.error('Payment error:', paymentError)
      // Rollback subscription
      await supabaseServiceRole.from('subscriptions').delete().eq('id', subscription.id)
      return new Response(JSON.stringify({ error: 'Erro ao criar pagamento' }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    // Create PIX charge on Mistic Pay
    const webhookSecret = Deno.env.get('MISTIC_WEBHOOK_SECRET') || ''
    const webhookUrl = `${supabaseUrl}/functions/v1/mistic-webhook?token=${encodeURIComponent(webhookSecret)}`
    
    // Convert cents to decimal (Mistic uses decimal format)
    const amountDecimal = plan.price_cents / 100

    const misticResponse = await fetch('https://api.misticpay.com/api/transactions/create', {
      method: 'POST',
      headers: {
        'ci': misticClientId,
        'cs': misticClientSecret,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        amount: amountDecimal,
        payerName: 'Cliente',
        payerDocument: '00000000000',
        transactionId: payment.id,
        description: `Assinatura ${plan.name}`,
        projectWebhook: webhookUrl,
      }),
    })

    if (!misticResponse.ok) {
      const errorText = await misticResponse.text()
      console.error('Mistic Pay error:', errorText)
      // Rollback payment and subscription
      await supabaseServiceRole.from('payments').delete().eq('id', payment.id)
      await supabaseServiceRole.from('subscriptions').delete().eq('id', subscription.id)
      return new Response(JSON.stringify({ error: 'Erro ao criar cobrança PIX' }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    const misticData = await misticResponse.json()
    console.log('Mistic Pay response:', misticData)

    // Update payment with external ID from Mistic
    const externalId = misticData.data?.transactionId || misticData.transactionId || payment.id
    await supabaseServiceRole
      .from('payments')
      .update({ external_payment_id: externalId })
      .eq('id', payment.id)

    return new Response(JSON.stringify({
      paymentId: payment.id,
      subscriptionId: subscription.id,
      qrCode: misticData.data?.copyPaste || misticData.copyPaste,
      qrCodeBase64: misticData.data?.qrCodeBase64 || misticData.qrCodeBase64,
      externalId: externalId,
      value: plan.price_cents,
      status: 'pending',
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
