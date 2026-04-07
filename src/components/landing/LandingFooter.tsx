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
    <footer className="py-14 border-t border-white/10 bg-[#1a2d4d]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-extrabold text-lg text-white">CRM Grupos VIP</span>
            </div>
            <p className="text-white/50 max-w-sm text-sm leading-relaxed font-medium">
              A plataforma completa para gestores de grupos VIP gerenciarem membros, pagamentos e escalarem seu negócio.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-extrabold mb-4 text-[11px] text-white uppercase tracking-[0.2em]">Navegação</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Recursos', id: 'beneficios' },
                { label: 'Como Funciona', id: 'como-funciona' },
                { label: 'Depoimentos', id: 'depoimentos' },
                { label: 'Planos', id: 'planos' },
                { label: 'FAQ', id: 'faq' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="text-white/50 hover:text-white transition-colors duration-300 text-sm font-medium"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <Link
                  to="/auth"
                  className="text-white/50 hover:text-white transition-colors duration-300 text-sm font-medium"
                >
                  Entrar
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-extrabold mb-4 text-[11px] text-white uppercase tracking-[0.2em]">Contato</h4>
            <button
              onClick={openWhatsApp}
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-300 text-sm font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              <span>(21) 96448-8285</span>
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 text-center text-xs text-white/30 font-medium">
          © {new Date().getFullYear()} CRM Grupos VIP. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
