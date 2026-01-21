import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, MoreHorizontal, Check, X, Clock, Ban, AlertTriangle, Edit, Timer, Trash2 } from 'lucide-react';
import { Subscription, Profile, SubscriptionPlan, useUpdateSubscriptionStatus } from '@/hooks/useAdminData';
import { format, addDays, differenceInDays, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { SubscriptionDialog } from './SubscriptionDialog';
import { ExtendSubscriptionDialog } from './ExtendSubscriptionDialog';
import { DeleteSubscriptionDialog } from './DeleteSubscriptionDialog';

function getExpirationInfo(expiresAt: string | null, status: string) {
  if (!expiresAt || status !== 'active') return null;
  
  const expDate = new Date(expiresAt);
  const now = new Date();
  const daysLeft = differenceInDays(expDate, now);
  
  if (isPast(expDate)) {
    return { 
      text: 'Expirado',
      variant: 'destructive' as const,
      urgent: true
    };
  }
  
  if (daysLeft <= 3) {
    return { 
      text: `${daysLeft} dia${daysLeft !== 1 ? 's' : ''}`,
      variant: 'outline' as const,
      urgent: true
    };
  }
  
  if (daysLeft <= 7) {
    return { 
      text: `${daysLeft} dias`,
      variant: 'secondary' as const,
      urgent: false
    };
  }
  
  return { 
    text: `${daysLeft} dias`,
    variant: 'secondary' as const,
    urgent: false
  };
}

interface SubscriptionsTableProps {
  subscriptions: Subscription[];
  profiles: Profile[];
  plans: SubscriptionPlan[];
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pendente', variant: 'secondary' },
  active: { label: 'Ativo', variant: 'default' },
  expired: { label: 'Expirado', variant: 'destructive' },
  cancelled: { label: 'Cancelado', variant: 'outline' },
};

export function SubscriptionsTable({ subscriptions, profiles, plans }: SubscriptionsTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [extendingSubscription, setExtendingSubscription] = useState<Subscription | null>(null);
  const [deletingSubscription, setDeletingSubscription] = useState<Subscription | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const updateStatusMutation = useUpdateSubscriptionStatus();

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = 
      sub.profiles?.email?.toLowerCase().includes(search.toLowerCase()) ||
      sub.subscription_plans?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, status: string, durationDays?: number) => {
    const expiresAt = durationDays 
      ? addDays(new Date(), durationDays).toISOString() 
      : undefined;
    updateStatusMutation.mutate({ id, status, expiresAt });
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSubscription(null);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por email ou plano..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="expired">Expirado</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Tempo Restante</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Nenhuma assinatura encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubscriptions.map((sub) => {
                  const config = statusConfig[sub.status];
                  const expirationInfo = getExpirationInfo(sub.expires_at, sub.status);
                  return (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">
                        {sub.profiles?.email || '-'}
                      </TableCell>
                      <TableCell>{sub.subscription_plans?.name || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </TableCell>
                      <TableCell>
                        {sub.starts_at 
                          ? format(new Date(sub.starts_at), 'dd/MM/yyyy', { locale: ptBR })
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {sub.expires_at 
                          ? format(new Date(sub.expires_at), 'dd/MM/yyyy', { locale: ptBR })
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {expirationInfo ? (
                          <Badge 
                            variant={expirationInfo.variant}
                            className={expirationInfo.urgent ? 'animate-pulse' : ''}
                          >
                            {expirationInfo.urgent && <AlertTriangle className="h-3 w-3 mr-1" />}
                            {expirationInfo.text}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(sub)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setExtendingSubscription(sub)}>
                              <Timer className="h-4 w-4 mr-2" />
                              Estender
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(
                                sub.id, 
                                'active', 
                                sub.subscription_plans?.duration_days
                              )}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Ativar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(sub.id, 'pending')}
                            >
                              <Clock className="h-4 w-4 mr-2" />
                              Marcar como Pendente
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(sub.id, 'expired')}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Marcar como Expirado
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(sub.id, 'cancelled')}
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Cancelar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeletingSubscription(sub)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Dialog */}
      <SubscriptionDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        subscription={editingSubscription}
        profiles={profiles}
        plans={plans}
      />

      {/* Extend Dialog */}
      <ExtendSubscriptionDialog
        open={!!extendingSubscription}
        onOpenChange={(open) => !open && setExtendingSubscription(null)}
        subscription={extendingSubscription}
      />

      {/* Delete Dialog */}
      <DeleteSubscriptionDialog
        open={!!deletingSubscription}
        onOpenChange={(open) => !open && setDeletingSubscription(null)}
        subscription={deletingSubscription}
      />
    </>
  );
}
