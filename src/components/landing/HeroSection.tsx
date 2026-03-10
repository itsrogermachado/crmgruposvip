import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[#04030C]" />
      
      {/* Radial gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#4630B1]/20 rounded-full blur-[120px]" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#9D67ED]/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-[#7C3AED]/10 rounded-full blur-[80px]" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-20 right-[15%] w-2 h-2 bg-[#9D67ED] rounded-full animate-pulse" />
      <div className="absolute top-[40%] left-[10%] w-1.5 h-1.5 bg-[#B29CD9] rounded-full animate-pulse delay-700" />
      <div className="absolute bottom-[30%] right-[20%] w-1 h-1 bg-[#7C3AED] rounded-full animate-pulse delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-[#9D67ED]" />
            <span className="text-sm font-medium text-[#B29CD9]">
              ✨ 7 dias grátis • Sem cartão de crédito
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 animate-fade-in tracking-tight">
            <span className="text-white">Gerencie Seu Grupo VIP</span>
            <br />
            <span className="text-white">com </span>
            <span className="bg-gradient-to-r from-[#9D67ED] via-[#7C3AED] to-[#4630B1] bg-clip-text text-transparent">
              Simplicidade
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-[#B29CD9]/70 max-w-2xl mx-auto mb-10 animate-fade-in leading-relaxed">
            Controle financeiro, lembretes automáticos e gestão completa de membros 
            em um único lugar. A ferramenta que você precisa para escalar seu negócio.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 animate-fade-in">
            <Link to="/auth">
              <Button 
                size="lg" 
                className="text-base px-8 py-6 font-bold bg-gradient-to-r from-[#7C3AED] to-[#4630B1] hover:from-[#6D28D9] hover:to-[#3B27A0] shadow-xl shadow-[#7C3AED]/25 hover:shadow-2xl hover:shadow-[#7C3AED]/40 transition-all hover:scale-105 border-0"
              >
                Começar Grátis - 7 Dias
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="lg"
              className="text-base px-8 py-6 font-semibold text-white/70 hover:text-white border border-white/10 hover:bg-white/5 rounded-lg"
              onClick={() => document.getElementById('beneficios')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Saiba Mais
            </Button>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-3xl mx-auto animate-fade-in">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#7C3AED]/20 via-[#4630B1]/10 to-[#9D67ED]/20 rounded-3xl blur-xl" />
            <div className="relative bg-[#0A0818] rounded-2xl border border-white/10 shadow-2xl shadow-[#7C3AED]/10 overflow-hidden">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[#0E0C1D] border-b border-white/5">
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
              {/* Dashboard content mock */}
              <div className="p-6">
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: 'Membros', value: '147', color: 'from-[#7C3AED] to-[#4630B1]' },
                    { label: 'Receita', value: 'R$22k', color: 'from-[#28CA41] to-[#1EA835]' },
                    { label: 'A Vencer', value: '12', color: 'from-[#FFBD2E] to-[#F59E0B]' },
                    { label: 'Renovação', value: '94%', color: 'from-[#9D67ED] to-[#7C3AED]' },
                  ].map((s) => (
                    <div key={s.label} className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-[10px] text-white/40 mb-1">{s.label}</p>
                      <p className={`text-sm font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.value}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-20 rounded-xl bg-white/[0.03] border border-white/5" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/40 mt-10 animate-fade-in">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#28CA41]" />
              <span>Configuração em 2 min</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#28CA41]" />
              <span>Suporte via WhatsApp</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#28CA41]" />
              <span>Dados 100% seguros</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
