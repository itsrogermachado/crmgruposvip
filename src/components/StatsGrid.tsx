import { Users, TrendingUp, Clock, AlertCircle, DollarSign } from 'lucide-react';
import { StatCard } from './StatCard';
import { Client } from '@/types/client';

interface StatsGridProps {
  clients: Client[];
  faturamentoTotal: number;
}

export function StatsGrid({ clients, faturamentoTotal }: StatsGridProps) {
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
        title="Faturamento Total"
        value={formatCurrency(faturamentoTotal)}
        icon={DollarSign}
        variant="green"
      />
    </div>
  );
}
