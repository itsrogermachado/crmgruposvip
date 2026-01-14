import { useState, useEffect } from 'react';
import { Plus, Trash2, Receipt, CreditCard, Banknote, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ClientPayment, PaymentMethod } from '@/types/clientPayment';
import { useClientPayments } from '@/hooks/useClientPayments';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PaymentHistorySectionProps {
  clientId: string;
  clientName: string;
}

const paymentMethodLabels: Record<PaymentMethod, { label: string; icon: React.ElementType }> = {
  pix: { label: 'PIX', icon: CreditCard },
  dinheiro: { label: 'Dinheiro', icon: Banknote },
  cartao: { label: 'Cartão', icon: CreditCard },
  transferencia: { label: 'Transferência', icon: ArrowRightLeft },
};

export function PaymentHistorySection({ clientId, clientName }: PaymentHistorySectionProps) {
  const { payments, loading, fetchPayments, addPayment, deletePayment, getTotalPaid } = useClientPayments();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPayment, setNewPayment] = useState({
    amount: 0,
    payment_date: format(new Date(), 'dd/MM/yyyy'),
    payment_method: 'pix' as PaymentMethod,
    notes: '',
  });

  useEffect(() => {
    if (clientId) {
      fetchPayments(clientId);
    }
  }, [clientId, fetchPayments]);

  const handleAddPayment = async () => {
    if (newPayment.amount <= 0) return;

    await addPayment({
      client_id: clientId,
      amount: newPayment.amount,
      payment_date: newPayment.payment_date,
      payment_method: newPayment.payment_method,
      notes: newPayment.notes || undefined,
    });

    setNewPayment({
      amount: 0,
      payment_date: format(new Date(), 'dd/MM/yyyy'),
      payment_method: 'pix',
      notes: '',
    });
    setShowAddForm(false);
  };

  const formatCurrency = (value: number) => {
    return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Separator />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Histórico de Pagamentos</h3>
        </div>
        <div className="text-sm text-muted-foreground">
          Total: <span className="font-semibold text-foreground">{formatCurrency(getTotalPaid())}</span>
        </div>
      </div>

      {/* Payment List */}
      {payments.length > 0 ? (
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {payments.map((payment) => {
            const method = paymentMethodLabels[payment.payment_method as PaymentMethod] || paymentMethodLabels.pix;
            const Icon = method.icon;
            
            return (
              <div
                key={payment.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background rounded-md">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{formatCurrency(payment.amount)}</p>
                    <p className="text-xs text-muted-foreground">
                      {payment.payment_date} • {method.label}
                    </p>
                    {payment.notes && (
                      <p className="text-xs text-muted-foreground mt-1">{payment.notes}</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => deletePayment(payment.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          Nenhum pagamento registrado
        </p>
      )}

      {/* Add Payment Form */}
      {showAddForm ? (
        <div className="space-y-3 p-3 border rounded-lg">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Valor</Label>
              <Input
                type="number"
                step="0.01"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Método</Label>
              <Select
                value={newPayment.payment_method}
                onValueChange={(v) => setNewPayment({ ...newPayment, payment_method: v as PaymentMethod })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="cartao">Cartão</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Observação (opcional)</Label>
            <Input
              value={newPayment.notes}
              onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
              placeholder="Ex: Renovação mensal"
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
              Cancelar
            </Button>
            <Button size="sm" onClick={handleAddPayment} className="flex-1">
              Adicionar
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Registrar Pagamento
        </Button>
      )}
    </div>
  );
}
