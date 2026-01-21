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

// Helper to format month label for mobile (abbreviate)
function formatMonthLabel(label: string): { full: string; short: string } {
  const parts = label.split(' ');
  if (parts.length === 2) {
    const monthAbbrev = parts[0].substring(0, 3);
    return { full: label, short: `${monthAbbrev} ${parts[1]}` };
  }
  return { full: label, short: label };
}

export const RevenueHistory = forwardRef<HTMLDivElement, RevenueHistoryProps>(
  function RevenueHistory({ monthlyRevenue, totals }, ref) {
    return (
      <Card ref={ref} className="glass-card">
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-base sm:text-lg font-semibold">Histórico Mensal</CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-6 pt-0">
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm py-2 px-2 sm:px-4">Mês</TableHead>
                  <TableHead className="text-xs sm:text-sm py-2 px-2 sm:px-4 text-right">Faturamento</TableHead>
                  <TableHead className="text-xs sm:text-sm py-2 px-2 sm:px-4 text-right">Projeção</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyRevenue.map((month) => {
                  const { full, short } = formatMonthLabel(month.label);
                  return (
                    <TableRow key={month.month}>
                      <TableCell className="py-2 px-2 sm:px-4 font-medium text-xs sm:text-sm">
                        <span className="hidden sm:inline">{full}</span>
                        <span className="sm:hidden">{short}</span>
                      </TableCell>
                      <TableCell className="py-2 px-2 sm:px-4 text-right font-mono text-xs sm:text-sm text-green-600 dark:text-green-400">
                        {formatCurrency(month.faturamento)}
                      </TableCell>
                      <TableCell className="py-2 px-2 sm:px-4 text-right font-mono text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                        {formatCurrency(month.projecao)}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {/* Totals Row */}
                <TableRow className="border-t-2 bg-muted/50 font-semibold">
                  <TableCell className="py-2 px-2 sm:px-4 text-xs sm:text-sm">Total</TableCell>
                  <TableCell className="py-2 px-2 sm:px-4 text-right font-mono text-xs sm:text-sm text-green-600 dark:text-green-400">
                    {formatCurrency(totals.faturamento)}
                  </TableCell>
                  <TableCell className="py-2 px-2 sm:px-4 text-right font-mono text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                    {formatCurrency(totals.projecao)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }
);

RevenueHistory.displayName = 'RevenueHistory';
