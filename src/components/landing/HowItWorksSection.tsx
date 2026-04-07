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
    <section id="como-funciona" className="py-24 md:py-40 scroll-mt-20 relative bg-background overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-6 font-bold text-xs uppercase tracking-widest text-primary">
            Processo Executivo
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-foreground tracking-tight leading-tight">
            Escala profissional em <span className="text-accent underline decoration-accent/30 underline-offset-8">3 movimentos.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Do zero ao faturamento profissional em menos de 5 minutos. Sem atritos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto relative">
          {/* Connector lines (desktop) */}
          <div className="hidden md:block absolute top-[4.5rem] left-[15%] right-[15%] h-1 bg-primary/5 rounded-full overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-accent/40 via-accent/20 to-accent/40" />
          </div>

          {steps.map((s) => (
            <div key={s.step} className="relative text-center group">
              <div className="relative z-10 inline-flex flex-col items-center">
                <div className="w-24 h-24 rounded-[2rem] bg-card border-2 border-primary/5 flex items-center justify-center mb-8 group-hover:border-accent/40 group-hover:shadow-[0_20px_40px_-10px_rgba(255,100,0,0.2)] transition-all duration-500 scale-100 group-hover:scale-110 group-hover:rotate-3 shadow-xl shadow-primary/5">
                  <s.icon className="w-10 h-10 text-primary group-hover:text-accent transition-colors" />
                </div>

                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-black text-lg shadow-lg rotate-12 group-hover:rotate-0 transition-transform">
                  {s.step}
                </div>

                <h3 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tighter">{s.title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed font-medium">
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
