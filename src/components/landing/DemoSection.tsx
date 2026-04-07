import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
    <section className="py-24 md:py-40 relative overflow-hidden bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-center max-w-6xl mx-auto">
          {/* Left - Text (5 cols) */}
          <div className="md:col-span-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-6">
              <span className="text-[11px] font-bold text-primary uppercase tracking-[0.2em]">
                Plataforma
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-[2.5rem] font-extrabold mb-6 text-primary leading-tight tracking-tight">
              Interface intuitiva{' '}
              <span className="relative inline-block">
                <span className="text-accent">projetada para você</span>
                <span className="absolute -bottom-1.5 left-0 right-0 h-[4px] bg-accent/25 rounded-full" />
              </span>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed text-base font-medium">
              Sem complicação. Tudo o que você precisa para gerenciar seu grupo VIP está em uma interface limpa, rápida e moderna.
            </p>

            <ul className="space-y-3.5 mb-8">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground font-medium">{f}</span>
                </li>
              ))}
            </ul>

            <Link to="/auth">
              <Button className="font-extrabold uppercase tracking-[0.1em] text-xs bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/35 transition-all duration-300 h-12 px-8 border-0">
                Experimentar Agora
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Right - Dashboard mock (7 cols) */}
          <div className="md:col-span-7">
            <div className="relative">
              <div className="absolute -inset-4 bg-accent/[0.04] rounded-3xl blur-xl" />
              <div className="relative bg-white rounded-2xl border border-primary/10 shadow-2xl shadow-primary/10 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-primary/[0.03] border-b border-primary/10">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                    <div className="w-3 h-3 rounded-full bg-green-400/70" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 bg-primary/5 rounded-lg text-[10px] text-primary/60 font-bold tracking-wider uppercase">
                      app.crmgruposvip.com
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-[#FAFAFA]">
                  {/* Stats cards */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: 'Receita Mensal', value: 'R$ 22.050', icon: '📈' },
                      { label: 'Clientes Ativos', value: '147', icon: '👥' },
                      { label: 'Taxa Renovação', value: '94%', icon: '🔄' },
                    ].map((stat) => (
                      <div key={stat.label} className="p-3.5 rounded-xl bg-white border border-primary/10">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-base">{stat.icon}</span>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{stat.label}</p>
                        </div>
                        <p className="text-lg font-extrabold text-primary font-heading">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Mini table */}
                  <div className="rounded-xl bg-white border border-primary/10 overflow-hidden">
                    <div className="p-3 border-b border-primary/10 flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Clientes</span>
                      <span className="text-[10px] text-muted-foreground font-medium">Últimos adicionados</span>
                    </div>
                    <div className="divide-y divide-primary/5">
                      {[
                        { name: 'João Silva', status: 'Ativo', value: 'R$ 197' },
                        { name: 'Maria Santos', status: 'Ativo', value: 'R$ 297' },
                        { name: 'Pedro Costa', status: 'Vencendo', value: 'R$ 147' },
                        { name: 'Ana Lima', status: 'Ativo', value: 'R$ 197' },
                      ].map((row) => (
                        <div key={row.name} className="p-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-extrabold text-primary font-heading">
                              {row.name.charAt(0)}
                            </div>
                            <span className="text-xs font-medium text-primary">{row.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              row.status === 'Ativo'
                                ? 'bg-green-500/10 text-green-600'
                                : 'bg-yellow-500/10 text-yellow-600'
                            }`}>
                              {row.status}
                            </span>
                            <span className="text-xs font-bold text-primary">{row.value}</span>
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
