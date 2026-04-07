import { UserPlus, Settings, Rocket } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Crie sua conta',
    description: 'Cadastre-se em menos de 1 minuto. Sem cartão de crédito necessário.',
  },
  {
    icon: Settings,
    step: '02',
    title: 'Configure seu grupo',
    description: 'Adicione membros, defina planos e ative os lembretes automáticos.',
  },
  {
    icon: Rocket,
    step: '03',
    title: 'Comece a faturar',
    description: 'Gerencie pagamentos, acompanhe métricas e escale seu negócio.',
  },
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-24 md:py-32 scroll-mt-20 relative bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 mb-4">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Simples
            </span>
          </div>
          <h2 className="text-3xl md:text-[2.75rem] font-bold mb-4 text-foreground leading-tight">
            Comece em{' '}
            <span className="text-primary">3 passos simples</span>
          </h2>
          <p className="text-muted-foreground text-base">
            Do cadastro ao primeiro cliente em menos de 5 minutos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto relative">
          {/* Connector lines (desktop) */}
          <div className="hidden md:block absolute top-14 left-[20%] right-[20%] h-px bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20" />

          {steps.map((s) => (
            <div key={s.step} className="relative text-center group">
              <div className="relative z-10 inline-flex flex-col items-center">
                <div className="w-[72px] h-[72px] rounded-2xl bg-card border-2 border-primary/20 flex items-center justify-center mb-5 group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all duration-300">
                  <s.icon className="w-7 h-7 text-primary" />
                </div>

                <span className="text-xs font-bold text-primary/50 uppercase tracking-[0.2em] mb-2">
                  Passo {s.step}
                </span>
                <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[260px]">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
