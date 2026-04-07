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
      <section id="planos" className="py-24 md:py-40 scroll-mt-20">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </section>
    );
  }

  const sortedPlans = [...(plans || [])].sort((a, b) => a.duration_days - b.duration_days);
  const annualPlanId =
    sortedPlans.length > 0
      ? sortedPlans.reduce((max, p) => (p.duration_days > max.duration_days ? p : max)).id
      : null;

  return (
    <section id="planos" className="py-24 md:py-40 scroll-mt-20 bg-[#FAFAFA]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-6">
            <span className="text-[11px] font-bold text-primary uppercase tracking-[0.2em]">
              Planos
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-[2.75rem] font-extrabold mb-4 text-primary leading-tight tracking-tight">
            Escolha o plano{' '}
            <span className="relative inline-block">
              <span className="text-accent">ideal para você</span>
              <span className="absolute -bottom-1.5 left-0 right-0 h-[4px] bg-accent/25 rounded-full" />
            </span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg font-medium">
            Todos os planos incluem 7 dias de teste grátis. Cancele quando quiser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto items-end">
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
                className={`relative rounded-2xl transition-all duration-500 ${
                  isPopular
                    ? 'bg-white border-2 border-accent/40 shadow-2xl shadow-accent/15 scale-[1.04] z-10'
                    : 'bg-white border border-primary/10 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-accent text-white text-[11px] font-extrabold uppercase tracking-[0.15em] flex items-center gap-1.5 shadow-lg shadow-accent/30">
                    <Flame className="w-3.5 h-3.5" />
                    Melhor Valor
                  </div>
                )}

                <div className={`p-7 ${isPopular ? 'py-10' : ''}`}>
                  <h3 className="font-heading text-lg font-extrabold text-center mb-1 text-primary mt-1 uppercase tracking-tight">
                    {plan.name}
                  </h3>

                  <div className="text-center mb-8 mt-5">
                    <span className="font-heading text-5xl font-extrabold text-primary tracking-tight">{priceFormatted}</span>
                    <span className="text-muted-foreground text-sm font-medium">{periodLabel}</span>
                  </div>

                  <ul className="space-y-3.5 mb-8">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-accent" />
                        </div>
                        <span className="text-sm text-muted-foreground font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/auth">
                    <Button
                      className={`w-full font-extrabold h-12 uppercase tracking-[0.1em] text-xs transition-all duration-300 ${
                        isPopular
                          ? 'bg-accent hover:bg-accent/90 shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/35 text-white border-0 hover:scale-[1.02]'
                          : 'border-primary/20 text-primary hover:bg-primary/5'
                      }`}
                      variant={isPopular ? 'default' : 'outline'}
                      size="lg"
                    >
                      Começar Grátis
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-muted-foreground mt-12 text-sm font-medium">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            7 dias grátis para testar • Sem cartão de crédito
          </span>
        </p>
      </div>
    </section>
  );
}
