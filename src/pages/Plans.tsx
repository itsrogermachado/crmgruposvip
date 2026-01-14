import { useNavigate } from 'react-router-dom';
import { usePublicPlans } from '@/hooks/usePublicPlans';
import { PlanCard } from '@/components/checkout/PlanCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Plans() {
  const navigate = useNavigate();
  const { data: plans, isLoading, error } = usePublicPlans();
  const { user } = useAuth();

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      // Store selected plan and redirect to auth
      sessionStorage.setItem('selectedPlanId', planId);
      navigate('/auth?redirect=/checkout');
    } else {
      navigate(`/checkout?planId=${planId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Planos de Assinatura</h1>
            <p className="text-sm text-muted-foreground">Escolha o melhor plano para você</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">Erro ao carregar planos. Tente novamente.</p>
          </div>
        ) : plans && plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onSelect={handleSelectPlan}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum plano disponível no momento.</p>
          </div>
        )}
      </main>
    </div>
  );
}
