import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { Subscription, Payment } from '@/hooks/useAdminData';
import { format, differenceInDays, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SubscriptionsByPlanProps {
  subscriptions: Subscription[];
  payments: Payment[];
}

interface PlanGroup {
  planId: string;
  planName: string;
  planPrice: number;
  activeSubscribers: Subscription[];
  totalRevenue: number;
}

function getExpirationInfo(expiresAt: string | null) {
  if (!expiresAt) return null;
  
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
  
  return { 
    text: `${daysLeft} dias`,
    variant: 'secondary' as const,
    urgent: false
  };
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
}

export function SubscriptionsByPlan({ subscriptions, payments }: SubscriptionsByPlanProps) {
  const [openPlans, setOpenPlans] = useState<Record<string, boolean>>({});

  const planGroups = useMemo(() => {
    const groups: Record<string, PlanGroup> = {};

    // Agrupar assinaturas ativas por plano
    subscriptions
      .filter(sub => sub.status === 'active')
      .forEach(sub => {
        const planId = sub.plan_id;
        if (!groups[planId]) {
          groups[planId] = {
            planId,
            planName: sub.subscription_plans?.name || 'Plano Desconhecido',
            planPrice: sub.subscription_plans?.price_cents || 0,
            activeSubscribers: [],
            totalRevenue: 0,
          };
        }
        groups[planId].activeSubscribers.push(sub);
      });

    // Calcular receita por plano baseado nos pagamentos
    payments
      .filter(p => p.status === 'paid')
      .forEach(payment => {
        const subscription = subscriptions.find(s => s.id === payment.subscription_id);
        if (subscription && groups[subscription.plan_id]) {
          groups[subscription.plan_id].totalRevenue += payment.amount_cents;
        }
      });

    return Object.values(groups).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [subscriptions, payments]);

  const totalRevenue = useMemo(() => {
    return planGroups.reduce((acc, group) => acc + group.totalRevenue, 0);
  }, [planGroups]);

  const totalSubscribers = useMemo(() => {
    return planGroups.reduce((acc, group) => acc + group.activeSubscribers.length, 0);
  }, [planGroups]);

  const togglePlan = (planId: string) => {
    setOpenPlans(prev => ({ ...prev, [planId]: !prev[planId] }));
  };

  return (
    <div className="space-y-6">
      {/* Cards resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Assinantes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubscribers}</div>
            <p className="text-xs text-muted-foreground">
              em {planGroups.length} plano{planGroups.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              de todos os pagamentos confirmados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{planGroups.length}</div>
            <p className="text-xs text-muted-foreground">
              com assinantes ativos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de planos com assinantes */}
      <div className="space-y-4">
        {planGroups.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhuma assinatura ativa encontrada
            </CardContent>
          </Card>
        ) : (
          planGroups.map(group => (
            <Card key={group.planId}>
              <Collapsible
                open={openPlans[group.planId]}
                onOpenChange={() => togglePlan(group.planId)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {openPlans[group.planId] ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                        <div>
                          <CardTitle className="text-lg">
                            {group.planName}
                            <span className="ml-2 text-sm font-normal text-muted-foreground">
                              {formatCurrency(group.planPrice)}/período
                            </span>
                          </CardTitle>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-right">
                          <p className="font-medium">{group.activeSubscribers.length} assinante{group.activeSubscribers.length !== 1 ? 's' : ''}</p>
                          <p className="text-muted-foreground">ativos</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">{formatCurrency(group.totalRevenue)}</p>
                          <p className="text-muted-foreground">receita</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Início</TableHead>
                          <TableHead>Vencimento</TableHead>
                          <TableHead>Tempo Restante</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.activeSubscribers.map(sub => {
                          const expirationInfo = getExpirationInfo(sub.expires_at);
                          return (
                            <TableRow key={sub.id}>
                              <TableCell className="font-medium">
                                {sub.profiles?.email || '-'}
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
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
