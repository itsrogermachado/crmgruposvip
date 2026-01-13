import { Users, TrendingUp, Clock, AlertCircle, DollarSign, Wallet } from 'lucide-react';
import { StatCard } from './StatCard';
import { Client } from '@/types/client';

interface StatsGridProps {
  clients: Client[];
}

export function StatsGrid({ clients }: StatsGridProps) {
  const totalClientes = clients.length;
  const clientesAtivos = clients.filter(c => c.status === 'Ativo').length;
  const proximosVencimento = clients.filter(c => c.status === 'Próximo').length;
  const clientesVencidos = clients.filter(c => c.status === 'Vencido').length;
  const faturamentoMensal = clients.reduce((acc, c) => acc + c.preco, 0);
  const lucroEsperado = faturamentoMensal * 0.87; // 87% lucro esperado

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
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
        title="Faturamento Mensal"
        value={formatCurrency(faturamentoMensal)}
        icon={DollarSign}
        variant="cyan"
      />
      <StatCard
        title="Lucro Esperado"
        value={formatCurrency(lucroEsperado)}
        icon={Wallet}
        variant="green"
      />
    </div>
  );
}
