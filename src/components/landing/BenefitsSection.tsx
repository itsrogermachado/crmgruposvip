import {
  Wallet,
  Bell,
  BarChart3,
  Users,
  FileSpreadsheet,
  MessageCircle,
  ArrowUpRight,
} from 'lucide-react';

const benefits = [
  {
    icon: Bell,
    title: 'Lembretes Automáticos',
    description: 'Envie notificações de vencimento via WhatsApp no piloto automático.',
    accent: 'from-primary/10 to-primary/5',
  },
  {
    icon: Wallet,
    title: 'Controle Financeiro',
    description: 'Gerencie pagamentos, renovações e inadimplência em um único lugar.',
    accent: 'from-primary/10 to-primary/5',
  },
  {
    icon: BarChart3,
    title: 'Relatórios em Tempo Real',
    description: 'Acompanhe faturamento, crescimento e métricas-chave do seu grupo.',
    accent: 'from-primary/10 to-primary/5',
  },
  {
    icon: Users,
    title: 'Multi-Grupos',
    description: 'Gerencie vários grupos VIP de forma centralizada em uma conta.',
    accent: 'from-primary/10 to-primary/5',
  },
  {
    icon: FileSpreadsheet,
    title: 'Exportação de Dados',
    description: 'Exporte relatórios e listas de membros para Excel quando precisar.',
    accent: 'from-primary/10 to-primary/5',
  },
  {
    icon: MessageCircle,
    title: 'Suporte Humanizado',
    description: 'Atendimento rápido via WhatsApp para resolver qualquer dúvida.',
    accent: 'from-primary/10 to-primary/5',
  },
];

export function BenefitsSection() {
  return (
    <section id="beneficios" className="py-24 md:py-32 scroll-mt-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 mb-4">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Recursos
            </span>
          </div>
          <h2 className="text-3xl md:text-[2.75rem] font-bold mb-4 text-foreground leading-tight">
            Tudo que você precisa para{' '}
            <span className="text-primary">escalar seu grupo</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto">
            Ferramentas profissionais projetadas especificamente para gestores de grupos VIP
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/25 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${benefit.accent} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}>
                <benefit.icon className="w-5 h-5 text-primary" />
              </div>

              <h3 className="text-base font-semibold mb-2 text-foreground flex items-center gap-1">
                {benefit.title}
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
