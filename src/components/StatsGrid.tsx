import { Users, TrendingUp, Clock, AlertCircle, DollarSign, Calendar } from 'lucide-react';
import { StatCard } from './StatCard';
import { Client } from '@/types/client';
import { useIsMobile } from '@/hooks/use-mobile';

interface StatsGridProps {
  clients: Client[];
  faturamentoTotal: number;
  faturamentoMensal: number;
}

export function StatsGrid({ clients, faturamentoTotal, faturamentoMensal }: StatsGridProps) {
  const isMobile = useIsMobile();
  const totalClientes = clients.length;
  const clientesAtivos = clients.filter(c => c.status === 'Ativo').length;
  const proximosVencimento = clients.filter(c => c.status === 'Próximo').length;
  const clientesVencidos = clients.filter(c => c.status === 'Vencido').length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="stats-grid">
      <StatCard
        title={isMobile ? "Total" : "Total de Clientes"}
        value={totalClientes}
        icon={Users}
        variant="blue"
      />
      <StatCard
        title={isMobile ? "Ativos" : "Clientes Ativos"}
        value={clientesAtivos}
        icon={TrendingUp}
        variant="purple"
      />
      <StatCard
        title={isMobile ? "Próximos" : "Próximos do Vencimento"}
        value={proximosVencimento}
        icon={Clock}
        variant="yellow"
      />
      <StatCard
        title={isMobile ? "Vencidos" : "Clientes Vencidos"}
        value={clientesVencidos}
        icon={AlertCircle}
        variant="red"
      />
      <StatCard
        title={isMobile ? "Fat. Mensal" : "Faturamento Mensal"}
        value={formatCurrency(faturamentoMensal)}
        icon={Calendar}
        variant="cyan"
      />
      <StatCard
        title={isMobile ? "Fat. Total" : "Faturamento Total"}
        value={formatCurrency(faturamentoTotal)}
        icon={DollarSign}
        variant="green"
      />
    </div>
  );
}
