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
          <Loader2 className="w-8 h-8 animate-spin text-[#9D67ED]" />
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
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#4630B1]/8 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[#9D67ED] font-medium text-sm uppercase tracking-wider mb-3">Planos</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Escolha o plano{' '}
            <span className="bg-gradient-to-r from-[#9D67ED] to-[#4630B1] bg-clip-text text-transparent">ideal para você</span>
          </h2>
          <p className="text-base text-white/50">
            Todos os planos incluem 7 dias de teste grátis
          </p>
        </div>

        {/* Plans Grid */}
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
                    ? 'bg-gradient-to-b from-[#7C3AED]/15 to-[#0A0818] border-2 border-[#7C3AED]/40 shadow-2xl shadow-[#7C3AED]/10 scale-[1.03]' 
                    : 'bg-white/[0.03] border border-white/[0.06] hover:border-[#7C3AED]/20'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#4630B1] text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-[#7C3AED]/30">
                    <Flame className="w-3.5 h-3.5" />
                    Mais Popular
                  </div>
                )}

                {/* Plan Name */}
                <h3 className="text-lg font-bold text-center mb-2 mt-2 text-white">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-white">{priceFormatted}</span>
                  <span className="text-white/40">{periodLabel}</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#7C3AED]/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-[#9D67ED]" />
                      </div>
                      <span className="text-sm text-white/60">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link to="/auth">
                  <Button 
                    className={`w-full font-semibold ${
                      isPopular 
                        ? 'bg-gradient-to-r from-[#7C3AED] to-[#4630B1] hover:from-[#6D28D9] hover:to-[#3B27A0] shadow-lg shadow-[#7C3AED]/25 border-0' 
                        : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
                    }`}
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
        <p className="text-center text-white/40 mt-10 flex items-center justify-center gap-2 text-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#28CA41]" />
          7 dias grátis para testar • Sem cartão de crédito
        </p>
      </div>
    </section>
  );
}
