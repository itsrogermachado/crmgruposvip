import { MessageCircle, Smartphone, FileSpreadsheet, CreditCard, Globe, Lock } from 'lucide-react';

const integrations = [
  { icon: MessageCircle, name: 'WhatsApp', desc: 'Lembretes automáticos' },
  { icon: FileSpreadsheet, name: 'Excel', desc: 'Exportação de dados' },
  { icon: CreditCard, name: 'PIX', desc: 'Pagamentos instantâneos' },
  { icon: Smartphone, name: 'Mobile', desc: '100% responsivo' },
  { icon: Globe, name: 'Telegram', desc: 'Grupos e canais' },
  { icon: Lock, name: 'Segurança', desc: 'Dados criptografados' },
];

export function IntegrationsSection() {
  return (
    <section className="py-24 md:py-32 bg-primary dark:bg-card text-white overflow-hidden relative">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,_var(--tw-gradient-stops))] from-accent/40 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6 font-bold text-xs uppercase tracking-widest">
            Ecossistema
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
            O hub central para <span className="text-accent underline decoration-accent/30 underline-offset-8">sua operação</span> escalar.
          </h2>
          <p className="text-lg opacity-70">
            Conectamos as ferramentas que você já usa para criar um fluxo de trabalho imbatível. 
            Mais automação, menos trabalho manual.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
          {integrations.map((i) => (
            <div
              key={i.name}
              className="flex flex-col items-center justify-center p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-accent/40 transition-all duration-500 group relative"
            >
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <i.icon className="w-8 h-8 text-white group-hover:text-accent transition-colors" />
              </div>
              <p className="text-base font-black uppercase tracking-tighter">{i.name}</p>
              <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest mt-1">{i.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-10 border-t border-white/10 inline-flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
           {/* These would be real corporate logos if we had them, using placeholders for now */}
           <span className="text-xl font-black tracking-tighter">STRIPE</span>
           <span className="text-xl font-black tracking-tighter">MERCADO PAGO</span>
           <span className="text-xl font-black tracking-tighter">PAGSMILE</span>
           <span className="text-xl font-black tracking-tighter">HOTMART</span>
        </div>
      </div>
    </section>
  );
}
