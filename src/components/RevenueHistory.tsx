import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { parseBRDate } from '@/lib/dateUtils';
import { Client } from '@/types/client';

interface RevenueHistoryProps {
  clients: Client[];
}

interface MonthlyData {
  month: number;
  year: number;
  monthName: string;
  faturamento: number;
  lucroEsperado: number;
  clientCount: number;
}

export function RevenueHistory({ clients }: RevenueHistoryProps) {
  const monthlyData = useMemo(() => {
    const dataByMonth: Record<string, MonthlyData> = {};

    clients.forEach((client) => {
      const dataVenc = parseBRDate(client.dataVencimento);
      if (!dataVenc) return;

      const month = dataVenc.getMonth();
      const year = dataVenc.getFullYear();
      const key = `${year}-${month}`;

      if (!dataByMonth[key]) {
        const monthName = dataVenc.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        dataByMonth[key] = {
          month,
          year,
          monthName: monthName.charAt(0).toUpperCase() + monthName.slice(1),
          faturamento: 0,
          lucroEsperado: 0,
          clientCount: 0,
        };
      }

      dataByMonth[key].faturamento += client.preco;
      dataByMonth[key].clientCount += 1;

      // Lucro esperado: apenas clientes Ativos ou Próximos
      if (client.status === 'Ativo' || client.status === 'Próximo') {
        dataByMonth[key].lucroEsperado += client.preco;
      }
    });

    // Ordenar por data (mais recente primeiro)
    return Object.values(dataByMonth).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  }, [clients]);

  const totals = useMemo(() => {
    return monthlyData.reduce(
      (acc, data) => ({
        faturamento: acc.faturamento + data.faturamento,
        lucroEsperado: acc.lucroEsperado + data.lucroEsperado,
        clientCount: acc.clientCount + data.clientCount,
      }),
      { faturamento: 0, lucroEsperado: 0, clientCount: 0 }
    );
  }, [monthlyData]);

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  // Identificar o mês atual
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  if (monthlyData.length === 0) {
    return (
      <div className="px-4 md:px-6 lg:px-8 mt-6">
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-primary" />
              Histórico Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              Nenhum dado disponível ainda.
            </p>
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
            Histórico Financeiro
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
                    Clientes
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
                        {data.clientCount}
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
                    {totals.clientCount}
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
