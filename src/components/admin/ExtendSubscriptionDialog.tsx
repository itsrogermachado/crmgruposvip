import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Subscription, useExtendSubscription } from '@/hooks/useAdminData';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ExtendSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: Subscription | null;
}

const QUICK_OPTIONS = [
  { label: '+7 dias', days: 7 },
  { label: '+15 dias', days: 15 },
  { label: '+30 dias', days: 30 },
  { label: '+60 dias', days: 60 },
  { label: '+90 dias', days: 90 },
];

export function ExtendSubscriptionDialog({
  open,
  onOpenChange,
  subscription,
}: ExtendSubscriptionDialogProps) {
  const [customDays, setCustomDays] = useState('');
  const extendMutation = useExtendSubscription();

  if (!subscription) return null;

  const currentExpiry = subscription.expires_at
    ? new Date(subscription.expires_at)
    : new Date();

  const handleExtend = (days: number) => {
    extendMutation.mutate(
      { id: subscription.id, additionalDays: days },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  const handleCustomExtend = () => {
    const days = parseInt(customDays);
    if (days > 0) {
      handleExtend(days);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Estender Assinatura</DialogTitle>
          <DialogDescription>
            Usuário: {subscription.profiles?.email || 'N/A'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>
              Vencimento atual:{' '}
              <strong>
                {format(currentExpiry, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </strong>
            </p>
          </div>

          <div className="space-y-2">
            <Label>Opções rápidas</Label>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_OPTIONS.map((option) => (
                <Button
                  key={option.days}
                  variant="outline"
                  size="sm"
                  onClick={() => handleExtend(option.days)}
                  disabled={extendMutation.isPending}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customDays">Dias personalizados</Label>
            <div className="flex gap-2">
              <Input
                id="customDays"
                type="number"
                placeholder="Número de dias"
                value={customDays}
                onChange={(e) => setCustomDays(e.target.value)}
                min="1"
              />
              <Button
                onClick={handleCustomExtend}
                disabled={!customDays || parseInt(customDays) <= 0 || extendMutation.isPending}
              >
                Aplicar
              </Button>
            </div>
          </div>

          {customDays && parseInt(customDays) > 0 && (
            <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
              Novo vencimento:{' '}
              <strong>
                {format(
                  addDays(currentExpiry, parseInt(customDays)),
                  "dd 'de' MMMM 'de' yyyy",
                  { locale: ptBR }
                )}
              </strong>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
