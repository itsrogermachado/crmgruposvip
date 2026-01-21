import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { subMonths, isAfter, parseISO, isValid } from 'date-fns';

export interface ClientPayment {
  id: string;
  client_id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  notes?: string;
  comprovante_url?: string;
  created_at: string;
}

export interface ClientInfo {
  id: string;
  nome: string;
  telefone: string;
  plano: string;
  preco: number;
  status: string;
  data_entrada: string;
  data_vencimento: string;
}

export type PeriodFilter = '3m' | '6m' | '12m' | 'all' | 'custom';

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  // Handle Excel serial number
  const numericValue = Number(dateStr);
  if (!isNaN(numericValue) && numericValue > 40000 && numericValue < 60000) {
    const excelEpoch = new Date(1899, 11, 30);
    const result = new Date(excelEpoch.getTime() + numericValue * 24 * 60 * 60 * 1000);
    return isValid(result) ? result : null;
  }
  
  // Handle DD/MM/YYYY format
  if (dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/').map(Number);
    if (day && month && year) {
      const result = new Date(year, month - 1, day);
      return isValid(result) ? result : null;
    }
  }
  
  // Handle ISO format
  const isoDate = parseISO(dateStr);
  return isValid(isoDate) ? isoDate : null;
}

export function useClientPaymentHistory(clientId: string) {
  const [client, setClient] = useState<ClientInfo | null>(null);
  const [payments, setPayments] = useState<ClientPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();
  const { toast } = useToast();

  useEffect(() => {
    if (!clientId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch client info
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('id, nome, telefone, plano, preco, status, data_entrada, data_vencimento')
          .eq('id', clientId)
          .single();

        if (clientError) throw clientError;
        setClient(clientData);

        // Fetch payments
        const { data: paymentsData, error: paymentsError } = await supabase
          .from('client_payments')
          .select('*')
          .eq('client_id', clientId)
          .order('payment_date', { ascending: false });

        if (paymentsError) throw paymentsError;
        setPayments(paymentsData || []);
      } catch (error) {
        console.error('Error fetching client payment history:', error);
        toast({
          title: 'Erro ao carregar histórico',
          description: 'Não foi possível carregar os dados do cliente.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId, toast]);

  const filteredPayments = useMemo(() => {
    if (periodFilter === 'all') return payments;

    const now = new Date();
    let startDate: Date;

    if (periodFilter === 'custom') {
      if (!customStartDate) return payments;
      startDate = customStartDate;
    } else {
      const monthsMap: Record<string, number> = {
        '3m': 3,
        '6m': 6,
        '12m': 12,
      };
      startDate = subMonths(now, monthsMap[periodFilter]);
    }

    return payments.filter((payment) => {
      const paymentDate = parseDate(payment.payment_date);
      if (!paymentDate) return true;
      
      const afterStart = isAfter(paymentDate, startDate) || paymentDate.getTime() === startDate.getTime();
      
      if (periodFilter === 'custom' && customEndDate) {
        const beforeEnd = paymentDate <= customEndDate;
        return afterStart && beforeEnd;
      }
      
      return afterStart;
    });
  }, [payments, periodFilter, customStartDate, customEndDate]);

  const totals = useMemo(() => {
    const total = filteredPayments.reduce((sum, payment) => sum + Number(payment.amount), 0);
    return {
      total,
      count: filteredPayments.length,
    };
  }, [filteredPayments]);

  return {
    client,
    payments: filteredPayments,
    allPayments: payments,
    loading,
    totals,
    periodFilter,
    setPeriodFilter,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
  };
}
