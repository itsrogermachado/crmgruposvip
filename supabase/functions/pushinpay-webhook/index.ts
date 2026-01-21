import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Allowed payment statuses from PushinPay
const ALLOWED_STATUSES = ['paid', 'completed', 'approved', 'pending', 'cancelled', 'expired', 'refunded']

// Input validation functions
function validateExternalId(id: unknown): string | null {
  if (typeof id !== 'string') return null
  // Only allow alphanumeric, hyphens, underscores - max 100 chars
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(id)) return null
  return id
}

function validateStatus(status: unknown): string | null {
  if (typeof status !== 'string') return null
  if (!ALLOWED_STATUSES.includes(status.toLowerCase())) return null
  return status.toLowerCase()
}

function validatePayerName(name: unknown): string | null {
  if (name === null || name === undefined || name === '') return null
  if (typeof name !== 'string') return null
  // Max 200 chars, basic sanitization
  const sanitized = name.trim().slice(0, 200)
  // Remove any potentially dangerous characters
  return sanitized.replace(/[<>\"'&]/g, '')
}

function validateDocument(doc: unknown): string | null {
  if (doc === null || doc === undefined || doc === '') return null
  if (typeof doc !== 'string') return null
  // CPF (11 digits) or CNPJ (14 digits) - only digits
  const digitsOnly = doc.replace(/\D/g, '')
  if (digitsOnly.length !== 11 && digitsOnly.length !== 14) return null
  return digitsOnly
}

// HMAC signature verification
async function verifySignature(body: string, signature: string | null, secret: string): Promise<boolean> {
  if (!signature || !secret) {
    console.warn('Missing signature or secret for webhook verification')
    return false
  }

  try {
    const encoder = new TextEncoder()
    const keyData = encoder.encode(secret)
    const messageData = encoder.encode(body)

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData)
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    // Constant-time comparison to prevent timing attacks
    if (signature.length !== expectedSignature.length) return false
    
    let result = 0
    for (let i = 0; i < signature.length; i++) {
      result |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i)
    }
    return result === 0
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}

Deno.serve(async (req) => {
  console.log('=== WEBHOOK RECEIVED ===')
  console.log('Method:', req.method)
  console.log('URL:', req.url)
  console.log('Headers:', JSON.stringify(Object.fromEntries(req.headers.entries())))
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get raw body for signature verification
    const rawBody = await req.text()
    
    // Check for webhook signature (PushinPay may use different header names)
    const signature = req.headers.get('X-Pushinpay-Signature') || 
                      req.headers.get('X-Webhook-Signature') ||
                      req.headers.get('X-Signature')
    
    const webhookSecret = Deno.env.get('PUSHINPAY_WEBHOOK_SECRET')
    
    // Check for token in URL as fallback authentication
    const url = new URL(req.url)
    const urlToken = url.searchParams.get('token')
    
    // Verify either signature OR URL token
    let isAuthenticated = false
    
    if (webhookSecret) {
      // Try signature verification first
      const isValidSignature = await verifySignature(rawBody, signature, webhookSecret)
      if (isValidSignature) {
        isAuthenticated = true
        console.log('Webhook authenticated via signature')
      }
      
      // Fallback to URL token verification
      if (!isAuthenticated && urlToken && urlToken === webhookSecret) {
        isAuthenticated = true
        console.log('Webhook authenticated via URL token')
      }
    }
    
    if (!isAuthenticated) {
      console.error('Webhook authentication failed - no valid signature or token')
      return new Response(JSON.stringify({ error: 'Autenticação inválida' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    // Parse body
    const contentType = req.headers.get('content-type') || ''
    let body: Record<string, unknown>

    if (contentType.includes('application/json')) {
      try {
        body = JSON.parse(rawBody)
      } catch {
        return new Response(JSON.stringify({ error: 'JSON inválido' }), { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        })
      }
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      body = Object.fromEntries(new URLSearchParams(rawBody))
    } else {
      // Try to parse - PushinPay may send without correct Content-Type
      try {
        body = JSON.parse(rawBody)
      } catch {
        body = Object.fromEntries(new URLSearchParams(rawBody))
      }
    }

    console.log('Webhook received (sanitized):', JSON.stringify({
      id: body.id,
      status: body.status,
      has_payer_name: !!body.payer_name,
      has_document: !!body.payer_national_registration
    }))

    // Validate all inputs
    const externalId = validateExternalId(body.id)
    const status = validateStatus(body.status)
    const payerName = validatePayerName(body.payer_name)
    const payerDocument = validateDocument(body.payer_national_registration)

    if (!externalId) {
      console.error('Invalid external_payment_id:', body.id)
      return new Response(JSON.stringify({ error: 'ID inválido' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    if (!status) {
      console.error('Invalid status:', body.status)
      return new Response(JSON.stringify({ error: 'Status inválido' }), { 
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
      .eq('external_payment_id', externalId)
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
          payer_name: payerName,
          payer_document: payerDocument,
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

      console.log('Payment and subscription updated successfully for payment:', payment.id)
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
