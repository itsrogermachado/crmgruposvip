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
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 mb-4">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Integrações
            </span>
          </div>
          <h2 className="text-3xl md:text-[2.75rem] font-bold mb-4 text-foreground leading-tight">
            Conectado com as ferramentas{' '}
            <span className="text-primary">que você já usa</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
          {integrations.map((i) => (
            <div
              key={i.name}
              className="flex flex-col items-center p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-md transition-all duration-300 text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
                <i.icon className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">{i.name}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{i.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
