import { Link } from 'react-router-dom';
import { Check, Flame, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePublicPlans } from '@/hooks/usePublicPlans';

const features = [
  'Membros ilimitados',
  'Multi-grupos',
  'Lembretes automáticos',
  'Exportação Excel',
  'Relatórios completos',
  'Suporte via WhatsApp',
];

export function PricingSection() {
  const { data: plans, isLoading } = usePublicPlans();

  if (isLoading) {
    return (
      <section id="planos" className="py-24 md:py-32 scroll-mt-20">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  const sortedPlans = [...(plans || [])].sort((a, b) => a.duration_days - b.duration_days);
  const annualPlanId = sortedPlans.length > 0 
    ? sortedPlans.reduce((max, p) => p.duration_days > max.duration_days ? p : max).id 
    : null;

  return (
    <section id="planos" className="py-24 md:py-32 scroll-mt-20 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-primary font-medium text-sm uppercase tracking-wider mb-3">Planos</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Escolha o plano{' '}
            <span className="text-primary">ideal para você</span>
          </h2>
          <p className="text-base text-muted-foreground">
            Todos os planos incluem 7 dias de teste grátis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {sortedPlans.map((plan) => {
            const isPopular = plan.id === annualPlanId;
            const priceFormatted = (plan.price_cents / 100).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            });
            
            let periodLabel = '/mês';
            if (plan.duration_days >= 365) periodLabel = '/ano';
            else if (plan.duration_days >= 90) periodLabel = '/trimestre';

            return (
              <div
                key={plan.id}
                className={`relative p-7 rounded-2xl transition-all ${
                  isPopular 
                    ? 'bg-gradient-to-b from-primary/10 to-card border-2 border-primary/30 shadow-2xl shadow-primary/10 scale-[1.03]' 
                    : 'bg-card/50 border border-border/50 hover:border-primary/20'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                    <Flame className="w-3.5 h-3.5" />
                    Mais Popular
                  </div>
                )}

                <h3 className="text-lg font-bold text-center mb-2 mt-2 text-foreground">
                  {plan.name}
                </h3>

                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-foreground">{priceFormatted}</span>
                  <span className="text-muted-foreground">{periodLabel}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/auth">
                  <Button 
                    className={`w-full font-semibold ${
                      isPopular 
                        ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 border-0' 
                        : ''
                    }`}
                    variant={isPopular ? 'default' : 'outline'}
                    size="lg"
                  >
                    Começar Grátis
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        <p className="text-center text-muted-foreground mt-10 flex items-center justify-center gap-2 text-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          7 dias grátis para testar • Sem cartão de crédito
        </p>
      </div>
    </section>
  );
}
