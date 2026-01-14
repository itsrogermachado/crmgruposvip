import { AdminLayout } from '@/components/admin/AdminLayout';
import { SubscriptionsTable } from '@/components/admin/SubscriptionsTable';
import { useSubscriptions } from '@/hooks/useAdminData';
import { useAdmin } from '@/hooks/useAdmin';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const AdminSubscriptions = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { data: subscriptions, isLoading: subsLoading } = useSubscriptions();

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, adminLoading, navigate]);

  if (adminLoading || subsLoading) {
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
      <SubscriptionsTable subscriptions={subscriptions || []} />
    </AdminLayout>
  );
};

export default AdminSubscriptions;
