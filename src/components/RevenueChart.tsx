import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { MonthlyRevenue } from '@/hooks/useClientPayments';
import { Client } from '@/types/client';

interface RevenueChartProps {
  monthlyRevenue: MonthlyRevenue[];
  clients: Client[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3 rounded-lg border border-border/50 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-muted-foreground">{entry.name}</span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function RevenueChart({ monthlyRevenue, clients }: RevenueChartProps) {
  const chartData = useMemo(() => {
    // Calculate expected profit per month based on clients' due dates
    const expectedByMonth: Record<string, number> = {};

    clients.forEach((client) => {
      if (client.status === 'Ativo' || client.status === 'Próximo') {
        // Parse the due date to get the month
        let dueDate: Date | null = null;
        const dateStr = client.dataVencimento;

        // Try different date formats
        if (dateStr.includes('/')) {
          const parts = dateStr.split('/');
          if (parts.length === 3) {
            const [day, month, year] = parts;
            dueDate = new Date(Number(year), Number(month) - 1, Number(day));
          }
        } else if (dateStr.includes('-')) {
          dueDate = new Date(dateStr);
        }

        if (dueDate && !isNaN(dueDate.getTime())) {
          const monthKey = `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, '0')}`;
          expectedByMonth[monthKey] = (expectedByMonth[monthKey] || 0) + client.preco;
        }
      }
    });

    // Combine revenue data with expected profit
    return monthlyRevenue.map((rev) => ({
      month: rev.label,
      monthKey: rev.month,
      faturamento: rev.faturamento,
      lucroEsperado: expectedByMonth[rev.month] || 0,
    }));
  }, [monthlyRevenue, clients]);

  // Only show months with data
  const filteredData = chartData.filter(
    (d) => d.faturamento > 0 || d.lucroEsperado > 0
  );

  if (filteredData.length === 0) {
    return null;
  }

  return (
    <div className="px-4 md:px-6 mt-6">
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Faturamento vs Lucro Esperado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] md:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredData}
                margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickFormatter={(value) => formatCurrency(value)}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => (
                    <span className="text-sm text-muted-foreground">{value}</span>
                  )}
                />
                <Bar
                  dataKey="faturamento"
                  name="Faturamento Real"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
                <Bar
                  dataKey="lucroEsperado"
                  name="Lucro Esperado"
                  fill="hsl(var(--stat-green))"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                  opacity={0.7}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
