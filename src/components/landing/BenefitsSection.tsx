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
    <section id="beneficios" className="py-24 md:py-32 scroll-mt-20 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#4630B1]/10 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[#9D67ED] font-medium text-sm uppercase tracking-wider mb-3">Recursos</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Por que escolher o{' '}
            <span className="bg-gradient-to-r from-[#9D67ED] to-[#4630B1] bg-clip-text text-transparent">
              CRM Grupos VIP
            </span>
            ?
          </h2>
          <p className="text-base text-white/50">
            Tudo que você precisa para gerenciar seus grupos de forma profissional
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="group relative p-7 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-[#7C3AED]/30 hover:bg-[#7C3AED]/[0.05] transition-all duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#7C3AED]/0 to-[#4630B1]/0 group-hover:from-[#7C3AED]/5 group-hover:to-[#4630B1]/5 transition-all duration-500" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center mb-5 group-hover:bg-[#7C3AED]/20 group-hover:scale-110 transition-all duration-300">
                  <benefit.icon className="w-6 h-6 text-[#9D67ED]" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{benefit.title}</h3>
                <p className="text-white/40 leading-relaxed text-sm">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
