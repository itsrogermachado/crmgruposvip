import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useClients } from './useClients';
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
  lucroEsperado: number; // Projeção baseada em clientes
  diferenca: number;
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

export function useClientPayments() {
  const [payments, setPayments] = useState<ClientPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { clients } = useClients();

  const fetchPayments = useCallback(async () => {
    if (!user) {
      setPayments([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('client_payments')
        .select('*')
        .order('payment_date', { ascending: false });

      if (error) throw error;

      const mappedPayments: ClientPayment[] = (data || []).map((p) => ({
        id: p.id,
        client_id: p.client_id,
        amount: Number(p.amount),
        payment_date: p.payment_date,
        payment_method: p.payment_method || 'pix',
        notes: p.notes || undefined,
        comprovante_url: p.comprovante_url || undefined,
        created_at: p.created_at,
      }));

      setPayments(mappedPayments);
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const monthlyRevenue = useMemo(() => {
    const today = new Date();
    const currentMonth = startOfMonth(today);
    const months: MonthlyRevenue[] = [];

    // Mês mínimo: Janeiro 2026
    const minMonth = new Date(2026, 0, 1);

    // Encontrar o mês mais distante com clientes a vencer
    let maxMonth = currentMonth;
    clients.forEach((c) => {
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

      // Calculate expected profit based on client due dates
      // Include clients with status "Ativo" or "Próximo" whose due date falls in this month
      // Exclude clients with status "Vencido"
      const lucroEsperado = clients
        .filter((c) => {
          const dueDate = parseDate(c.data_vencimento);
          if (!dueDate) return false;
          
          // Check if due date is within this month
          const isInMonth = isWithinInterval(dueDate, { start: monthStart, end: monthEnd });
          
          // Only include active or near-expiration clients (exclude expired)
          const isValidStatus = c.status === 'Ativo' || c.status === 'Próximo';
          
          return isInMonth && isValidStatus;
        })
        .reduce((sum, c) => sum + c.preco, 0);

      months.push({
        month: monthKey,
        label: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
        faturamento,
        lucroEsperado,
        diferenca: faturamento - lucroEsperado,
      });

      monthDate = addMonths(monthDate, 1);
    }

    // Ordenar por mês mais recente primeiro
    return months.sort((a, b) => b.month.localeCompare(a.month));
  }, [payments, clients]);

  const totals = useMemo(() => {
    return monthlyRevenue.reduce(
      (acc, m) => ({
        faturamento: acc.faturamento + m.faturamento,
        lucroEsperado: acc.lucroEsperado + m.lucroEsperado,
        diferenca: acc.diferenca + m.diferenca,
      }),
      { faturamento: 0, lucroEsperado: 0, diferenca: 0 }
    );
  }, [monthlyRevenue]);

  return {
    payments,
    loading,
    monthlyRevenue,
    totals,
    refetch: fetchPayments,
  };
}
