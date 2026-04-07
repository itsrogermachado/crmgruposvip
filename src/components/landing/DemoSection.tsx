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
    <section className="py-24 md:py-40 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
          {/* Left - Text */}
          <div className="space-y-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-6 font-bold text-xs uppercase tracking-widest text-primary">
                O Comando Central
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-8 text-foreground tracking-tight leading-[1.1]">
                Controle absoluto sobre sua <span className="text-accent italic underline decoration-accent/30 underline-offset-8 text-glow">lucratividade.</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                Uma interface cirúrgica. Sem distrações. Apenas os dados que você precisa para tomar decisões rápidas e escalar seu faturamento.
              </p>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-4 group">
                  <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-base font-bold text-foreground tracking-tight">{f}</span>
                </li>
              ))}
            </ul>

            <Link to="/auth" className="inline-block">
              <Button className="h-16 px-10 rounded-[2rem] font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 border-0">
                Acesse o Painel Agora
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
          </div>

          {/* Right - Dashboard mock */}
          <div className="relative lg:scale-110 lg:translate-x-10">
            <div className="absolute -inset-10 bg-gradient-to-tr from-accent/20 via-primary/10 to-transparent rounded-[3rem] blur-[80px] opacity-50" />
            
            <div className="relative bg-card rounded-[2.5rem] border-4 border-primary/5 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-700 hover:rotate-1 hover:scale-105">
              <div className="flex items-center gap-2 px-6 py-4 bg-primary text-white border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-white/20" />
                  <div className="w-3.5 h-3.5 rounded-full bg-white/20" />
                  <div className="w-3.5 h-3.5 rounded-full bg-white/20" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-5 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                    app.crmvip.com
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8 bg-gradient-to-br from-card to-background">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Faturamento Mensal', value: 'R$ 48.920', trend: '+12%' },
                    { label: 'Taxa de Retenção', value: '96.4%', trend: '+2%' },
                  ].map((stat) => (
                    <div key={stat.label} className="p-6 rounded-3xl bg-primary/5 border border-primary/5 hover:border-accent/20 transition-all group">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">{stat.label}</p>
                      <div className="flex items-end gap-3">
                        <p className="text-2xl font-black text-primary tracking-tighter">{stat.value}</p>
                        <span className="text-[10px] font-black text-green-500 mb-1">{stat.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-3xl bg-white/5 border border-primary/5 overflow-hidden">
                  <div className="p-5 border-b border-primary/5 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-primary">Atividade Recente</span>
                  </div>
                  <div className="divide-y divide-primary/5">
                    {[
                      { name: 'Ricardo Alvez', plan: 'Anual', time: 'Há 2 min' },
                      { name: 'Sofia Marinho', plan: 'Semestral', time: 'Há 15 min' },
                      { name: 'Carlos Eduardo', plan: 'Anual', time: 'Há 1 hora' },
                    ].map((user) => (
                      <div key={user.name} className="p-4 flex items-center justify-between group hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-xs font-black text-white shadow-lg">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-black uppercase tracking-tight text-foreground">{user.name}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-accent">Plano {user.plan}</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-30">
                          {user.time}
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
