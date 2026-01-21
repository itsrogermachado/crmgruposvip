import { Users, TrendingUp, Clock, AlertCircle, DollarSign } from 'lucide-react';
import { StatCard } from './StatCard';
import { Client } from '@/types/client';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface StatsGridProps {
  clients: Client[];
}

const parseDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  if (dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }
  return parseISO(dateStr);
};

export function StatsGrid({ clients }: StatsGridProps) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const monthName = format(today, 'MMMM', { locale: ptBR });
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  const totalClientes = clients.length;
  const clientesAtivos = clients.filter(c => c.status === 'Ativo').length;
  const proximosVencimento = clients.filter(c => c.status === 'Próximo').length;
  const clientesVencidos = clients.filter(c => c.status === 'Vencido').length;

  // Clientes com vencimento no mês atual
  const clientesDoMes = clients.filter(c => {
    const dueDate = parseDate(c.dataVencimento);
    return dueDate && isWithinInterval(dueDate, { start: monthStart, end: monthEnd });
  });

  // Faturamento do mês: soma de preços de clientes com vencimento no mês
  const faturamentoMensal = clientesDoMes.reduce((acc, c) => acc + c.preco, 0);

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className="stats-grid">
      <StatCard
        title="Total de Clientes"
        value={totalClientes}
        icon={Users}
        variant="blue"
      />
      <StatCard
        title="Clientes Ativos"
        value={clientesAtivos}
        icon={TrendingUp}
        variant="purple"
      />
      <StatCard
        title="Próximos do Vencimento"
        value={proximosVencimento}
        icon={Clock}
        variant="yellow"
      />
      <StatCard
        title="Clientes Vencidos"
        value={clientesVencidos}
        icon={AlertCircle}
        variant="red"
      />
      <StatCard
        title={`Faturamento ${capitalizedMonth}`}
        value={formatCurrency(faturamentoMensal)}
        icon={DollarSign}
        variant="cyan"
      />
    </div>
  );
}
