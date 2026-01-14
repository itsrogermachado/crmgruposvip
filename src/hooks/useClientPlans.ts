import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export function useClientPlans() {
  const [plans, setPlans] = useState<string[]>(['VIP Completo', 'Delay']);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPlans = useCallback(async () => {
    if (!user) {
      setPlans(['VIP Completo', 'Delay']);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('clients')
        .select('plano')
        .order('plano');

      if (error) throw error;

      // Get unique plans from existing clients
      const uniquePlans = [...new Set((data || []).map(c => c.plano))].filter(Boolean);
      
      // Ensure default plans are included
      const defaultPlans = ['VIP Completo', 'Delay'];
      const allPlans = [...new Set([...defaultPlans, ...uniquePlans])];
      
      setPlans(allPlans.sort());
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
      setPlans(['VIP Completo', 'Delay']);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const addPlan = (newPlan: string) => {
    if (newPlan && !plans.includes(newPlan)) {
      setPlans(prev => [...prev, newPlan].sort());
    }
  };

  return {
    plans,
    loading,
    fetchPlans,
    addPlan,
  };
}
