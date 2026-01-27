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
      <section id="planos" className="py-20 md:py-28 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  // Ordenar: Mensal, Trimestral, Anual
  const sortedPlans = [...(plans || [])].sort((a, b) => a.duration_days - b.duration_days);

  // Identificar o plano anual (maior duração)
  const annualPlanId = sortedPlans.length > 0 
    ? sortedPlans.reduce((max, p) => p.duration_days > max.duration_days ? p : max).id 
    : null;

  return (
    <section id="planos" className="py-20 md:py-28 bg-muted/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Escolha o plano{' '}
            <span className="text-primary">ideal para você</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Todos os planos incluem 7 dias de teste grátis
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
                className={`relative p-6 md:p-8 rounded-2xl border transition-all ${
                  isPopular 
                    ? 'bg-gradient-to-br from-primary/10 via-card to-primary/5 border-primary/30 shadow-xl shadow-primary/10 scale-105' 
                    : 'bg-card border-border/50 hover:border-primary/20'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold flex items-center gap-1.5 shadow-lg">
                    <Flame className="w-4 h-4" />
                    Mais Popular
                  </div>
                )}

                {/* Plan Name */}
                <h3 className="text-xl font-bold text-center mb-2 mt-2">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">{priceFormatted}</span>
                  <span className="text-muted-foreground">{periodLabel}</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link to="/auth">
                  <Button 
                    className={`w-full font-semibold ${
                      isPopular 
                        ? 'bg-gradient-to-r from-primary to-primary/80 shadow-lg' 
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

        {/* Trial Badge */}
        <p className="text-center text-muted-foreground mt-8 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          7 dias grátis para testar • Sem cartão de crédito
        </p>
      </div>
    </section>
  );
}
