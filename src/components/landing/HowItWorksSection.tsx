import { UserPlus, Settings, Rocket } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Crie sua conta',
    description: 'Cadastre-se em menos de 1 minuto. Sem cartão de crédito.',
  },
  {
    icon: Settings,
    step: '02',
    title: 'Configure seu grupo',
    description: 'Adicione seus membros e configure lembretes automáticos.',
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
    <section className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-muted/20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-primary font-medium text-sm uppercase tracking-wider mb-3">Simples</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Comece em{' '}
            <span className="text-primary">3 passos</span>
          </h2>
          <p className="text-base text-muted-foreground">
            Do cadastro ao primeiro cliente em menos de 5 minutos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((s, index) => (
            <div key={s.step} className="relative text-center group">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/30 to-primary/10" />
              )}
              
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <s.icon className="w-8 h-8 text-primary" />
                </div>
                
                <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">
                  Passo {s.step}
                </span>
                <h3 className="text-lg font-bold mt-2 mb-2 text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
