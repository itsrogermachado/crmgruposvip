import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Client } from '@/types/client';
import { PieChart as PieChartIcon } from 'lucide-react';

interface ChartsSectionProps {
  clients: Client[];
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="glass-card px-3 py-2 rounded-lg border border-border/50 shadow-lg">
        <p className="text-sm font-medium text-foreground">{data.name}</p>
        <p className="text-lg font-bold" style={{ color: data.payload.color }}>
          {data.value} cliente{data.value !== 1 ? 's' : ''}
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: { payload?: Array<{ value: string; color: string }> }) => {
  if (!payload) return null;
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export function ChartsSection({ clients }: ChartsSectionProps) {
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
      {
        name: 'Ativos',
        value: statusCount.Ativo,
        color: 'hsl(var(--stat-green))',
      },
      {
        name: 'Próximos',
        value: statusCount.Próximo,
        color: 'hsl(var(--stat-yellow))',
      },
      {
        name: 'Vencidos',
        value: statusCount.Vencido,
        color: 'hsl(var(--stat-red))',
      },
    ].filter((item) => item.value > 0);
  }, [clients]);

  const totalClients = clients.length;

  if (clients.length === 0) {
    return null;
  }

  return (
    <div className="px-4 md:px-6 mt-6">
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-primary" />
            Distribuição por Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            {/* Pie Chart */}
            <div className="w-full md:w-1/2 h-[250px] md:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={1} />
                      <stop offset="100%" stopColor="hsl(142, 71%, 35%)" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="yellowGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(45, 93%, 47%)" stopOpacity={1} />
                      <stop offset="100%" stopColor="hsl(45, 93%, 37%)" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(0, 84%, 60%)" stopOpacity={1} />
                      <stop offset="100%" stopColor="hsl(0, 84%, 50%)" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={2}
                    stroke="hsl(var(--background))"
                  >
                    {statusDistribution.map((entry, index) => {
                      const gradientId = entry.name === 'Ativos' ? 'greenGradient' : entry.name === 'Próximos' ? 'yellowGradient' : 'redGradient';
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#${gradientId})`}
                          className="transition-all duration-300 hover:opacity-80"
                        />
                      );
                    })}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={<CustomLegend />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Stats Summary */}
            <div className="w-full md:w-1/2 grid grid-cols-3 md:grid-cols-1 gap-3 md:gap-4">
              {statusDistribution.map((item) => {
                const percentage = ((item.value / totalClients) * 100).toFixed(1);
                return (
                  <div
                    key={item.name}
                    className="flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 rounded-lg bg-muted/30 border border-border/30 transition-all duration-300 hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2 mb-1 md:mb-0">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs md:text-sm font-medium text-muted-foreground">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg md:text-xl font-bold text-foreground">
                        {item.value}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({percentage}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
