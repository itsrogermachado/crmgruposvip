import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FinalCTASection() {
  return (
    <section className="py-24 md:py-40 relative overflow-hidden bg-primary text-white">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter leading-[1.05]">
            Pronto para <br className="hidden md:block" />
            <span className="text-accent underline decoration-accent/30 underline-offset-8 italic">dominar</span> seu mercado?
          </h2>

          <p className="text-xl md:text-2xl opacity-70 max-w-2xl mx-auto leading-relaxed font-medium">
            Junte-se a centenas de gestores que profissionalizaram sua operação e estão faturando alto no WhatsApp e Telegram.
          </p>

          <div className="flex flex-col items-center gap-6">
            <Link to="/auth" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto text-xl h-16 px-12 font-black uppercase tracking-widest bg-accent hover:bg-accent/90 text-white shadow-[0_20px_40px_-10px_rgba(255,100,0,0.4)] transition-all hover:scale-105 active:scale-95 border-0"
              >
                Começar Minha Escala Agora
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
            
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40">
              Teste grátis por 7 dias • Sem cartão • Setup imediato
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
