import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FinalCTASection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
            Pronto para{' '}
            <span className="text-primary">profissionalizar</span>{' '}
            seu grupo VIP?
          </h2>

          <p className="text-base text-muted-foreground mb-10 max-w-xl mx-auto">
            Comece agora mesmo. Em menos de 5 minutos você terá seu CRM configurado 
            e pronto para usar.
          </p>

          <Link to="/auth">
            <Button 
              size="lg" 
              className="text-base px-10 py-7 font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 transition-all hover:scale-105 border-0"
            >
              Começar Agora - Grátis por 7 Dias
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground mt-8">
            ✓ Sem cartão de crédito &nbsp; ✓ Configuração em 2 min &nbsp; ✓ Cancele quando quiser
          </p>
        </div>
      </div>
    </section>
  );
}
