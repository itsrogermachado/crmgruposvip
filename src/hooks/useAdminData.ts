import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

// Types
export interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  duration_days: number;
  is_active: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'pending' | 'active' | 'expired' | 'cancelled';
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
  profiles?: Profile;
  subscription_plans?: SubscriptionPlan;
}

export interface Payment {
  id: string;
  user_id: string;
  subscription_id: string | null;
  external_payment_id: string | null;
  amount_cents: number;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  payment_method: string | null;
  payer_name: string | null;
  payer_document: string | null;
  paid_at: string | null;
  created_at: string;
  profiles?: Profile;
}

// Hooks
export function useProfiles() {
  return useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Profile[];
    },
  });
}

export function useUserRoles() {
  return useQuery({
    queryKey: ['admin-user-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserRole[];
    },
  });
}

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price_cents', { ascending: true });

      if (error) throw error;
      return data as SubscriptionPlan[];
    },
  });
}

export function useSubscriptions() {
  return useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: async () => {
      // Fetch subscriptions
      const { data: subscriptionsData, error: subsError } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (subsError) throw subsError;

      // Fetch profiles and plans separately
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*');

      const { data: plansData } = await supabase
        .from('subscription_plans')
        .select('*');

      // Map subscriptions with profiles and plans
      const subscriptions = subscriptionsData.map((sub) => ({
        ...sub,
        profiles: profilesData?.find(p => p.user_id === sub.user_id),
        subscription_plans: plansData?.find(p => p.id === sub.plan_id),
      })) as Subscription[];

      return subscriptions;
    },
  });
}

export function usePayments() {
  return useQuery({
    queryKey: ['admin-payments'],
    queryFn: async () => {
      // Fetch payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (paymentsError) throw paymentsError;

      // Fetch profiles separately
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*');

      // Map payments with profiles
      const payments = paymentsData.map((payment) => ({
        ...payment,
        profiles: profilesData?.find(p => p.user_id === payment.user_id),
      })) as Payment[];

      return payments;
    },
  });
}

// Mutations
export function useToggleAdminRole() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, isCurrentlyAdmin }: { userId: string; isCurrentlyAdmin: boolean }) => {
      if (isCurrentlyAdmin) {
        // Remove admin role
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'admin');
        if (error) throw error;
      } else {
        // Add admin role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'admin' });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-roles'] });
      toast({ title: 'Permissão atualizada com sucesso!' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao atualizar permissão', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateSubscriptionStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status, expiresAt }: { id: string; status: string; expiresAt?: string }) => {
      const updateData: Record<string, unknown> = { status };
      if (status === 'active' && expiresAt) {
        updateData.starts_at = new Date().toISOString();
        updateData.expires_at = expiresAt;
      }

      const { error } = await supabase
        .from('subscriptions')
        .update(updateData)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      toast({ title: 'Assinatura atualizada com sucesso!' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao atualizar assinatura', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updateData: Record<string, unknown> = { status };
      if (status === 'paid') {
        updateData.paid_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('payments')
        .update(updateData)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
      toast({ title: 'Pagamento atualizado com sucesso!' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao atualizar pagamento', description: error.message, variant: 'destructive' });
    },
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (plan: Omit<SubscriptionPlan, 'id' | 'created_at'>) => {
      const { error } = await supabase
        .from('subscription_plans')
        .insert(plan);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      toast({ title: 'Plano criado com sucesso!' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao criar plano', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...plan }: Partial<SubscriptionPlan> & { id: string }) => {
      const { error } = await supabase
        .from('subscription_plans')
        .update(plan)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      toast({ title: 'Plano atualizado com sucesso!' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao atualizar plano', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeletePlan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('subscription_plans')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      toast({ title: 'Plano removido com sucesso!' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao remover plano', description: error.message, variant: 'destructive' });
    },
  });
}

// Subscription CRUD
export function useCreateSubscription() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (subscription: {
      user_id: string;
      plan_id: string;
      status: string;
      starts_at: string;
      expires_at: string | null;
    }) => {
      const { error } = await supabase
        .from('subscriptions')
        .insert(subscription);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      toast({ title: 'Assinatura criada com sucesso!' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao criar assinatura', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      user_id?: string;
      plan_id?: string;
      status?: string;
      starts_at?: string;
      expires_at?: string | null;
    }) => {
      const { error } = await supabase
        .from('subscriptions')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      toast({ title: 'Assinatura atualizada com sucesso!' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao atualizar assinatura', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      // First, unlink any payments associated with this subscription
      await supabase
        .from('payments')
        .update({ subscription_id: null })
        .eq('subscription_id', id);

      // Now delete the subscription
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      toast({ title: 'Assinatura excluída com sucesso!' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao excluir assinatura', description: error.message, variant: 'destructive' });
    },
  });
}

export function useExtendSubscription() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, additionalDays }: { id: string; additionalDays: number }) => {
      // First, get current subscription
      const { data: subscription, error: fetchError } = await supabase
        .from('subscriptions')
        .select('expires_at, status')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const currentExpiry = subscription.expires_at
        ? new Date(subscription.expires_at)
        : new Date();
      
      const newExpiry = new Date(currentExpiry);
      newExpiry.setDate(newExpiry.getDate() + additionalDays);

      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          expires_at: newExpiry.toISOString(),
          status: 'active',
        })
        .eq('id', id);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      toast({ title: 'Assinatura estendida com sucesso!' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao estender assinatura', description: error.message, variant: 'destructive' });
    },
  });
}

// Admin Stats
export function useAdminStats() {
  const { data: profiles } = useProfiles();
  const { data: subscriptions } = useSubscriptions();
  const { data: payments } = usePayments();

  const totalUsers = profiles?.length || 0;
  const activeSubscriptions = subscriptions?.filter(s => s.status === 'active').length || 0;
  const totalRevenue = payments?.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.amount_cents, 0) || 0;
  const pendingPayments = payments?.filter(p => p.status === 'pending').length || 0;

  return {
    totalUsers,
    activeSubscriptions,
    totalRevenue,
    pendingPayments,
  };
}
