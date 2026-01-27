import { Monitor, Smartphone } from 'lucide-react';

export function DemoSection() {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Veja o CRM Grupos VIP{' '}
            <span className="text-primary">em ação</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Interface intuitiva projetada para gestores de grupos VIP
          </p>
        </div>

        {/* Demo Preview */}
        <div className="relative max-w-5xl mx-auto">
          {/* Desktop Mockup */}
          <div className="relative bg-card rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
            {/* Browser Bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 bg-background rounded-lg text-xs text-muted-foreground">
                  crmgruposvip.lovable.app
                </div>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="p-6 md:p-8 bg-gradient-to-br from-background to-muted/20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Membros Ativos', value: '147' },
                  { label: 'Faturamento', value: 'R$ 22.050' },
                  { label: 'A Vencer', value: '12' },
                  { label: 'Renovações', value: '94%' },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 rounded-xl bg-card border border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-lg md:text-xl font-bold text-primary">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
                <div className="p-4 border-b border-border/50 flex items-center justify-between">
                  <span className="font-medium">Membros Recentes</span>
                  <span className="text-xs text-muted-foreground">Últimos 5</span>
                </div>
                <div className="divide-y divide-border/50">
                  {['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Oliveira'].map((name) => (
                    <div key={name} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                          {name.charAt(0)}
                        </div>
                        <span className="text-sm">{name}</span>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-600">
                        Ativo
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating Labels */}
          <div className="hidden md:flex absolute -left-16 top-1/3 items-center gap-2 px-3 py-2 bg-card border border-border/50 rounded-lg shadow-lg animate-fade-in">
            <Monitor className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Desktop</span>
          </div>
          
          <div className="hidden md:flex absolute -right-16 top-2/3 items-center gap-2 px-3 py-2 bg-card border border-border/50 rounded-lg shadow-lg animate-fade-in">
            <Smartphone className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Mobile</span>
          </div>
        </div>

        {/* Caption */}
        <p className="text-center text-muted-foreground mt-8 max-w-xl mx-auto">
          Dashboard completo com visão geral do seu negócio, controle de membros e 
          acompanhamento financeiro em tempo real.
        </p>
      </div>
    </section>
  );
}
