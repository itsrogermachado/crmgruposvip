import { AdminLayout } from '@/components/admin/AdminLayout';
import { PaymentsTable } from '@/components/admin/PaymentsTable';
import { usePayments } from '@/hooks/useAdminData';
import { useAdmin } from '@/hooks/useAdmin';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const AdminPayments = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { data: payments, isLoading: paymentsLoading } = usePayments();

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, adminLoading, navigate]);

  if (adminLoading || paymentsLoading) {
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
    <AdminLayout title="Pagamentos">
      <PaymentsTable payments={payments || []} />
    </AdminLayout>
  );
};

export default AdminPayments;
