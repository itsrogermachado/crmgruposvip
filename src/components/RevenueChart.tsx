import { MonthlyRevenue } from '@/hooks/useClientPayments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';

interface RevenueChartProps {
  monthlyRevenue: MonthlyRevenue[];
}

const chartConfig = {
  faturamentoReal: {
    label: 'Faturamento Real',
    color: 'hsl(var(--chart-1))',
  },
  faturamentoEsperado: {
    label: 'Faturamento Esperado',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatShortMonth(label: string): string {
  const parts = label.split(' ');
  if (parts.length >= 1) {
    return parts[0].slice(0, 3);
  }
  return label;
}

export function RevenueChart({ monthlyRevenue }: RevenueChartProps) {
  // Reverse to show oldest first (left to right)
  const chartData = [...monthlyRevenue].reverse().map((m) => ({
    ...m,
    shortLabel: formatShortMonth(m.label),
  }));

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Comparativo de Faturamento</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
            <XAxis
              dataKey="shortLabel"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              width={45}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
              formatter={(value, name) => (
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">
                        {name === 'faturamentoReal' ? 'Faturamento Real' : 'Faturamento Esperado'}
                      </span>
                      <span className="font-mono font-medium">
                        {formatCurrency(Number(value))}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Bar
              dataKey="faturamentoReal"
              fill="var(--color-faturamentoReal)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="faturamentoEsperado"
              fill="var(--color-faturamentoEsperado)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ChartContainer>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'hsl(var(--chart-1))' }} />
            <span className="text-sm text-muted-foreground">Faturamento Real</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'hsl(var(--chart-2))' }} />
            <span className="text-sm text-muted-foreground">Faturamento Esperado</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
