import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const features = [
  'Dashboard completo com métricas em tempo real',
  'Gestão de membros com status automático',
  'Histórico de pagamentos detalhado',
  'Lembretes automáticos via WhatsApp',
  'Exportação de dados para Excel',
  'Multi-grupos em uma só conta',
];

export function DemoSection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center max-w-6xl mx-auto">
          {/* Left - Text */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 mb-4">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Plataforma
              </span>
            </div>
            <h2 className="text-3xl md:text-[2.5rem] font-bold mb-6 text-foreground leading-tight">
              Interface intuitiva{' '}
              <span className="text-primary">projetada para você</span>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Sem complicação. Tudo o que você precisa para gerenciar seu grupo VIP está em uma interface limpa, rápida e moderna.
            </p>

            <ul className="space-y-3 mb-8">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>

            <Link to="/auth">
              <Button className="font-semibold bg-primary hover:bg-primary/90 shadow-md shadow-primary/15">
                Experimentar Agora
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Right - Dashboard mock */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 to-primary/[0.02] rounded-3xl blur-xl" />
            <div className="relative bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/40 border-b border-border/40">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 bg-background/80 rounded-lg text-xs text-muted-foreground">
                    app.crmgruposvip.com
                  </div>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-background to-muted/10">
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
                  <div className="p-3 border-b border-border/40 flex items-center justify-between">
                    <span className="text-xs font-semibold">Membros Recentes</span>
                  </div>
                  <div className="divide-y divide-border/30">
                    {['João Silva', 'Maria Santos', 'Pedro Costa'].map((name) => (
                      <div key={name} className="p-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">
                            {name.charAt(0)}
                          </div>
                          <span className="text-xs">{name}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-medium">
                          Ativo
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
