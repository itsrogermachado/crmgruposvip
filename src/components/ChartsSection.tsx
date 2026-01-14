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
import { PieChart as PieChartIcon } from 'lucide-react';

interface ChartsSectionProps {
  clients: Client[];
}

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
      { name: 'Ativos', value: statusCount.Ativo, color: 'hsl(142, 71%, 45%)', gradient: 'url(#greenGradient)' },
      { name: 'Próximos', value: statusCount.Próximo, color: 'hsl(45, 93%, 47%)', gradient: 'url(#yellowGradient)' },
      { name: 'Vencidos', value: statusCount.Vencido, color: 'hsl(0, 84%, 60%)', gradient: 'url(#redGradient)' },
    ].filter(item => item.value > 0);
  }, [clients]);

  const totalClients = clients.length;

  if (clients.length === 0) {
    return null;
  }

  return (
    <div className="px-4 md:px-6 pb-4 md:pb-6 animate-scale-in" style={{ animationDelay: '0.2s' }}>
      <Card className="max-w-sm mx-auto glass-card overflow-hidden">
        <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
              <PieChartIcon className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="text-sm sm:text-base font-semibold">Distribuição por Status</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
          <div style={{ height: 'clamp(160px, 30vw, 220px)' }} className="relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="hsl(142, 71%, 50%)" />
                    <stop offset="100%" stopColor="hsl(142, 71%, 35%)" />
                  </linearGradient>
                  <linearGradient id="yellowGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="hsl(45, 93%, 55%)" />
                    <stop offset="100%" stopColor="hsl(45, 93%, 40%)" />
                  </linearGradient>
                  <linearGradient id="redGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="hsl(0, 84%, 65%)" />
                    <stop offset="100%" stopColor="hsl(0, 84%, 50%)" />
                  </linearGradient>
                </defs>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.gradient}
                      className="transition-all duration-300 hover:opacity-80"
                      style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3)',
                  }}
                  formatter={(value: number, name: string) => [
                    `${value} clientes (${((value / totalClients) * 100).toFixed(0)}%)`,
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-responsive-xl font-bold text-foreground">{totalClients}</span>
              <span className="text-responsive-sm text-muted-foreground">Total</span>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-2 sm:mt-3">
            {statusDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-1 sm:gap-1.5">
                <div 
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[10px] sm:text-xs text-muted-foreground">{item.name}</span>
                <span className="text-[10px] sm:text-xs font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
