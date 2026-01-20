import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { parseBRDate } from '@/lib/dateUtils';

export interface ClientPayment {
  id: string;
  client_id: string;
  user_id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  notes?: string;
  comprovante_url?: string;
  created_at: string;
  client?: {
    nome: string;
    plano: string;
    status: string;
  };
}

export interface MonthlyPaymentData {
  month: number;
  year: number;
  monthName: string;
  faturamento: number;
  lucroEsperado: number;
  paymentCount: number;
  isPast: boolean;
}

interface ClientForProjection {
  id: string;
  nome: string;
  plano: string;
  preco: number;
  data_vencimento: string;
  status: string;
}

export function useClientPayments() {
  const [payments, setPayments] = useState<ClientPayment[]>([]);
  const [clients, setClients] = useState<ClientForProjection[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPayments = useCallback(async () => {
    if (!user) {
      setPayments([]);
      setClients([]);
      setLoading(false);
      return;
    }

    try {
      // Fetch payments and clients in parallel
      const [paymentsResult, clientsResult] = await Promise.all([
        supabase
          .from('client_payments')
          .select(`
            *,
            client:clients(nome, plano, status)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('clients')
          .select('id, nome, plano, preco, data_vencimento, status')
          .eq('user_id', user.id)
      ]);

      if (paymentsResult.error) throw paymentsResult.error;
      if (clientsResult.error) throw clientsResult.error;

      const mappedPayments: ClientPayment[] = (paymentsResult.data || []).map((p) => ({
        id: p.id,
        client_id: p.client_id,
        user_id: p.user_id,
        amount: Number(p.amount),
        payment_date: p.payment_date,
        payment_method: p.payment_method || 'pix',
        notes: p.notes || undefined,
        comprovante_url: p.comprovante_url || undefined,
        created_at: p.created_at,
        client: p.client ? {
          nome: p.client.nome,
          plano: p.client.plano,
          status: p.client.status,
        } : undefined,
      }));

      const mappedClients: ClientForProjection[] = (clientsResult.data || []).map((c) => ({
        id: c.id,
        nome: c.nome,
        plano: c.plano,
        preco: Number(c.preco),
        data_vencimento: c.data_vencimento,
        status: c.status,
      }));

      setPayments(mappedPayments);
      setClients(mappedClients);
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const addPayment = async (paymentData: {
    client_id: string;
    amount: number;
    payment_date: string;
    payment_method?: string;
    notes?: string;
    comprovante_url?: string;
  }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('client_payments')
        .insert({
          client_id: paymentData.client_id,
          user_id: user.id,
          amount: paymentData.amount,
          payment_date: paymentData.payment_date,
          payment_method: paymentData.payment_method || 'pix',
          notes: paymentData.notes || null,
          comprovante_url: paymentData.comprovante_url || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh payments list
      await fetchPayments();

      return data;
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      return null;
    }
  };

  const getPaymentsByMonth = useCallback((): MonthlyPaymentData[] => {
    const dataByMonth: Record<string, MonthlyPaymentData> = {};
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Process real payments
    payments.forEach((payment) => {
      const paymentDate = parseBRDate(payment.payment_date);
      if (!paymentDate) return;

      const month = paymentDate.getMonth();
      const year = paymentDate.getFullYear();
      const key = `${year}-${month}`;
      const isPast = year < currentYear || (year === currentYear && month < currentMonth);

      if (!dataByMonth[key]) {
        const monthName = paymentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        dataByMonth[key] = {
          month,
          year,
          monthName: monthName.charAt(0).toUpperCase() + monthName.slice(1),
          faturamento: 0,
          lucroEsperado: 0,
          paymentCount: 0,
          isPast,
        };
      }

      dataByMonth[key].faturamento += payment.amount;
      dataByMonth[key].paymentCount += 1;

      // Lucro esperado: pagamentos de clientes que ainda estão Ativos ou Próximos
      if (payment.client && (payment.client.status === 'Ativo' || payment.client.status === 'Próximo')) {
        dataByMonth[key].lucroEsperado += payment.amount;
      }
    });

    // Process future projections based on data_vencimento
    clients.forEach((client) => {
      const dueDate = parseBRDate(client.data_vencimento);
      if (!dueDate) return;

      const month = dueDate.getMonth();
      const year = dueDate.getFullYear();
      const key = `${year}-${month}`;
      
      // Only add projection if it's current month or future
      const isFutureOrCurrent = year > currentYear || (year === currentYear && month >= currentMonth);
      
      if (isFutureOrCurrent) {
        if (!dataByMonth[key]) {
          const monthName = dueDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
          dataByMonth[key] = {
            month,
            year,
            monthName: monthName.charAt(0).toUpperCase() + monthName.slice(1),
            faturamento: 0,
            lucroEsperado: 0,
            paymentCount: 0,
            isPast: false,
          };
        }

        // Add to lucro esperado (expected revenue based on active clients due dates)
        if (client.status === 'Ativo' || client.status === 'Próximo') {
          dataByMonth[key].lucroEsperado += client.preco;
        }
      }
    });

    // Sort by date (oldest first for chronological order)
    return Object.values(dataByMonth).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
  }, [payments, clients]);

  return {
    payments,
    loading,
    fetchPayments,
    addPayment,
    getPaymentsByMonth,
  };
}
