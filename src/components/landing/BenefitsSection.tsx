import { 
  Wallet, 
  Bell, 
  BarChart3, 
  Users, 
  FileSpreadsheet, 
  MessageCircle 
} from 'lucide-react';

const benefits = [
  {
    icon: Wallet,
    title: 'Controle Financeiro',
    description: 'Gerencie pagamentos, renovações e inadimplência de forma simples e organizada.',
  },
  {
    icon: Bell,
    title: 'Lembretes Automáticos',
    description: 'Notificações de vencimento via WhatsApp para você e seus membros.',
  },
  {
    icon: BarChart3,
    title: 'Relatórios Completos',
    description: 'Veja quanto fatura por mês, por grupo e acompanhe seu crescimento.',
  },
  {
    icon: Users,
    title: 'Multi-Grupos',
    description: 'Gerencie vários grupos VIP em uma única conta, de forma centralizada.',
  },
  {
    icon: FileSpreadsheet,
    title: 'Exportação Excel',
    description: 'Exporte dados dos seus membros para planilhas quando precisar.',
  },
  {
    icon: MessageCircle,
    title: 'Suporte Rápido',
    description: 'Atendimento humanizado via WhatsApp para resolver qualquer dúvida.',
  },
];

export function BenefitsSection() {
  return (
    <section id="beneficios" className="py-20 md:py-28 scroll-mt-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Por que escolher o{' '}
            <span className="text-primary">CRM Grupos VIP</span>?
          </h2>
          <p className="text-lg text-muted-foreground">
            Tudo que você precisa para gerenciar seus grupos de forma profissional
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="group p-6 md:p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                <benefit.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
