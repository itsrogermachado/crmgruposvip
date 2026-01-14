import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { Client } from '@/types/client';

interface ChartsSectionProps {
  clients: Client[];
}

export function ChartsSection({ clients }: ChartsSectionProps) {
  // Status distribution for pie chart
  const statusDistribution = useMemo(() => {
    const statusCount = {
      Ativo: 0,
      Próximo: 0,
      Vencido: 0,
    };
    
    clients.forEach((client) => {
      if (client.status in statusCount) {
        statusCount[client.status as keyof typeof statusCount]++;
      }
    });
    
    return [
      { name: 'Ativos', value: statusCount.Ativo, color: 'hsl(142, 71%, 45%)' },
      { name: 'Próximos', value: statusCount.Próximo, color: 'hsl(48, 96%, 53%)' },
      { name: 'Vencidos', value: statusCount.Vencido, color: 'hsl(0, 84%, 60%)' },
    ].filter(item => item.value > 0);
  }, [clients]);

  if (clients.length === 0) {
    return null;
  }

  return (
    <div className="px-6 pb-4">
      {/* Status Distribution Pie Chart */}
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-lg">Distribuição por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
