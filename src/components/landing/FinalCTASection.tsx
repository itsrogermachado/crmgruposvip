import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FinalCTASection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/8 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
            Pronto para{' '}
            <span className="text-primary">profissionalizar</span>{' '}
            seu grupo VIP?
          </h2>

          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            Comece agora mesmo. Em menos de 5 minutos você terá seu CRM configurado e pronto para usar.
          </p>

          <Link to="/auth">
            <Button
              size="lg"
              className="text-base px-10 h-14 font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:scale-[1.02] border-0"
            >
              Começar Agora — Grátis por 7 Dias
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground mt-8">
            <span>✓ Sem cartão de crédito</span>
            <span>✓ Configuração em 2 min</span>
            <span>✓ Cancele quando quiser</span>
          </div>
        </div>
      </div>
    </section>
  );
}
