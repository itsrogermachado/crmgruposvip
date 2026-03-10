import { Link } from 'react-router-dom';
import { Crown, MessageCircle } from 'lucide-react';

const SUPPORT_NUMBER = '5521964488285';

export function LandingFooter() {
  const openWhatsApp = () => {
    const message = encodeURIComponent('Olá! Vim pelo site do CRM Grupos VIP e gostaria de saber mais.');
    window.open(`https://wa.me/${SUPPORT_NUMBER}?text=${message}`, '_blank');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer className="py-12 border-t border-white/5 bg-[#04030C]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#4630B1] flex items-center justify-center">
                <Crown className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">CRM Grupos VIP</span>
            </div>
            <p className="text-white/40 max-w-sm text-sm leading-relaxed">
              A ferramenta completa para gestores de grupos VIP gerenciarem 
              membros, pagamentos e crescerem seu negócio.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Links</h4>
            <ul className="space-y-2.5">
              <li>
                <button 
                  onClick={() => scrollToSection('beneficios')}
                  className="text-white/40 hover:text-white/70 transition-colors text-sm"
                >
                  Benefícios
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('planos')}
                  className="text-white/40 hover:text-white/70 transition-colors text-sm"
                >
                  Planos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('faq')}
                  className="text-white/40 hover:text-white/70 transition-colors text-sm"
                >
                  FAQ
                </button>
              </li>
              <li>
                <Link 
                  to="/auth"
                  className="text-white/40 hover:text-white/70 transition-colors text-sm"
                >
                  Entrar
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contato</h4>
            <button
              onClick={openWhatsApp}
              className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>(21) 96448-8285</span>
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-white/5 text-center text-sm text-white/30">
          © {new Date().getFullYear()} CRM Grupos VIP. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
