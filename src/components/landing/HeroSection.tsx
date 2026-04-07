import { Link } from 'react-router-dom';
import { ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative pt-28 md:pt-36 pb-20 md:pb-28 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-background to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-primary/[0.06] rounded-full blur-[120px]" />
      
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--foreground) / 0.15) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.15) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Content */}
          <div className="lg:col-span-6 text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-8 animate-fade-in shadow-sm">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">
                7 Dias Grátis • Sem Compromisso
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-display leading-[1.05] mb-6 animate-fade-in tracking-tight text-foreground">
              Pare de perder membros por <br className="hidden xl:block" />
              <span className="text-accent underline decoration-accent/30 underline-offset-8">esquecimento.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-22px text-muted-foreground mb-10 animate-fade-in leading-relaxed max-w-xl">
              Automatize suas renovações no WhatsApp e Telegram. O único CRM feito para quem vive de grupos VIP.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 animate-fade-in">
              <Link to="/auth" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-lg h-14 px-10 font-bold bg-accent hover:bg-accent/90 text-white shadow-2xl shadow-accent/20 transition-all hover:scale-[1.03] active:scale-95"
                >
                  Teste Grátis Agora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-lg h-14 px-8 font-semibold border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-colors"
                onClick={() =>
                  document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                <Play className="w-4 h-4 mr-2 fill-primary" />
                Ver Demonstração
              </Button>
            </div>

            {/* Trust pills */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-muted-foreground animate-fade-in opacity-80">
              {['Configuração em 2 min', 'Suporte VIP via WhatsApp', '+50.000 cobranças feitas'].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Dashboard Preview */}
          <div className="lg:col-span-6 relative animate-fade-in lg:translate-x-12">
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-tr from-accent/20 via-primary/10 to-transparent blur-xl" />
            
            <div className="relative bg-card rounded-3xl border-2 border-primary/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] overflow-hidden scale-105 lg:scale-110">
              {/* Browser bar */}
              <div className="flex items-center gap-3 px-6 py-4 bg-secondary/50 border-b border-primary/10">
                <div className="flex gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-400/40" />
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-400/40" />
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-400/40" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-8 py-1.5 bg-background/50 rounded-full text-[11px] text-muted-foreground font-semibold tracking-wide border border-primary/5">
                    dashboard.crmgruposvip.com
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 md:p-8 space-y-8">
                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Renovações Hoje</p>
                    <div className="flex items-end gap-2">
                      <p className="text-3xl font-black text-primary">R$ 4.280</p>
                      <span className="text-xs font-bold text-emerald-500 mb-1">+18%</span>
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-accent/5 border border-accent/10">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Taxa de Conversão</p>
                    <div className="flex items-end gap-2">
                      <p className="text-3xl font-black text-accent">96.4%</p>
                      <span className="text-xs font-bold text-emerald-500 mb-1">↑ 2.4%</span>
                    </div>
                  </div>
                </div>

                {/* Main View */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground">Próximos Vencimentos</h3>
                    <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-accent" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { name: 'Ricardo Oliveira', plan: 'Trimestral', status: 'Cobrindo' },
                      { name: 'Juliana Mendes', plan: 'Anual', status: 'Pago' },
                      { name: 'Marcos Silva', plan: 'Mensal', status: 'Pendente' },
                    ].map((m, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-primary/5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                            {m.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">{m.name}</p>
                            <p className="text-[10px] text-muted-foreground">{m.plan}</p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                          m.status === 'Pago' ? 'bg-emerald-500/10 text-emerald-600' : 
                          m.status === 'Cobrindo' ? 'bg-amber-500/10 text-amber-600' : 
                          'bg-red-500/10 text-red-600'
                        }`}>
                          {m.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
