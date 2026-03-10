import { 
  Wallet, Bell, BarChart3, Users, FileSpreadsheet, MessageCircle 
} from 'lucide-react';

const benefits = [
  { icon: Wallet, title: 'Controle Financeiro', description: 'Gerencie pagamentos, renovações e inadimplência de forma simples e organizada.' },
  { icon: Bell, title: 'Lembretes Automáticos', description: 'Notificações de vencimento via WhatsApp para você e seus membros.' },
  { icon: BarChart3, title: 'Relatórios Completos', description: 'Veja quanto fatura por mês, por grupo e acompanhe seu crescimento.' },
  { icon: Users, title: 'Multi-Grupos', description: 'Gerencie vários grupos VIP em uma única conta, de forma centralizada.' },
  { icon: FileSpreadsheet, title: 'Exportação Excel', description: 'Exporte dados dos seus membros para planilhas quando precisar.' },
  { icon: MessageCircle, title: 'Suporte Rápido', description: 'Atendimento humanizado via WhatsApp para resolver qualquer dúvida.' },
];

export function BenefitsSection() {
  return (
    <section id="beneficios" className="py-24 md:py-32 scroll-mt-20 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-primary font-medium text-sm uppercase tracking-wider mb-3">Recursos</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Por que escolher o{' '}
            <span className="text-primary">CRM Grupos VIP</span>?
          </h2>
          <p className="text-base text-muted-foreground">
            Tudo que você precisa para gerenciar seus grupos de forma profissional
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="group relative p-7 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-primary/[0.03] transition-all duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
