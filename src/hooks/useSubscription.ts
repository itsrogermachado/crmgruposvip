import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useAdmin } from './useAdmin';

interface Subscription {
  id: string;
  status: string;
  starts_at: string | null;
  expires_at: string | null;
  plan_id: string;
}

export function useSubscription() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSubscription() {
      if (!user) {
        setSubscription(null);
        setLoading(false);
        return;
      }

      // Admins bypass subscription check
      if (isAdmin) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('id, status, starts_at, expires_at, plan_id')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();

        if (error) {
          console.error('Error checking subscription:', error);
          setSubscription(null);
        } else if (data) {
          // Check if subscription is not expired
          const now = new Date();
          const expiresAt = data.expires_at ? new Date(data.expires_at) : null;
          
          if (!expiresAt || expiresAt > now) {
            setSubscription(data);
          } else {
            setSubscription(null);
          }
        } else {
          setSubscription(null);
        }
      } catch (err) {
        console.error('Error checking subscription:', err);
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading && !adminLoading) {
      checkSubscription();
    }
  }, [user, authLoading, isAdmin, adminLoading]);

  const hasActiveSubscription = isAdmin || !!subscription;

  return { 
    hasActiveSubscription, 
    subscription, 
    isAdmin,
    loading: loading || authLoading || adminLoading 
  };
}
