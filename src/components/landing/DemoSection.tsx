import { Monitor, Smartphone, CheckCircle2 } from 'lucide-react';

const features = [
  'Dashboard completo com métricas em tempo real',
  'Gestão de membros com status automático',
  'Histórico de pagamentos organizado',
  'Lembretes automáticos via WhatsApp',
];

export function DemoSection() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-muted/20" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <p className="text-primary font-medium text-sm uppercase tracking-wider mb-3">Como funciona</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Veja o CRM Grupos VIP{' '}
              <span className="text-primary">em ação</span>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Interface intuitiva projetada para gestores de grupos VIP. 
              Tudo o que você precisa em uma única tela.
            </p>
            
            <ul className="space-y-4">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl blur-xl" />
            <div className="relative bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 bg-background rounded-lg text-xs text-muted-foreground">
                    crmgruposvip.com
                  </div>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-background to-muted/20">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: 'Membros Ativos', value: '147' },
                    { label: 'Faturamento', value: 'R$ 22.050' },
                    { label: 'A Vencer', value: '12' },
                    { label: 'Renovações', value: '94%' },
                  ].map((stat) => (
                    <div key={stat.label} className="p-3 rounded-xl bg-card border border-border/50">
                      <p className="text-[10px] text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-sm font-bold text-primary">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
                  <div className="p-3 border-b border-border/50 flex items-center justify-between">
                    <span className="text-xs font-medium">Membros Recentes</span>
                    <span className="text-[10px] text-muted-foreground">Últimos 5</span>
                  </div>
                  <div className="divide-y divide-border/50">
                    {['João Silva', 'Maria Santos', 'Pedro Costa'].map((name) => (
                      <div key={name} className="p-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-medium text-primary">
                            {name.charAt(0)}
                          </div>
                          <span className="text-xs">{name}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                          Ativo
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:flex absolute -left-8 top-1/3 items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg shadow-xl">
              <Monitor className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium">Desktop</span>
            </div>
            
            <div className="hidden md:flex absolute -right-8 top-2/3 items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg shadow-xl">
              <Smartphone className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium">Mobile</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
