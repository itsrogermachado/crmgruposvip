import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  Subscription,
  Profile,
  SubscriptionPlan,
  useCreateSubscription,
  useUpdateSubscription,
} from '@/hooks/useAdminData';

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription?: Subscription | null;
  profiles: Profile[];
  plans: SubscriptionPlan[];
}

export function SubscriptionDialog({
  open,
  onOpenChange,
  subscription,
  profiles,
  plans,
}: SubscriptionDialogProps) {
  const isEditing = !!subscription;
  
  const [userId, setUserId] = useState('');
  const [planId, setPlanId] = useState('');
  const [status, setStatus] = useState<string>('active');
  const [startsAt, setStartsAt] = useState<Date | undefined>(new Date());
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(undefined);
  const [autoCalculate, setAutoCalculate] = useState(true);
  const [userSearch, setUserSearch] = useState('');

  const createMutation = useCreateSubscription();
  const updateMutation = useUpdateSubscription();

  const filteredProfiles = profiles.filter(
    (p) =>
      p.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      p.full_name?.toLowerCase().includes(userSearch.toLowerCase())
  );

  useEffect(() => {
    if (subscription) {
      setUserId(subscription.user_id);
      setPlanId(subscription.plan_id);
      setStatus(subscription.status);
      setStartsAt(subscription.starts_at ? new Date(subscription.starts_at) : new Date());
      setExpiresAt(subscription.expires_at ? new Date(subscription.expires_at) : undefined);
      setAutoCalculate(false);
    } else {
      setUserId('');
      setPlanId('');
      setStatus('active');
      setStartsAt(new Date());
      setExpiresAt(undefined);
      setAutoCalculate(true);
    }
  }, [subscription, open]);

  useEffect(() => {
    if (autoCalculate && planId && startsAt) {
      const selectedPlan = plans.find((p) => p.id === planId);
      if (selectedPlan) {
        setExpiresAt(addDays(startsAt, selectedPlan.duration_days));
      }
    }
  }, [autoCalculate, planId, startsAt, plans]);

  const handleSubmit = () => {
    if (!userId || !planId) return;

    const data = {
      user_id: userId,
      plan_id: planId,
      status,
      starts_at: startsAt?.toISOString() || new Date().toISOString(),
      expires_at: expiresAt?.toISOString() || null,
    };

    if (isEditing && subscription) {
      updateMutation.mutate(
        { id: subscription.id, ...data },
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      createMutation.mutate(data, { onSuccess: () => onOpenChange(false) });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Assinatura' : 'Nova Assinatura'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* User Selection */}
          <div className="grid gap-2">
            <Label htmlFor="user">Usuário *</Label>
            {isEditing ? (
              <Input
                value={subscription?.profiles?.email || 'Usuário não encontrado'}
                disabled
              />
            ) : (
              <div className="space-y-2">
                <Input
                  placeholder="Buscar por email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
                <Select value={userId} onValueChange={setUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um usuário" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {filteredProfiles.map((profile) => (
                      <SelectItem key={profile.user_id} value={profile.user_id}>
                        {profile.email || profile.full_name || profile.user_id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Plan Selection */}
          <div className="grid gap-2">
            <Label htmlFor="plan">Plano *</Label>
            <Select value={planId} onValueChange={setPlanId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um plano" />
              </SelectTrigger>
              <SelectContent>
                {plans
                  .filter((p) => p.is_active)
                  .map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} - R$ {(plan.price_cents / 100).toFixed(2)} ({plan.duration_days} dias)
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Selection */}
          <div className="grid gap-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="expired">Expirado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Data de Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'justify-start text-left font-normal',
                      !startsAt && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startsAt ? format(startsAt, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startsAt}
                    onSelect={setStartsAt}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label>Data de Vencimento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'justify-start text-left font-normal',
                      !expiresAt && 'text-muted-foreground'
                    )}
                    disabled={autoCalculate}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiresAt ? format(expiresAt, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={expiresAt}
                    onSelect={setExpiresAt}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Auto Calculate Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="autoCalculate"
              checked={autoCalculate}
              onCheckedChange={(checked) => setAutoCalculate(!!checked)}
            />
            <Label htmlFor="autoCalculate" className="text-sm font-normal">
              Calcular vencimento automaticamente baseado na duração do plano
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !userId || !planId}>
            {isPending ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Criar Assinatura'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
