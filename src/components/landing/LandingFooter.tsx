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
    <footer className="py-12 border-t border-border/40 bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <Crown className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">CRM Grupos VIP</span>
            </div>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
              A plataforma completa para gestores de grupos VIP gerenciarem membros, pagamentos e escalarem seu negócio.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm text-foreground">Navegação</h4>
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
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <Link
                  to="/auth"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Entrar
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-sm text-foreground">Contato</h4>
            <button
              onClick={openWhatsApp}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>(21) 96448-8285</span>
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-border/40 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} CRM Grupos VIP. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
