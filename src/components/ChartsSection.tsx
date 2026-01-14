import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Client } from '@/types/client';
import { parseBRDate } from '@/lib/dateUtils';

interface ChartsSectionProps {
  clients: Client[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))'];

export function ChartsSection({ clients }: ChartsSectionProps) {
  // Group clients by entry month for evolution chart
  const monthlyEvolution = useMemo(() => {
    const monthMap = new Map<string, { clientes: number; faturamento: number }>();
    
    clients.forEach((client) => {
      const date = parseBRDate(client.dataEntrada);
      if (!date) return;
      
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const current = monthMap.get(monthKey) || { clientes: 0, faturamento: 0 };
      
      monthMap.set(monthKey, {
        clientes: current.clientes + 1,
        faturamento: current.faturamento + client.preco,
      });
    });
    
    // Sort by date and format for display
    return Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12) // Last 12 months
      .map(([month, data]) => {
        const [year, monthNum] = month.split('-');
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return {
          name: `${monthNames[parseInt(monthNum) - 1]}/${year.slice(2)}`,
          clientes: data.clientes,
          faturamento: data.faturamento,
        };
      });
  }, [clients]);

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

  // Plan distribution for bar chart
  const planDistribution = useMemo(() => {
    const planCount = {
      'VIP Completo': 0,
      'Delay': 0,
      'Básico': 0,
    };
    
    clients.forEach((client) => {
      if (client.plano in planCount) {
        planCount[client.plano as keyof typeof planCount]++;
      }
    });
    
    return Object.entries(planCount).map(([name, value]) => ({
      name,
      clientes: value,
    }));
  }, [clients]);

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  };

  if (clients.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      {/* Monthly Evolution Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Evolução Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyEvolution}>
                <defs>
                  <linearGradient id="colorClientes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis yAxisId="left" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis yAxisId="right" orientation="right" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={formatCurrency} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number, name: string) => [
                    name === 'faturamento' ? formatCurrency(value) : value,
                    name === 'clientes' ? 'Novos Clientes' : 'Faturamento',
                  ]}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="clientes"
                  name="Novos Clientes"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorClientes)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="faturamento"
                  name="Faturamento"
                  stroke="hsl(142, 71%, 45%)"
                  fillOpacity={1}
                  fill="url(#colorFaturamento)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Status Distribution Pie Chart */}
      <Card>
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

      {/* Plan Distribution Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Distribuição por Plano</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={planDistribution}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="clientes" name="Clientes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
