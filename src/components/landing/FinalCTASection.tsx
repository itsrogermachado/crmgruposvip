import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FinalCTASection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Pronto para{' '}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              profissionalizar
            </span>{' '}
            seu grupo VIP?
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Comece agora mesmo. Em menos de 5 minutos você terá seu CRM configurado 
            e pronto para usar.
          </p>

          {/* CTA */}
          <Link to="/auth">
            <Button 
              size="lg" 
              className="text-lg px-10 py-7 font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:scale-105"
            >
              Começar Agora - Grátis por 7 Dias
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>

          {/* Trust */}
          <p className="text-sm text-muted-foreground mt-6">
            ✓ Sem cartão de crédito &nbsp; ✓ Configuração em 2 min &nbsp; ✓ Cancele quando quiser
          </p>
        </div>
      </div>
    </section>
  );
}
