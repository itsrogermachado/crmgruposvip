import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PublicPlan {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  duration_days: number;
  is_active: boolean;
}

export function usePublicPlans() {
  return useQuery({
    queryKey: ['public-plans'],
    queryFn: async (): Promise<PublicPlan[]> => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_cents', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
}
