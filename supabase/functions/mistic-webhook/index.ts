import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Validate webhook token
    const url = new URL(req.url)
    const token = url.searchParams.get('token')
    const webhookSecret = Deno.env.get('MISTIC_WEBHOOK_SECRET')

    if (!token || token !== webhookSecret) {
      console.error('Invalid webhook token')
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    // Parse webhook body
    const body = await req.json()
    console.log('Mistic webhook received:', JSON.stringify(body))

    // Mistic sends: transactionId, status, value, fee, etc.
    const transactionId = body.transactionId
    const status = body.status?.toUpperCase()

    if (!transactionId) {
      console.error('Missing transactionId in webhook')
      return new Response(JSON.stringify({ error: 'Missing transactionId' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    // Find payment by external_payment_id or by id (we use payment.id as transactionId)
    let payment = null
    
    // First try to find by external_payment_id
    const { data: paymentByExternal } = await supabase
      .from('payments')
      .select('*, subscriptions!inner(*, subscription_plans!inner(*))')
      .eq('external_payment_id', transactionId)
      .single()

    if (paymentByExternal) {
      payment = paymentByExternal
    } else {
      // Try to find by payment id (we use payment.id as transactionId in create-pix)
      const { data: paymentById } = await supabase
        .from('payments')
        .select('*, subscriptions!inner(*, subscription_plans!inner(*))')
        .eq('id', transactionId)
        .single()
      
      payment = paymentById
    }

    if (!payment) {
      console.error('Payment not found for transactionId:', transactionId)
      return new Response(JSON.stringify({ error: 'Payment not found' }), { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    // Check if payment is already processed
    if (payment.status === 'paid') {
      console.log('Payment already processed:', payment.id)
      return new Response(JSON.stringify({ success: true, message: 'Already processed' }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    // Process based on status
    // Mistic statuses: COMPLETO, PENDENTE, FALHA, EXPIRADO
    const isPaid = status === 'COMPLETO' || status === 'COMPLETED' || status === 'PAID' || status === 'APPROVED'

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
          payer_name: body.payerName || null,
          payer_document: body.payerDocument?.replace(/\D/g, '') || null,
        })
        .eq('id', payment.id)

      if (paymentUpdateError) {
        console.error('Error updating payment:', paymentUpdateError)
        return new Response(JSON.stringify({ error: 'Error updating payment' }), { 
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
        return new Response(JSON.stringify({ error: 'Error updating subscription' }), { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        })
      }

      console.log('Payment confirmed via Mistic webhook:', payment.id)
    } else if (status === 'FALHA' || status === 'FAILED' || status === 'EXPIRADO' || status === 'EXPIRED') {
      // Mark payment as failed
      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('id', payment.id)

      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('id', payment.subscription_id)

      console.log('Payment failed/expired via Mistic webhook:', payment.id)
    }

    return new Response(JSON.stringify({ success: true }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })

  } catch (error) {
    console.error('Mistic webhook error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }
})
