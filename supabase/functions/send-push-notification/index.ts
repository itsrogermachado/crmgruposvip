import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import * as webpush from "https://esm.sh/web-push@3.6.6"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { record } = await req.json()
    const { user_id, title, message } = record

    // Get the user's push subscription
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const response = await fetch(`${supabaseUrl}/rest/v1/push_subscriptions?user_id=eq.${user_id}&select=subscription`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    })
    
    const subscriptions = await response.json()
    
    if (!subscriptions || subscriptions.length === 0) {
      console.log('No push subscription found for user:', user_id)
      return new Response(JSON.stringify({ success: true, message: 'No subscription' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')

    if (!vapidPublicKey || !vapidPrivateKey) {
      throw new Error('VAPID keys not configured in Edge Function secrets')
    }

    webpush.setVapidDetails(
      'mailto:contato@seusite.com',
      vapidPublicKey,
      vapidPrivateKey
    )

    const payload = JSON.stringify({
      title,
      message,
      url: '/notifications'
    })

    const results = await Promise.all(subscriptions.map(async (sub: any) => {
      try {
        await webpush.sendNotification(sub.subscription, payload)
        return { success: true }
      } catch (error) {
        console.error('Error sending push notification:', error)
        return { success: false, error: error.message }
      }
    }))

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
