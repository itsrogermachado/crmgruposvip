import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ClientPayment } from '@/types/clientPayment';
import { useToast } from '@/hooks/use-toast';

export function useClientPayments(clientId?: string) {
  const [payments, setPayments] = useState<ClientPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchPayments = useCallback(async (id?: string) => {
    const targetId = id || clientId;
    if (!targetId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_payments')
        .select('*')
        .eq('client_id', targetId)
        .order('payment_date', { ascending: false });

      if (error) throw error;

      setPayments((data || []) as ClientPayment[]);
    } catch (error: any) {
      console.error('Error fetching payments:', error);
      toast({
        title: 'Erro ao carregar pagamentos',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [clientId, toast]);

  const addPayment = async (paymentData: Omit<ClientPayment, 'id' | 'created_at' | 'user_id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('client_payments')
        .insert({
          ...paymentData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const newPayment = data as ClientPayment;
      setPayments(prev => [newPayment, ...prev]);

      toast({
        title: 'Pagamento registrado',
        description: 'Pagamento registrado com sucesso!',
      });

      return newPayment;
    } catch (error: any) {
      console.error('Error adding payment:', error);
      toast({
        title: 'Erro ao registrar pagamento',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deletePayment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('client_payments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPayments(prev => prev.filter(p => p.id !== id));

      toast({
        title: 'Pagamento excluído',
        description: 'Pagamento excluído com sucesso!',
      });
    } catch (error: any) {
      console.error('Error deleting payment:', error);
      toast({
        title: 'Erro ao excluir pagamento',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const getTotalPaid = () => {
    return payments.reduce((acc, p) => acc + Number(p.amount), 0);
  };

  const getLastPayment = () => {
    return payments[0] || null;
  };

  return {
    payments,
    loading,
    fetchPayments,
    addPayment,
    deletePayment,
    getTotalPaid,
    getLastPayment,
  };
}
