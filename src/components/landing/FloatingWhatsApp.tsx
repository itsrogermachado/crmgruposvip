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
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white shadow-2xl shadow-[hsl(142,70%,45%)]/30 hover:shadow-[hsl(142,70%,45%)]/50 flex items-center justify-center transition-all hover:scale-110 group"
      aria-label="Fale conosco no WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[hsl(142,70%,45%)]/40 animate-ping" />
      
      {/* Tooltip */}
      <span className="absolute right-16 bg-card border border-border text-foreground text-xs font-medium px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Fale conosco! 💬
      </span>
    </button>
  );
}
