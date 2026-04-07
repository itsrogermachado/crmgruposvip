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
    <section id="beneficios" className="py-24 md:py-36 scroll-mt-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20 md:mb-32">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-6">
            <span className="text-sm font-bold text-primary uppercase tracking-widest">
              Por que nos escolher?
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-foreground tracking-tight leading-[1.1]">
            Tudo o que você precisa para{' '}
            <span className="text-accent underline decoration-accent/30 underline-offset-8">escalar de vez.</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Esqueça as planilhas manuais e o caos das cobranças no privado. 
            Nossa plataforma foi construída para dar escala ao seu negócio digital.
          </p>
        </div>

        <div className="space-y-32 md:space-y-48 max-w-6xl mx-auto">
          {/* Benefit 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="flex-1 space-y-6 text-left order-2 lg:order-1">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Bell className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">Lembretes que convertem no piloto automático</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nossa IA identifica exatamente quando cada membro está prestes a vencer e envia notificações personalizadas via WhatsApp. 
                <span className="block mt-4 font-semibold text-foreground">Reduza a inadimplência em até 40% sem precisar digitar uma única palavra.</span>
              </p>
              <ul className="space-y-3">
                {['Avisos prévios de 3, 1 e no dia do vencimento', 'Mensagens directas e amigáveis', 'Link de pagamento direto na mensagem'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-muted-foreground font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 order-1 lg:order-2 w-full">
              <div className="relative aspect-square md:aspect-video lg:aspect-square bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl border-2 border-primary/10 flex items-center justify-center p-8 overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10 w-full max-w-xs space-y-4">
                   <div className="p-4 bg-card rounded-2xl border border-primary/10 shadow-xl translate-x-4 animate-float">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase mb-2">WhatsApp Notification</p>
                      <p className="text-xs font-medium">Olá Ricardo! Seu acesso ao Grupo VIP vence em 24h. Clique aqui para renovar...</p>
                   </div>
                   <div className="p-4 bg-card rounded-2xl border border-accent/10 shadow-xl -translate-x-4 animate-float [animation-delay:1.5s]">
                      <p className="text-[10px] text-accent font-bold uppercase mb-2">System Alert</p>
                      <p className="text-xs font-medium">Usuário renovado com sucesso! + R$ 197,00 na sua conta.</p>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefit 2 - Reversed */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-24">
            <div className="flex-1 space-y-6 text-left">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                <Wallet className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">Controle financeiro sem dor de cabeça</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Tenha uma visão clara de quanto você já faturou e quanto tem para receber nos próximos meses. 
                Substitua planilhas por um dashboard inteligente que trabalha para você.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-secondary/50 border border-primary/5">
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Previsão</p>
                  <p className="text-xl font-black text-foreground">R$ 15.4k</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50 border border-primary/5">
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Crescimento</p>
                  <p className="text-xl font-black text-emerald-500">+24%</p>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="relative aspect-square md:aspect-video lg:aspect-square bg-gradient-to-tr from-accent/5 to-primary/5 rounded-3xl border-2 border-accent/10 flex items-center justify-center p-8 overflow-hidden group">
                 <div className="w-full max-w-sm p-6 bg-card rounded-2xl border border-border/50 shadow-2xl relative z-10 rotate-2 group-hover:rotate-0 transition-transform duration-500">
                    <div className="h-4 w-1/3 bg-muted rounded-full mb-6" />
                    <div className="space-y-4">
                       <div className="h-8 w-full bg-primary/10 rounded-lg animate-pulse" />
                       <div className="h-24 w-full bg-secondary/50 rounded-lg flex items-end gap-1 p-2">
                          {[30, 50, 40, 70, 60, 90, 80].map((h, i) => (
                            <div key={i} className="flex-1 bg-accent/30 rounded-t-sm" style={{ height: `${h}%` }} />
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="flex-1 space-y-6 text-left order-2 lg:order-1">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">Múltiplos grupos em um só lugar</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Gerencie 1 ou 100 grupos com a mesma facilidade. Tenha métricas individuais ou consolidadas para entender qual produto está perfomando melhor.
              </p>
              <div className="p-5 rounded-2xl bg-card border-2 border-primary/5 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">G1</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">Resiliência Financeira</p>
                    <div className="h-1.5 w-full bg-muted rounded-full mt-1">
                      <div className="h-full w-[85%] bg-primary" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">G2</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">Mentoria Elite</p>
                    <div className="h-1.5 w-full bg-muted rounded-full mt-1">
                      <div className="h-full w-[60%] bg-accent" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 order-1 lg:order-2 w-full">
              <div className="relative aspect-square md:aspect-video lg:aspect-square bg-gradient-to-bl from-primary/5 to-emerald-50/50 dark:from-primary/10 dark:to-emerald-900/10 rounded-3xl border-2 border-primary/10 flex items-center justify-center p-8">
                 {/* Visual decoration */}
                 <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="p-6 bg-card rounded-2xl border border-border shadow-xl space-y-2 translate-y-4">
                       <p className="text-xs font-bold">Grupo Alpha</p>
                       <p className="text-2xl font-black">128</p>
                       <p className="text-[10px] text-muted-foreground tracking-widest">MEMBROS</p>
                    </div>
                    <div className="p-6 bg-card rounded-2xl border border-border shadow-xl space-y-2 -translate-y-4">
                       <p className="text-xs font-bold text-accent">Grupo Beta</p>
                       <p className="text-2xl font-black text-accent">54</p>
                       <p className="text-[10px] text-muted-foreground tracking-widest text-accent">AVULSOS</p>
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
