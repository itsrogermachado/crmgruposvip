import { AdminLayout } from '@/components/admin/AdminLayout';
import { PlansManager } from '@/components/admin/PlansManager';
import { useSubscriptionPlans } from '@/hooks/useAdminData';
import { useAdmin } from '@/hooks/useAdmin';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const AdminPlans = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { data: plans, isLoading: plansLoading } = useSubscriptionPlans();

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, adminLoading, navigate]);

  if (adminLoading || plansLoading) {
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
    <AdminLayout title="Planos">
      <PlansManager plans={plans || []} />
    </AdminLayout>
  );
};

export default AdminPlans;
