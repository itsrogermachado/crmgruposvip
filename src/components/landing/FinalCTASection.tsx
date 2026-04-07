import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FinalCTASection() {
  return (
    <section className="py-24 md:py-40 relative overflow-hidden bg-primary">
      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/10 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-5xl font-extrabold mb-6 text-white leading-tight tracking-tight">
            Pronto para{' '}
            <span className="text-accent">profissionalizar</span>{' '}
            seu grupo VIP?
          </h2>

          <p className="text-white/60 mb-10 max-w-xl mx-auto text-base md:text-lg font-medium">
            Comece agora mesmo. Em menos de 5 minutos você terá seu CRM configurado e pronto para usar.
          </p>

          <Link to="/auth">
            <Button
              size="lg"
              className="text-sm px-12 h-14 font-extrabold uppercase tracking-[0.1em] bg-accent hover:bg-accent/90 text-white shadow-2xl shadow-accent/30 hover:shadow-accent/50 transition-all duration-300 hover:scale-[1.03] border-0"
            >
              Começar Agora — Grátis por 7 Dias
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/50 mt-8 font-medium">
            <span>✓ Sem cartão de crédito</span>
            <span>✓ Configuração em 2 min</span>
            <span>✓ Cancele quando quiser</span>
          </div>
        </div>
      </div>
    </section>
  );
}
