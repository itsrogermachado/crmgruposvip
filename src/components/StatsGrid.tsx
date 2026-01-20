import { Users, TrendingUp, Clock, AlertCircle, DollarSign, Wallet } from 'lucide-react';
import { StatCard } from './StatCard';
import { Client } from '@/types/client';
import { parseBRDate, getSaoPauloDate } from '@/lib/dateUtils';

interface StatsGridProps {
  clients: Client[];
}

export function StatsGrid({ clients }: StatsGridProps) {
  const totalClientes = clients.length;
  const clientesAtivos = clients.filter(c => c.status === 'Ativo').length;
  const proximosVencimento = clients.filter(c => c.status === 'Próximo').length;
  const clientesVencidos = clients.filter(c => c.status === 'Vencido').length;
  const clientesAtivosOuProximos = clients.filter(c => c.status === 'Ativo' || c.status === 'Próximo');
  
  // Calcular faturamento do mês atual baseado na data de vencimento
  const hoje = getSaoPauloDate();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();
  
  const clientesDoMesAtual = clients.filter(c => {
    const dataVenc = parseBRDate(c.dataVencimento);
    if (!dataVenc) return false;
    return dataVenc.getMonth() === mesAtual && dataVenc.getFullYear() === anoAtual;
  });
  
  const faturamentoMensal = clientesDoMesAtual.reduce((acc, c) => acc + c.preco, 0);
  const lucroEsperado = clientesAtivosOuProximos.reduce((acc, c) => acc + c.preco, 0);
  
  // Nome do mês em português para o título
  const nomeMes = hoje.toLocaleDateString('pt-BR', { month: 'long' });
  const tituloFaturamento = `Faturamento ${nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)}`;

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
        title={tituloFaturamento}
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
