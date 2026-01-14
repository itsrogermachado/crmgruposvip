import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Client } from '@/types/client';
import { PieChart as PieChartIcon } from 'lucide-react';
interface ChartsSectionProps {
  clients: Client[];
}
export function ChartsSection({
  clients
}: ChartsSectionProps) {
  const statusDistribution = useMemo(() => {
    const statusCount = {
      Ativo: 0,
      Próximo: 0,
      Vencido: 0
    };
    clients.forEach(client => {
      if (client.status in statusCount) {
        statusCount[client.status as keyof typeof statusCount]++;
      }
    });
    return [{
      name: 'Ativos',
      value: statusCount.Ativo,
      color: 'hsl(142, 71%, 45%)',
      gradient: 'url(#greenGradient)'
    }, {
      name: 'Próximos',
      value: statusCount.Próximo,
      color: 'hsl(45, 93%, 47%)',
      gradient: 'url(#yellowGradient)'
    }, {
      name: 'Vencidos',
      value: statusCount.Vencido,
      color: 'hsl(0, 84%, 60%)',
      gradient: 'url(#redGradient)'
    }].filter(item => item.value > 0);
  }, [clients]);
  const totalClients = clients.length;
  if (clients.length === 0) {
    return null;
  }
  return;
}