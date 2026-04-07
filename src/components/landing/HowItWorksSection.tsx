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
    <section id="como-funciona" className="py-24 md:py-40 scroll-mt-20 relative bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-6">
            <span className="text-[11px] font-bold text-primary uppercase tracking-[0.2em]">
              Simples
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-[2.75rem] font-extrabold mb-4 text-primary leading-tight tracking-tight">
            Comece em{' '}
            <span className="relative inline-block">
              <span className="text-accent">3 passos simples</span>
              <span className="absolute -bottom-1.5 left-0 right-0 h-[4px] bg-accent/25 rounded-full" />
            </span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg font-medium">
            Do cadastro ao primeiro cliente em menos de 5 minutos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-accent/20 via-accent/40 to-accent/20" />

          {steps.map((s) => (
            <div key={s.step} className="relative text-center group">
              <div className="relative z-10 inline-flex flex-col items-center">
                {/* Step badge */}
                <div className="absolute -top-3 -right-3 z-20 w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center text-xs font-extrabold rotate-12 shadow-lg shadow-accent/30">
                  {s.step}
                </div>
                
                <div className="w-[80px] h-[80px] rounded-[2rem] bg-white border-2 border-primary/15 flex items-center justify-center mb-6 group-hover:border-accent/40 group-hover:shadow-xl group-hover:shadow-accent/10 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                  <s.icon className="w-8 h-8 text-primary" />
                </div>

                <h3 className="font-heading text-lg font-extrabold text-primary mb-2 uppercase tracking-tight">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[260px] font-medium">
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
