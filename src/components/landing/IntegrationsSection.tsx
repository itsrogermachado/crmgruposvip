import { MessageCircle, Smartphone, FileSpreadsheet, CreditCard, Globe, Lock, Crown } from 'lucide-react';

const integrations = [
  { icon: MessageCircle, name: 'WhatsApp', desc: 'Lembretes automáticos', angle: 0 },
  { icon: FileSpreadsheet, name: 'Excel', desc: 'Exportação de dados', angle: 60 },
  { icon: CreditCard, name: 'PIX', desc: 'Pagamentos instantâneos', angle: 120 },
  { icon: Smartphone, name: 'Mobile', desc: '100% responsivo', angle: 180 },
  { icon: Globe, name: 'Telegram', desc: 'Grupos e canais', angle: 240 },
  { icon: Lock, name: 'Segurança', desc: 'Dados criptografados', angle: 300 },
];

export function IntegrationsSection() {
  return (
    <section className="py-24 md:py-40 bg-[#FAFAFA] relative overflow-hidden">
      {/* Radial gradient bg */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(24_95%_53%/0.04),transparent_70%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-6">
            <span className="text-[11px] font-bold text-primary uppercase tracking-[0.2em]">
              Integrações
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-[2.75rem] font-extrabold mb-4 text-primary leading-tight tracking-tight">
            Conectado com as ferramentas{' '}
            <span className="relative inline-block">
              <span className="text-accent">que você já usa</span>
              <span className="absolute -bottom-1.5 left-0 right-0 h-[4px] bg-accent/25 rounded-full" />
            </span>
          </h2>
        </div>

        {/* Orbital / Hub layout */}
        <div className="relative max-w-xl mx-auto">
          {/* Center Hub */}
          <div className="flex items-center justify-center mb-8 md:mb-0 md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-20">
            <div className="w-20 h-20 rounded-2xl bg-primary shadow-2xl shadow-primary/30 flex items-center justify-center">
              <Crown className="w-9 h-9 text-white" />
            </div>
          </div>

          {/* Mobile: grid layout, Desktop: orbital */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:hidden">
            {integrations.map((i) => (
              <div
                key={i.name}
                className="flex flex-col items-center p-5 rounded-2xl bg-white border border-primary/10 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10 transition-all duration-500 text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                  <i.icon className="w-6 h-6 text-accent" />
                </div>
                <p className="text-xs font-extrabold text-primary uppercase tracking-wider">{i.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{i.desc}</p>
              </div>
            ))}
          </div>

          {/* Desktop: orbital positions */}
          <div className="hidden md:block h-[420px]">
            {integrations.map((i, idx) => {
              const positions = [
                'top-0 left-1/2 -translate-x-1/2',
                'top-[15%] right-0',
                'bottom-[15%] right-0',
                'bottom-0 left-1/2 -translate-x-1/2',
                'bottom-[15%] left-0',
                'top-[15%] left-0',
              ];
              return (
                <div
                  key={i.name}
                  className={`absolute ${positions[idx]} flex flex-col items-center p-5 rounded-2xl bg-white border border-primary/10 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/10 transition-all duration-500 group cursor-default w-[140px]`}
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-2 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                    <i.icon className="w-6 h-6 text-accent" />
                  </div>
                  <p className="text-xs font-extrabold text-primary uppercase tracking-wider">{i.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{i.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
