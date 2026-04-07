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
  const annualPlanId =
    sortedPlans.length > 0
      ? sortedPlans.reduce((max, p) => (p.duration_days > max.duration_days ? p : max)).id
      : null;

  return (
    <section id="planos" className="py-24 md:py-40 scroll-mt-20 bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <span className="text-sm font-bold text-accent uppercase tracking-widest">
              Investimento
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-foreground tracking-tight">
            Planos que <span className="text-primary italic">escalam</span> com você.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comece grátis por 7 dias. Sem pegadinhas, sem contratos de fidelidade. Escolha a melhor opção para sua operação.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {sortedPlans.map((plan) => {
            const isPopular = plan.id === annualPlanId;
            const priceFormatted = (plan.price_cents / 100).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            });

            let periodLabel = ' /mês';
            if (plan.duration_days >= 365) periodLabel = ' /ano';
            else if (plan.duration_days >= 90) periodLabel = ' /trim';

            return (
              <div
                key={plan.id}
                className={`relative rounded-[2.5rem] transition-all duration-500 overflow-hidden group ${
                  isPopular
                    ? 'bg-primary text-white shadow-[0_40px_80px_-15px_rgba(30,58,138,0.3)] scale-105 z-20 py-12 md:py-16'
                    : 'bg-card border-2 border-primary/5 hover:border-primary/20 shadow-xl hover:shadow-2xl py-10 md:py-12 translate-y-2 hover:-translate-y-0'
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                    <Flame className="w-32 h-32 rotate-12" />
                  </div>
                )}

                <div className="px-8 md:px-12 relative z-10">
                  {isPopular && (
                    <div className="inline-block px-4 py-1 rounded-full bg-accent text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                      Mais Escolhido
                    </div>
                  )}

                  <h3 className={`text-2xl font-black mb-2 ${isPopular ? 'text-white' : 'text-foreground'}`}>
                    {plan.name}
                  </h3>
                  
                  <div className="mb-8 items-baseline gap-1 flex">
                    <span className={`text-5xl font-black ${isPopular ? 'text-white' : 'text-primary'}`}>
                      {priceFormatted}
                    </span>
                    <span className={`text-sm font-bold opacity-60`}>{periodLabel}</span>
                  </div>

                  <div className={`h-px w-full mb-8 ${isPopular ? 'bg-white/20' : 'bg-primary/10'}`} />

                  <ul className="space-y-4 mb-10">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isPopular ? 'bg-white/20' : 'bg-primary/10'
                        }`}>
                          <Check className={`w-3 h-3 ${isPopular ? 'text-white' : 'text-primary'}`} />
                        </div>
                        <span className={`text-sm font-medium ${isPopular ? 'text-white/80' : 'text-muted-foreground'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/auth" className="block">
                    <Button
                      size="lg"
                      className={`w-full h-14 rounded-2xl text-lg font-black transition-all ${
                        isPopular
                          ? 'bg-accent hover:bg-accent/90 text-white shadow-xl shadow-black/20'
                          : 'bg-primary/5 hover:bg-primary/10 text-primary border-2 border-primary/20'
                      }`}
                    >
                      {isPopular ? 'Quero Escalar Agora' : 'Começar Teste'}
                    </Button>
                  </Link>

                  <p className={`text-center mt-6 text-[10px] font-bold uppercase tracking-widest opacity-40`}>
                    Cancele a qualquer momento
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>

        <p className="text-center text-muted-foreground mt-10 text-sm">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            7 dias grátis para testar • Sem cartão de crédito
          </span>
        </p>
      </div>
    </section>
  );
}
