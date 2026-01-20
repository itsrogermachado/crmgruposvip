import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useAdmin } from './useAdmin';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Subscription {
  id: string;
  status: string;
  starts_at: string | null;
  expires_at: string | null;
  plan_id: string;
}

type UrgencyLevel = 'safe' | 'warning' | 'danger' | 'critical';

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
        // Get all active subscriptions and find the one with the latest expiry
        const { data, error } = await supabase
          .from('subscriptions')
          .select('id, status, starts_at, expires_at, plan_id')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('expires_at', { ascending: false, nullsFirst: false })
          .limit(1);

        if (error) {
          console.error('Error checking subscription:', error);
          setSubscription(null);
        } else if (data && data.length > 0) {
          const activeSubscription = data[0];
          // Check if subscription is not expired
          const now = new Date();
          const expiresAt = activeSubscription.expires_at ? new Date(activeSubscription.expires_at) : null;
          
          if (!expiresAt || expiresAt > now) {
            setSubscription(activeSubscription);
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

  // Calculate days remaining and urgency level
  const { daysRemaining, expiresAtFormatted, urgencyLevel } = useMemo(() => {
    if (!subscription?.expires_at) {
      return { daysRemaining: null, expiresAtFormatted: null, urgencyLevel: 'safe' as UrgencyLevel };
    }

    const now = new Date();
    const expiresAt = new Date(subscription.expires_at);
    const diffTime = expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formatted = format(expiresAt, "dd/MM/yyyy", { locale: ptBR });

    let level: UrgencyLevel = 'safe';
    if (diffDays <= 3) {
      level = 'critical';
    } else if (diffDays <= 7) {
      level = 'danger';
    } else if (diffDays <= 30) {
      level = 'warning';
    }

    return {
      daysRemaining: diffDays,
      expiresAtFormatted: formatted,
      urgencyLevel: level
    };
  }, [subscription?.expires_at]);

  return { 
    hasActiveSubscription, 
    subscription, 
    isAdmin,
    daysRemaining,
    expiresAtFormatted,
    urgencyLevel,
    loading: loading || authLoading || adminLoading 
  };
}
