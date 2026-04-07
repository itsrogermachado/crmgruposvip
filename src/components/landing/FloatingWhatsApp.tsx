import { MessageCircle } from 'lucide-react';

const SUPPORT_NUMBER = '5521964488285';

export function FloatingWhatsApp() {
  const openWhatsApp = () => {
    const message = encodeURIComponent(
      'Olá! Vim pelo site do CRM Grupos VIP e quero saber mais sobre a ferramenta!'
    );
    window.open(`https://wa.me/${SUPPORT_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <button
      onClick={openWhatsApp}
      className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-xl shadow-[#25D366]/30 hover:shadow-2xl hover:shadow-[#25D366]/50 border-2 border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
      aria-label="Fale conosco no WhatsApp"
    >
      <MessageCircle className="w-8 h-8" fill="currentColor" />

      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-2xl bg-[#25D366]/40 animate-ping" />

      {/* Tooltip */}
      <span className="absolute right-[72px] bg-primary text-white text-[10px] font-extrabold uppercase tracking-[0.15em] px-4 py-2.5 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        Fale conosco! 💬
      </span>
    </button>
  );
}
