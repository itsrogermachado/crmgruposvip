import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Radial gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px]" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(hsl(var(--foreground) / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-20 right-[15%] w-2 h-2 bg-primary rounded-full animate-pulse" />
      <div className="absolute top-[40%] left-[10%] w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse delay-700" />
      <div className="absolute bottom-[30%] right-[20%] w-1 h-1 bg-primary/80 rounded-full animate-pulse delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              🔥 Oferta de Lançamento • 7 dias grátis
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 animate-fade-in tracking-tight">
            <span className="text-foreground">Chega de Perder Dinheiro</span>
            <br />
            <span className="text-foreground">no Seu </span>
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Grupo VIP
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in leading-relaxed">
            Membros esquecendo de pagar? Perdendo o controle de quem está ativo? 
            O CRM Grupos VIP automatiza cobranças e aumenta sua taxa de renovação em até 40%.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 animate-fade-in">
            <Link to="/auth">
              <Button 
                size="lg" 
                className="text-base px-8 py-7 font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 transition-all hover:scale-105 border-0"
              >
                Testar Grátis por 7 Dias →
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="lg"
              className="text-base px-8 py-6 font-semibold text-muted-foreground hover:text-foreground border border-border hover:bg-accent/50 rounded-lg"
              onClick={() => document.getElementById('beneficios')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Saiba Mais
            </Button>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-3xl mx-auto animate-fade-in">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl blur-xl" />
            <div className="relative bg-card rounded-2xl border border-border shadow-2xl shadow-primary/5 overflow-hidden">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 bg-background rounded-lg text-xs text-muted-foreground">
                    crmgruposvip.com
                  </div>
                </div>
              </div>
              {/* Dashboard content mock */}
              <div className="p-6 bg-gradient-to-br from-background to-muted/20">
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: 'Membros', value: '147' },
                    { label: 'Receita', value: 'R$22k' },
                    { label: 'A Vencer', value: '12' },
                    { label: 'Renovação', value: '94%' },
                  ].map((s) => (
                    <div key={s.label} className="p-3 rounded-xl bg-card border border-border/50">
                      <p className="text-[10px] text-muted-foreground mb-1">{s.label}</p>
                      <p className="text-sm font-bold text-primary">{s.value}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-20 rounded-xl bg-muted/30 border border-border/50" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mt-10 animate-fade-in">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>Configuração em 2 min</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>Suporte via WhatsApp</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>Dados 100% seguros</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
