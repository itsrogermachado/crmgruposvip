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
    <footer className="py-12 border-t border-border/50 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <Crown className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">CRM Grupos VIP</span>
            </div>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
              A ferramenta completa para gestores de grupos VIP gerenciarem 
              membros, pagamentos e crescerem seu negócio.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Benefícios', id: 'beneficios' },
                { label: 'Planos', id: 'planos' },
                { label: 'FAQ', id: 'faq' },
              ].map(item => (
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
                <Link to="/auth" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Entrar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contato</h4>
            <button
              onClick={openWhatsApp}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>(21) 96448-8285</span>
            </button>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/50 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CRM Grupos VIP. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
