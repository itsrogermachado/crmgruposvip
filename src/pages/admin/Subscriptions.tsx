import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { SubscriptionsTable } from '@/components/admin/SubscriptionsTable';
import { SubscriptionsByPlan } from '@/components/admin/SubscriptionsByPlan';
import { SubscriptionDialog } from '@/components/admin/SubscriptionDialog';
import { useSubscriptions, usePayments, useProfiles, useSubscriptionPlans } from '@/hooks/useAdminData';
import { useAdmin } from '@/hooks/useAdmin';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const AdminSubscriptions = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { data: subscriptions, isLoading: subsLoading } = useSubscriptions();
  const { data: payments, isLoading: paymentsLoading } = usePayments();
  const { data: profiles, isLoading: profilesLoading } = useProfiles();
  const { data: plans, isLoading: plansLoading } = useSubscriptionPlans();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, adminLoading, navigate]);

  const isLoading = adminLoading || subsLoading || paymentsLoading || profilesLoading || plansLoading;

  if (isLoading) {
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
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Assinatura
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Todas Assinaturas</TabsTrigger>
            <TabsTrigger value="by-plan">Por Plano</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <SubscriptionsTable 
              subscriptions={subscriptions || []} 
              profiles={profiles || []}
              plans={plans || []}
            />
          </TabsContent>
          
          <TabsContent value="by-plan">
            <SubscriptionsByPlan 
              subscriptions={subscriptions || []} 
              payments={payments || []} 
            />
          </TabsContent>
        </Tabs>

        {/* Create Dialog */}
        <SubscriptionDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          subscription={null}
          profiles={profiles || []}
          plans={plans || []}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminSubscriptions;
