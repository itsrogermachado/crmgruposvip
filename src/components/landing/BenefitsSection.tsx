import {
  Bell,
  Wallet,
  BarChart3,
  Users,
  FileSpreadsheet,
  MessageCircle,
} from 'lucide-react';

const benefits = [
  {
    icon: Bell,
    title: 'Lembretes Automáticos',
    description: 'Envie notificações de vencimento via WhatsApp no piloto automático. Seus membros nunca mais vão esquecer de renovar.',
    visual: 'Redução de 80% na inadimplência',
  },
  {
    icon: Wallet,
    title: 'Controle Financeiro Total',
    description: 'Gerencie pagamentos, renovações e inadimplência em um único lugar. Saiba exatamente quanto entra todo mês.',
    visual: 'Dashboard de faturamento em tempo real',
  },
  {
    icon: BarChart3,
    title: 'Relatórios Inteligentes',
    description: 'Acompanhe faturamento, crescimento e métricas-chave. Tome decisões baseadas em dados, não em achismo.',
    visual: 'Gráficos e métricas que importam',
  },
  {
    icon: Users,
    title: 'Multi-Grupos Centralizados',
    description: 'Gerencie vários grupos VIP de forma centralizada em uma conta. Escale sem perder o controle.',
    visual: 'Uma conta, infinitos grupos',
  },
  {
    icon: FileSpreadsheet,
    title: 'Exportação de Dados',
    description: 'Exporte relatórios e listas de membros para Excel quando precisar. Seus dados, seu controle.',
    visual: 'Excel com um clique',
  },
  {
    icon: MessageCircle,
    title: 'Suporte Humanizado',
    description: 'Atendimento rápido via WhatsApp para resolver qualquer dúvida. Sem chatbot, sem espera.',
    visual: 'Resposta em minutos, não dias',
  },
];

export function BenefitsSection() {
  return (
    <section id="beneficios" className="py-24 md:py-40 scroll-mt-20 relative bg-[#FAFAFA]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-6">
            <span className="text-[11px] font-bold text-primary uppercase tracking-[0.2em]">
              Recursos
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-[2.75rem] font-extrabold mb-4 text-primary leading-tight tracking-tight">
            Tudo que você precisa para{' '}
            <span className="relative inline-block">
              <span className="text-accent">escalar seu grupo</span>
              <span className="absolute -bottom-1.5 left-0 right-0 h-[4px] bg-accent/25 rounded-full" />
            </span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg font-medium max-w-lg mx-auto">
            Ferramentas profissionais projetadas para gestores de grupos VIP
          </p>
        </div>

        {/* Zigzag layout */}
        <div className="max-w-5xl mx-auto space-y-16 md:space-y-24">
          {benefits.map((benefit, index) => {
            const isReversed = index % 2 !== 0;
            return (
              <div
                key={benefit.title}
                className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 md:gap-16`}
              >
                {/* Text */}
                <div className="flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-5">
                    <benefit.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-heading text-xl md:text-2xl font-extrabold uppercase tracking-tight text-primary mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed font-medium">
                    {benefit.description}
                  </p>
                </div>

                {/* Visual card */}
                <div className="flex-1 w-full">
                  <div className="rounded-2xl bg-white border border-primary/10 p-8 md:p-10 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-accent/10 transition-all duration-500">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
                        <benefit.icon className="w-8 h-8 text-primary/40" />
                      </div>
                      <p className="font-heading font-extrabold text-lg text-primary/70">{benefit.visual}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
