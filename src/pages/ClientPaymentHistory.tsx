import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useClientPaymentHistory, PeriodFilter } from '@/hooks/useClientPaymentHistory';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Loader2, CalendarIcon, Receipt, DollarSign, User, FileImage } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  const numericValue = Number(dateStr);
  if (!isNaN(numericValue) && numericValue > 40000 && numericValue < 60000) {
    const excelEpoch = new Date(1899, 11, 30);
    const result = new Date(excelEpoch.getTime() + numericValue * 24 * 60 * 60 * 1000);
    return isValid(result) ? result : null;
  }
  
  if (dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/').map(Number);
    if (day && month && year) {
      const result = new Date(year, month - 1, day);
      return isValid(result) ? result : null;
    }
  }
  
  const isoDate = parseISO(dateStr);
  return isValid(isoDate) ? isoDate : null;
}

function formatDateDisplay(dateStr: string): string {
  const date = parseDate(dateStr);
  if (!date) return dateStr;
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

const statusColors: Record<string, string> = {
  Ativo: 'bg-green-500/10 text-green-500 border-green-500/20',
  Vencido: 'bg-red-500/10 text-red-500 border-red-500/20',
  Próximo: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
};

const periodOptions: { value: PeriodFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: '3m', label: '3 meses' },
  { value: '6m', label: '6 meses' },
  { value: '12m', label: '12 meses' },
  { value: 'custom', label: 'Personalizado' },
];

export default function ClientPaymentHistory() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [comprovanteUrl, setComprovanteUrl] = useState<string | null>(null);

  const {
    client,
    payments,
    loading,
    totals,
    periodFilter,
    setPeriodFilter,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
  } = useClientPaymentHistory(clientId || '');

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground mb-4">
              Cliente não encontrado.
            </p>
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background animated-bg dark:animated-bg animated-bg-light">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Histórico de Pagamentos</h1>
              <p className="text-sm text-muted-foreground">
                Visualize todos os pagamentos do cliente
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Client Info Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-primary" />
              Informações do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{client.nome}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Plano</p>
                <p className="font-medium">{client.plano}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor do Plano</p>
                <p className="font-medium">{formatCurrency(client.preco)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={cn('mt-1', statusColors[client.status] || '')}>
                  {client.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Filtrar por Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {periodOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={periodFilter === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPeriodFilter(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            {periodFilter === 'custom' && (
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-muted-foreground">Data Inicial</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-[200px] justify-start text-left font-normal',
                          !customStartDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customStartDate ? format(customStartDate, 'dd/MM/yyyy') : 'Selecione'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={customStartDate}
                        onSelect={setCustomStartDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-muted-foreground">Data Final</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-[200px] justify-start text-left font-normal',
                          !customEndDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customEndDate ? format(customEndDate, 'dd/MM/yyyy') : 'Selecione'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={customEndDate}
                        onSelect={setCustomEndDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total no Período</p>
                  <p className="text-2xl font-bold">{formatCurrency(totals.total)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-secondary/50">
                  <Receipt className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pagamentos</p>
                  <p className="text-2xl font-bold">{totals.count}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Receipt className="w-5 h-5 text-primary" />
              Pagamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Receipt className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum pagamento encontrado no período selecionado.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Observações</TableHead>
                      <TableHead className="text-center">Comprovante</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          {formatDateDisplay(payment.payment_date)}
                        </TableCell>
                        <TableCell>{formatCurrency(Number(payment.amount))}</TableCell>
                        <TableCell className="capitalize">
                          {payment.payment_method || 'PIX'}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {payment.notes || '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          {payment.comprovante_url ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setComprovanteUrl(payment.comprovante_url || null)}
                            >
                              <FileImage className="w-4 h-4" />
                            </Button>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Comprovante Dialog */}
      <Dialog open={!!comprovanteUrl} onOpenChange={() => setComprovanteUrl(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Comprovante de Pagamento</DialogTitle>
          </DialogHeader>
          {comprovanteUrl && (
            <div className="flex justify-center">
              <img
                src={comprovanteUrl}
                alt="Comprovante"
                className="max-w-full max-h-[60vh] object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
