import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatsCards } from '@/components/admin/StatsCards';
import { 
  useAdminStats, 
  useSubscriptions, 
  usePayments 
} from '@/hooks/useAdminData';
import { useAdmin } from '@/hooks/useAdmin';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const stats = useAdminStats();
  const { data: subscriptions, isLoading: subsLoading } = useSubscriptions();
  const { data: payments, isLoading: paymentsLoading } = usePayments();

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, adminLoading, navigate]);

  if (adminLoading || subsLoading || paymentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const recentSubscriptions = subscriptions?.slice(0, 5) || [];
  const recentPayments = payments?.slice(0, 5) || [];

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        <StatsCards
          totalUsers={stats.totalUsers}
          activeSubscriptions={stats.activeSubscriptions}
          totalRevenue={stats.totalRevenue}
          pendingPayments={stats.pendingPayments}
        />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Subscriptions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assinaturas Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {recentSubscriptions.length === 0 ? (
                <p className="text-muted-foreground text-sm">Nenhuma assinatura ainda</p>
              ) : (
                <div className="space-y-3">
                  {recentSubscriptions.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div>
                        <p className="font-medium text-sm">{sub.profiles?.email || 'Usuário'}</p>
                        <p className="text-xs text-muted-foreground">
                          {sub.subscription_plans?.name || 'Plano'}
                        </p>
                      </div>
                      <Badge variant={sub.status === 'active' ? 'default' : 'secondary'}>
                        {sub.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pagamentos Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {recentPayments.length === 0 ? (
                <p className="text-muted-foreground text-sm">Nenhum pagamento ainda</p>
              ) : (
                <div className="space-y-3">
                  {recentPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div>
                        <p className="font-medium text-sm">{payment.profiles?.email || 'Usuário'}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(payment.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{formatCurrency(payment.amount_cents)}</p>
                        <Badge variant={payment.status === 'paid' ? 'default' : 'secondary'} className="text-xs">
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
