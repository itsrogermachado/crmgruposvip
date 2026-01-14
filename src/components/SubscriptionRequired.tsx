import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Lock, CreditCard, Clock, ShieldCheck, Database } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { Loader2 } from 'lucide-react';

interface SubscriptionRequiredProps {
  children: React.ReactNode;
}

export function SubscriptionRequired({ children }: SubscriptionRequiredProps) {
  const navigate = useNavigate();
  const { hasActiveSubscription, loading, subscription } = useSubscription();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (hasActiveSubscription) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Lock className="w-10 h-10 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Acesso Restrito
          </h1>
          <p className="text-muted-foreground">
            Para utilizar o CRM Grupos VIP, você precisa de uma assinatura ativa.
          </p>
        </div>

        {/* Data preservation message */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-left">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium text-green-700 dark:text-green-400">
                Seus dados estão seguros!
              </p>
              <p className="text-sm text-green-600/80 dark:text-green-400/80 mt-1">
                Todos os seus clientes, grupos e histórico de pagamentos continuam salvos. 
                Basta renovar sua assinatura para retomar o acesso normalmente.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border space-y-4">
          <div className="flex items-center gap-3 text-left">
            <CreditCard className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">Escolha um plano</p>
              <p className="text-sm text-muted-foreground">
                Selecione o plano ideal para seu negócio
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-left">
            <Clock className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">Acesso imediato</p>
              <p className="text-sm text-muted-foreground">
                Após o pagamento, seu acesso é liberado automaticamente
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-left">
            <Database className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">Dados preservados</p>
              <p className="text-sm text-muted-foreground">
                Nenhuma informação é perdida quando a assinatura vence
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => navigate('/plans')} 
          size="lg" 
          className="w-full"
        >
          Ver Planos Disponíveis
        </Button>

        <p className="text-sm text-muted-foreground">
          Já realizou o pagamento? Aguarde alguns minutos para a confirmação.
        </p>
      </div>
    </div>
  );
}
