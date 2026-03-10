import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FinalCTASection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#04030C] via-[#0E0C1D] to-[#04030C]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#7C3AED]/15 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-[#7C3AED]/15 border border-[#7C3AED]/20 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-[#9D67ED]" />
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Pronto para{' '}
            <span className="bg-gradient-to-r from-[#9D67ED] to-[#4630B1] bg-clip-text text-transparent">
              profissionalizar
            </span>{' '}
            seu grupo VIP?
          </h2>

          <p className="text-base text-white/50 mb-10 max-w-xl mx-auto">
            Comece agora mesmo. Em menos de 5 minutos você terá seu CRM configurado 
            e pronto para usar.
          </p>

          {/* CTA */}
          <Link to="/auth">
            <Button 
              size="lg" 
              className="text-base px-10 py-7 font-bold bg-gradient-to-r from-[#7C3AED] to-[#4630B1] hover:from-[#6D28D9] hover:to-[#3B27A0] shadow-xl shadow-[#7C3AED]/25 hover:shadow-2xl hover:shadow-[#7C3AED]/40 transition-all hover:scale-105 border-0"
            >
              Começar Agora - Grátis por 7 Dias
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>

          {/* Trust */}
          <p className="text-sm text-white/30 mt-8">
            ✓ Sem cartão de crédito &nbsp; ✓ Configuração em 2 min &nbsp; ✓ Cancele quando quiser
          </p>
        </div>
      </div>
    </section>
  );
}
