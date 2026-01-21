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
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface RevenueHistoryProps {
  monthlyRevenue: MonthlyRevenue[];
  totals: {
    faturamento: number;
    lucroEsperado: number;
    diferenca: number;
  };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function getDifferenceIcon(diferenca: number) {
  if (diferenca > 0) {
    return <TrendingUp className="w-4 h-4 text-primary" />;
  } else if (diferenca < 0) {
    return <TrendingDown className="w-4 h-4 text-destructive" />;
  }
  return <Minus className="w-4 h-4 text-muted-foreground" />;
}

function getDifferenceColor(diferenca: number): string {
  if (diferenca > 0) return 'text-primary';
  if (diferenca < 0) return 'text-destructive';
  return 'text-muted-foreground';
}

export function RevenueHistory({ monthlyRevenue, totals }: RevenueHistoryProps) {
  return (
    <Card className="glass-card">
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
                <TableHead className="text-right">Lucro Esperado</TableHead>
                <TableHead className="text-right">Diferença</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyRevenue.map((month) => (
                <TableRow key={month.month}>
                  <TableCell className="font-medium">{month.label}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(month.faturamento)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {formatCurrency(month.lucroEsperado)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={`flex items-center justify-end gap-1 font-mono ${getDifferenceColor(month.diferenca)}`}>
                      {getDifferenceIcon(month.diferenca)}
                      {formatCurrency(Math.abs(month.diferenca))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {/* Totals Row */}
              <TableRow className="border-t-2 bg-muted/50 font-semibold">
                <TableCell>Total (12 meses)</TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(totals.faturamento)}
                </TableCell>
                <TableCell className="text-right font-mono text-muted-foreground">
                  {formatCurrency(totals.lucroEsperado)}
                </TableCell>
                <TableCell className="text-right">
                  <div className={`flex items-center justify-end gap-1 font-mono ${getDifferenceColor(totals.diferenca)}`}>
                    {getDifferenceIcon(totals.diferenca)}
                    {formatCurrency(Math.abs(totals.diferenca))}
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
