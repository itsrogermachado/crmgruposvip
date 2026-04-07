import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative pt-28 md:pt-40 pb-24 md:pb-40 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[#FAFAFA]" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/[0.04] rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/[0.06] rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left: Text — 7 cols */}
          <div className="lg:col-span-7">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-8">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
                Teste grátis por 7 dias
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-4xl md:text-5xl lg:text-[4.25rem] font-extrabold leading-[1.05] mb-6 tracking-tight text-primary">
              O CRM que{' '}
              <span className="relative inline-block">
                <span className="text-accent">transforma</span>
                <span className="absolute -bottom-2 left-0 right-0 h-[5px] bg-accent/30 rounded-full" />
              </span>
              <br />
              seu Grupo VIP em máquina de receita
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed font-medium">
              Automatize cobranças, reduza a inadimplência e aumente sua taxa de renovação em até 40%.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-10">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="text-sm h-14 px-10 font-extrabold uppercase tracking-[0.1em] bg-accent hover:bg-accent/90 text-white shadow-xl shadow-accent/25 hover:shadow-2xl hover:shadow-accent/35 transition-all duration-300 hover:scale-[1.02] border-0"
                >
                  Começar Grátis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="text-sm h-14 px-8 font-bold uppercase tracking-[0.1em] border-primary/20 text-primary hover:bg-primary/5"
                onClick={() =>
                  document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                <Play className="w-4 h-4 mr-2" />
                Ver como funciona
              </Button>
            </div>

            {/* Inline metrics */}
            <div className="flex flex-wrap gap-8">
              {[
                { value: '+2.400', label: 'grupos gerenciados' },
                { value: 'R$12M+', label: 'em pagamentos' },
                { value: '94%', label: 'taxa de renovação' },
              ].map((m) => (
                <div key={m.label}>
                  <p className="font-heading font-extrabold text-2xl text-accent tracking-tight">{m.value}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dashboard mockup — 5 cols */}
          <div className="lg:col-span-5">
            <div className="relative lg:rotate-1">
              <div className="absolute -inset-6 bg-accent/[0.06] rounded-3xl blur-2xl" />
              <div className="relative bg-white rounded-2xl border border-primary/10 shadow-2xl shadow-primary/10 overflow-hidden">
                {/* Browser bar */}
                <div className="flex items-center gap-3 px-4 py-3 bg-primary/[0.03] border-b border-primary/10">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                    <div className="w-3 h-3 rounded-full bg-green-400/70" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-6 py-1.5 bg-primary/5 rounded-lg text-[10px] text-primary/60 font-bold tracking-wider uppercase">
                      app.crmgruposvip.com
                    </div>
                  </div>
                </div>

                {/* Dashboard mock */}
                <div className="p-4 md:p-5 bg-[#FAFAFA]">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { label: 'Membros Ativos', value: '147', change: '+12%' },
                      { label: 'Receita Mensal', value: 'R$ 22k', change: '+8%' },
                      { label: 'Vencendo Hoje', value: '12', change: '' },
                      { label: 'Renovações', value: '94%', change: '+5%' },
                    ].map((s) => (
                      <div key={s.label} className="p-3 rounded-xl bg-white border border-primary/10">
                        <p className="text-[10px] text-muted-foreground mb-1 font-bold uppercase tracking-wider">{s.label}</p>
                        <div className="flex items-end gap-1.5">
                          <p className="text-lg font-extrabold text-primary font-heading">{s.value}</p>
                          {s.change && (
                            <span className="text-[10px] text-green-600 font-bold mb-0.5">{s.change}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mini chart */}
                  <div className="rounded-xl bg-white border border-primary/10 p-4 mb-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Receita Mensal</span>
                      <span className="text-[10px] text-muted-foreground">Últimos 6 meses</span>
                    </div>
                    <div className="flex items-end gap-2 h-20">
                      {[40, 55, 45, 65, 58, 80].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t-md bg-gradient-to-t from-primary/20 to-primary/50"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Mini members */}
                  <div className="rounded-xl bg-white border border-primary/10 overflow-hidden">
                    <div className="p-3 border-b border-primary/10">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Membros Recentes</span>
                    </div>
                    <div className="divide-y divide-primary/5">
                      {[
                        { name: 'João S.', status: 'Ativo' },
                        { name: 'Maria C.', status: 'Ativo' },
                        { name: 'Pedro L.', status: 'Vencendo' },
                      ].map((m) => (
                        <div key={m.name} className="px-3 py-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                              {m.name.charAt(0)}
                            </div>
                            <span className="text-xs font-medium text-primary">{m.name}</span>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            m.status === 'Ativo'
                              ? 'bg-green-500/10 text-green-600'
                              : 'bg-yellow-500/10 text-yellow-600'
                          }`}>
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
      </div>
    </section>
  );
}
