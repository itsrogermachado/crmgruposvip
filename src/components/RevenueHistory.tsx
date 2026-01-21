import { forwardRef } from 'react';
import { MonthlyRevenue } from '@/hooks/useClientPayments';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RevenueHistoryProps {
  monthlyRevenue: MonthlyRevenue[];
  totals: {
    faturamento: number;
    projecao: number;
  };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export const RevenueHistory = forwardRef<HTMLDivElement, RevenueHistoryProps>(
  function RevenueHistory({ monthlyRevenue, totals }, ref) {
    return (
      <Card ref={ref} className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Histórico Mensal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mês</TableHead>
                <TableHead className="text-right">Faturamento</TableHead>
                <TableHead className="text-right">Projeção</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyRevenue.map((month) => (
                <TableRow key={month.month}>
                  <TableCell className="font-medium">{month.label}</TableCell>
                  <TableCell className="text-right font-mono text-green-600 dark:text-green-400">
                    {formatCurrency(month.faturamento)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-blue-600 dark:text-blue-400">
                    {formatCurrency(month.projecao)}
                  </TableCell>
                </TableRow>
              ))}
              {/* Totals Row */}
              <TableRow className="border-t-2 bg-muted/50 font-semibold">
                <TableCell>Total</TableCell>
                <TableCell className="text-right font-mono text-green-600 dark:text-green-400">
                  {formatCurrency(totals.faturamento)}
                </TableCell>
                <TableCell className="text-right font-mono text-blue-600 dark:text-blue-400">
                  {formatCurrency(totals.projecao)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
});

RevenueHistory.displayName = 'RevenueHistory';
