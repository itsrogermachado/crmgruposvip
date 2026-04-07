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
    <footer className="py-24 bg-primary text-white relative overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          {/* Brand */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <Crown className="w-6 h-6 text-accent" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl leading-none tracking-tighter uppercase italic">
                  CRM <span className="text-accent">VIP</span>
                </span>
              </div>
            </div>
            <p className="text-lg opacity-60 max-w-sm leading-relaxed font-medium">
              A plataforma definitiva para gestores de grupos VIP. Automatize sua escala e foque no que realmente importa: seu conteúdo.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-6">
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-accent">Plataforma</h4>
            <ul className="space-y-4">
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
                    className="text-white/60 hover:text-accent transition-all text-sm font-bold uppercase tracking-widest"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-accent">Suporte</h4>
            <button
              onClick={openWhatsApp}
              className="group flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                 <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-50">WhatsApp VIP</p>
                <p className="text-base font-black tracking-tight">(21) 96448-8285</p>
              </div>
            </button>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
          <div>© {new Date().getFullYear()} CRM VIP - Powering Digital Empires</div>
          <div className="flex gap-8">
            <Link to="/terms" className="hover:text-accent transition-colors">Termos</Link>
            <Link to="/privacy" className="hover:text-accent transition-colors">Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
