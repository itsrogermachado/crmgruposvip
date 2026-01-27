import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onOpenLeadCapture: () => void;
}

export function HeroSection({ onOpenLeadCapture }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              7 dias grátis • Sem cartão de crédito
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in">
            Gerencie Seu Grupo VIP com{' '}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Simplicidade
            </span>
            <br />
            e Multiplique Seus Resultados
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in">
            Controle financeiro, lembretes automáticos e gestão completa de membros 
            em um único lugar. A ferramenta que você precisa para escalar seu negócio.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in">
            <Link to="/auth">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-lg px-8 py-6 font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:scale-105"
              >
                Começar Grátis - 7 Dias
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline"
              onClick={onOpenLeadCapture}
              className="w-full sm:w-auto text-lg px-8 py-6 font-semibold hover:bg-primary/5 transition-all"
            >
              <Play className="w-5 h-5 mr-2" />
              Receber Guia Grátis
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-in">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Configuração em 2 minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Suporte via WhatsApp</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Dados 100% seguros</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
