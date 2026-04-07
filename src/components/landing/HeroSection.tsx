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
        <div className="max-w-4xl mx-auto text-center mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-8 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">
              Teste grátis por 7 dias • Sem cartão de crédito
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-[3.5rem] lg:text-[4rem] font-bold leading-[1.1] mb-6 animate-fade-in tracking-tight">
            <span className="text-foreground">O CRM que </span>
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              transforma
            </span>
            <br className="hidden sm:block" />
            <span className="text-foreground"> seu Grupo VIP em máquina de receita</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in leading-relaxed">
            Automatize cobranças, reduza a inadimplência e aumente sua taxa de renovação em até 40%.
            A plataforma que gestores de grupos VIP confiam.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-fade-in">
            <Link to="/auth">
              <Button
                size="lg"
                className="text-base h-13 px-8 font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:scale-[1.02] border-0"
              >
                Começar Grátis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="text-base h-13 px-8 font-semibold border-border hover:bg-accent/50"
              onClick={() =>
                document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              <Play className="w-4 h-4 mr-2" />
              Ver como funciona
            </Button>
          </div>

          {/* Trust pills */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground animate-fade-in">
            {['Configuração em 2 min', 'Suporte via WhatsApp', '+500 grupos ativos'].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary/70" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="relative max-w-4xl mx-auto animate-fade-in">
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/20 via-primary/5 to-transparent" />
          <div className="absolute -inset-8 bg-primary/[0.04] rounded-3xl blur-2xl" />

          <div className="relative bg-card rounded-2xl border border-border/60 shadow-2xl shadow-primary/5 overflow-hidden">
            {/* Browser bar */}
            <div className="flex items-center gap-3 px-4 py-3 bg-muted/40 border-b border-border/40">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-6 py-1.5 bg-background/80 rounded-lg text-xs text-muted-foreground font-medium">
                  app.crmgruposvip.com
                </div>
              </div>
            </div>

            {/* Dashboard mock */}
            <div className="p-4 md:p-6 bg-gradient-to-br from-background via-background to-muted/10">
              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                {[
                  { label: 'Membros Ativos', value: '147', change: '+12%', color: 'text-primary' },
                  { label: 'Receita Mensal', value: 'R$ 22k', change: '+8%', color: 'text-primary' },
                  { label: 'Vencendo Hoje', value: '12', change: '', color: 'text-yellow-500' },
                  { label: 'Taxa Renovação', value: '94%', change: '+5%', color: 'text-primary' },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="p-3.5 rounded-xl bg-card border border-border/50 hover:border-primary/20 transition-colors"
                  >
                    <p className="text-[10px] md:text-xs text-muted-foreground mb-1.5">{s.label}</p>
                    <div className="flex items-end gap-1.5">
                      <p className={`text-lg md:text-xl font-bold ${s.color}`}>{s.value}</p>
                      {s.change && (
                        <span className="text-[10px] text-green-500 font-medium mb-0.5">
                          {s.change}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart + Table */}
              <div className="grid md:grid-cols-5 gap-3">
                {/* Chart placeholder */}
                <div className="md:col-span-3 rounded-xl bg-card border border-border/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-foreground">Receita Mensal</span>
                    <span className="text-[10px] text-muted-foreground">Últimos 6 meses</span>
                  </div>
                  <div className="flex items-end gap-2 h-24">
                    {[40, 55, 45, 65, 58, 80].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-md bg-gradient-to-t from-primary/30 to-primary/60 transition-all hover:from-primary/40 hover:to-primary/80"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Members list */}
                <div className="md:col-span-2 rounded-xl bg-card border border-border/50 overflow-hidden">
                  <div className="p-3 border-b border-border/40 flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">Membros Recentes</span>
                  </div>
                  <div className="divide-y divide-border/30">
                    {[
                      { name: 'João S.', status: 'Ativo' },
                      { name: 'Maria C.', status: 'Ativo' },
                      { name: 'Pedro L.', status: 'Vencendo' },
                    ].map((m) => (
                      <div key={m.name} className="px-3 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">
                            {m.name.charAt(0)}
                          </div>
                          <span className="text-xs text-foreground">{m.name}</span>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            m.status === 'Ativo'
                              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                              : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                          }`}
                        >
                          {m.status}
                        </span>
                      </div>
                    ))}
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
