import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, DollarSign, Calendar, Receipt } from 'lucide-react';
import { useClientPayments } from '@/hooks/useClientPayments';

export function RevenueHistory() {
  const { payments, loading, fetchPayments, getPaymentsByMonth } = useClientPayments();

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const monthlyData = getPaymentsByMonth();

  const totals = monthlyData.reduce(
    (acc, data) => ({
      faturamento: acc.faturamento + data.faturamento,
      lucroEsperado: acc.lucroEsperado + data.lucroEsperado,
      paymentCount: acc.paymentCount + data.paymentCount,
    }),
    { faturamento: 0, lucroEsperado: 0, paymentCount: 0 }
  );

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  // Identificar o mês atual
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  if (loading) {
    return (
      <div className="px-4 md:px-6 lg:px-8 mt-6">
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-primary" />
              Histórico de Pagamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              Carregando...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (monthlyData.length === 0) {
    return (
      <div className="px-4 md:px-6 lg:px-8 mt-6">
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-primary" />
              Histórico de Pagamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 space-y-2">
              <Receipt className="w-12 h-12 mx-auto text-muted-foreground/50" />
              <p className="text-muted-foreground">
                Nenhum pagamento registrado ainda.
              </p>
              <p className="text-sm text-muted-foreground/70">
                Os pagamentos serão registrados automaticamente ao criar ou renovar clientes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 lg:px-8 mt-6">
      <Card className="glass-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-primary" />
            Histórico de Pagamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="text-muted-foreground">Mês</TableHead>
                  <TableHead className="text-right text-muted-foreground">
                    <span className="flex items-center justify-end gap-1">
                      <DollarSign className="w-4 h-4 text-cyan-500" />
                      Faturamento
                    </span>
                  </TableHead>
                  <TableHead className="text-right text-muted-foreground">
                    <span className="flex items-center justify-end gap-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      Lucro Esperado
                    </span>
                  </TableHead>
                  <TableHead className="text-right text-muted-foreground hidden sm:table-cell">
                    Pagamentos
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyData.map((data) => {
                  const isCurrentMonth = data.month === currentMonth && data.year === currentYear;
                  return (
                    <TableRow
                      key={`${data.year}-${data.month}`}
                      className={`border-border/30 ${isCurrentMonth ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}
                    >
                      <TableCell className="font-medium">
                        {data.monthName}
                        {isCurrentMonth && (
                          <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                            Atual
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-cyan-600 dark:text-cyan-400">
                        {formatCurrency(data.faturamento)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(data.lucroEsperado)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground hidden sm:table-cell">
                        {data.paymentCount}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {/* Linha de Totais */}
                <TableRow className="border-t-2 border-border bg-muted/30 font-bold">
                  <TableCell className="font-bold text-foreground">
                    TOTAL GERAL
                  </TableCell>
                  <TableCell className="text-right font-bold text-cyan-600 dark:text-cyan-400">
                    {formatCurrency(totals.faturamento)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(totals.lucroEsperado)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-muted-foreground hidden sm:table-cell">
                    {totals.paymentCount}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
