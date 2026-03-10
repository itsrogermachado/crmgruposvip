import { Monitor, Smartphone, CheckCircle2 } from 'lucide-react';

const features = [
  'Dashboard completo com métricas em tempo real',
  'Gestão de membros com status automático',
  'Histórico de pagamentos organizado',
  'Lembretes automáticos via WhatsApp',
];

export function DemoSection() {
  return (
    <section className="py-24 md:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0A0818]/50" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#7C3AED]/5 rounded-full blur-[100px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left - Text */}
          <div>
            <p className="text-[#9D67ED] font-medium text-sm uppercase tracking-wider mb-3">Como funciona</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Veja o CRM Grupos VIP{' '}
              <span className="bg-gradient-to-r from-[#9D67ED] to-[#4630B1] bg-clip-text text-transparent">em ação</span>
            </h2>
            <p className="text-white/50 mb-8 leading-relaxed">
              Interface intuitiva projetada para gestores de grupos VIP. 
              Tudo o que você precisa em uma única tela.
            </p>
            
            <ul className="space-y-4">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#9D67ED] mt-0.5 flex-shrink-0" />
                  <span className="text-white/70 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right - Mockup */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#7C3AED]/10 to-[#4630B1]/10 rounded-3xl blur-xl" />
            <div className="relative bg-[#0E0C1D] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Browser Bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[#080614] border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 bg-white/5 rounded-lg text-xs text-white/40">
                    crmgruposvip.com
                  </div>
                </div>
              </div>

              {/* Dashboard Preview */}
              <div className="p-5">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: 'Membros Ativos', value: '147' },
                    { label: 'Faturamento', value: 'R$ 22.050' },
                    { label: 'A Vencer', value: '12' },
                    { label: 'Renovações', value: '94%' },
                  ].map((stat) => (
                    <div key={stat.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <p className="text-[10px] text-white/30 mb-1">{stat.label}</p>
                      <p className="text-sm font-bold text-[#9D67ED]">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden">
                  <div className="p-3 border-b border-white/5 flex items-center justify-between">
                    <span className="text-xs font-medium text-white/70">Membros Recentes</span>
                    <span className="text-[10px] text-white/30">Últimos 5</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {['João Silva', 'Maria Santos', 'Pedro Costa'].map((name) => (
                      <div key={name} className="p-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#7C3AED]/20 flex items-center justify-center text-[10px] font-medium text-[#9D67ED]">
                            {name.charAt(0)}
                          </div>
                          <span className="text-xs text-white/60">{name}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#28CA41]/10 text-[#28CA41]">
                          Ativo
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="hidden md:flex absolute -left-8 top-1/3 items-center gap-2 px-3 py-2 bg-[#0E0C1D] border border-white/10 rounded-lg shadow-xl">
              <Monitor className="w-3.5 h-3.5 text-[#9D67ED]" />
              <span className="text-xs font-medium text-white/70">Desktop</span>
            </div>
            
            <div className="hidden md:flex absolute -right-8 top-2/3 items-center gap-2 px-3 py-2 bg-[#0E0C1D] border border-white/10 rounded-lg shadow-xl">
              <Smartphone className="w-3.5 h-3.5 text-[#9D67ED]" />
              <span className="text-xs font-medium text-white/70">Mobile</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
