import { AdminLayout } from '@/components/admin/AdminLayout';
import { SubscriptionsTable } from '@/components/admin/SubscriptionsTable';
import { SubscriptionsByPlan } from '@/components/admin/SubscriptionsByPlan';
import { useSubscriptions, usePayments } from '@/hooks/useAdminData';
import { useAdmin } from '@/hooks/useAdmin';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminSubscriptions = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
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

  return (
    <AdminLayout title="Assinaturas">
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todas Assinaturas</TabsTrigger>
          <TabsTrigger value="by-plan">Por Plano</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <SubscriptionsTable subscriptions={subscriptions || []} />
        </TabsContent>
        
        <TabsContent value="by-plan">
          <SubscriptionsByPlan 
            subscriptions={subscriptions || []} 
            payments={payments || []} 
          />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminSubscriptions;
