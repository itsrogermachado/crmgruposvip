import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { format, startOfMonth, endOfMonth, addMonths, isWithinInterval, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

export interface MonthlyRevenue {
  month: string; // "2026-01"
  label: string; // "Janeiro 2026"
  faturamento: number; // Pagamentos reais
  projecao: number; // Receita esperada baseada nos vencimentos
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  // If it's an Excel serial number (only digits)
  if (/^\d+$/.test(dateStr)) {
    const serialNumber = parseInt(dateStr);
    const excelEpoch = new Date(1899, 11, 30);
    return new Date(excelEpoch.getTime() + serialNumber * 24 * 60 * 60 * 1000);
  }
  
  // Try DD/MM/YYYY format
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
  
  // Try ISO format
  const isoDate = new Date(dateStr);
  if (!isNaN(isoDate.getTime())) {
    return isoDate;
  }
  
  return null;
}

interface ClientDueData {
  data_vencimento: string;
  preco: number;
  preco_renovacao: number | null;
}

export function useClientPayments() {
  const [payments, setPayments] = useState<ClientPayment[]>([]);
  const [clientsData, setClientsData] = useState<ClientDueData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    if (!user) {
      setPayments([]);
      setClientsData([]);
      setLoading(false);
      return;
    }

    try {
      // Fetch payments and client data in parallel
      const [paymentsResult, clientsResult] = await Promise.all([
        supabase
          .from('client_payments')
          .select('*')
          .order('payment_date', { ascending: false }),
        supabase
          .from('clients')
          .select('data_vencimento, preco, preco_renovacao')
      ]);

      if (paymentsResult.error) throw paymentsResult.error;
      if (clientsResult.error) throw clientsResult.error;

      const mappedPayments: ClientPayment[] = (paymentsResult.data || []).map((p) => ({
        id: p.id,
        client_id: p.client_id,
        amount: Number(p.amount),
        payment_date: p.payment_date,
        payment_method: p.payment_method || 'pix',
        notes: p.notes || undefined,
        comprovante_url: p.comprovante_url || undefined,
        created_at: p.created_at,
      }));

      const clientsDueData: ClientDueData[] = (clientsResult.data || []).map((c) => ({
        data_vencimento: c.data_vencimento,
        preco: Number(c.preco),
        preco_renovacao: c.preco_renovacao ? Number(c.preco_renovacao) : null,
      }));

      setPayments(mappedPayments);
      setClientsData(clientsDueData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Realtime subscription for automatic updates
  useEffect(() => {
    if (!user) return;

    const paymentsChannel = supabase
      .channel('client_payments_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'client_payments' },
        () => {
          fetchData();
        }
      )
      .subscribe();

    const clientsChannel = supabase
      .channel('clients_changes_for_revenue')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'clients' },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(paymentsChannel);
      supabase.removeChannel(clientsChannel);
    };
  }, [user, fetchData]);

  const monthlyRevenue = useMemo(() => {
    const today = new Date();
    const currentMonth = startOfMonth(today);
    const months: MonthlyRevenue[] = [];

    // Mês mínimo: Janeiro 2026
    const minMonth = new Date(2026, 0, 1);

    // Find the maximum month considering both payments and client due dates
    let maxMonth = currentMonth;
    
    // Check payments
    payments.forEach((p) => {
      const paymentDate = parseDate(p.payment_date);
      if (paymentDate && isAfter(startOfMonth(paymentDate), maxMonth)) {
        maxMonth = startOfMonth(paymentDate);
      }
    });

    // Check client due dates (to include future months)
    clientsData.forEach((c) => {
      const dueDate = parseDate(c.data_vencimento);
      if (dueDate && isAfter(startOfMonth(dueDate), maxMonth)) {
        maxMonth = startOfMonth(dueDate);
      }
    });

    // Gerar meses de Janeiro 2026 até o mês máximo
    let monthDate = minMonth;
    while (!isAfter(monthDate, maxMonth)) {
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      const monthKey = format(monthDate, 'yyyy-MM');
      const monthLabel = format(monthDate, 'MMMM yyyy', { locale: ptBR });

      // Calculate real revenue from payments
      const faturamento = payments
        .filter((p) => {
          const paymentDate = parseDate(p.payment_date);
          if (!paymentDate) return false;
          return isWithinInterval(paymentDate, { start: monthStart, end: monthEnd });
        })
        .reduce((sum, p) => sum + p.amount, 0);

      // Calculate projection from client due dates using RENEWAL price
      const projecao = clientsData
        .filter((c) => {
          const dueDate = parseDate(c.data_vencimento);
          if (!dueDate) return false;
          return isWithinInterval(dueDate, { start: monthStart, end: monthEnd });
        })
        .reduce((sum, c) => sum + (c.preco_renovacao ?? c.preco), 0);

      months.push({
        month: monthKey,
        label: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
        faturamento,
        projecao,
      });

      monthDate = addMonths(monthDate, 1);
    }

    // Ordenar por mês mais recente primeiro
    return months.sort((a, b) => b.month.localeCompare(a.month));
  }, [payments, clientsData]);

  const totals = useMemo(() => {
    return monthlyRevenue.reduce(
      (acc, m) => ({
        faturamento: acc.faturamento + m.faturamento,
        projecao: acc.projecao + m.projecao,
      }),
      { faturamento: 0, projecao: 0 }
    );
  }, [monthlyRevenue]);

  return {
    payments,
    loading,
    monthlyRevenue,
    totals,
    refetch: fetchData,
  };
}
