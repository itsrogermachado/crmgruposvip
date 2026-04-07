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
      className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-[0_20px_40px_-5px_rgba(37,211,102,0.3)] hover:shadow-[0_30px_60px_-10px_rgba(37,211,102,0.4)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 group border-2 border-white/20"
      aria-label="Fale conosco no WhatsApp"
    >
      <MessageCircle className="w-8 h-8 fill-current" />
      
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-2xl bg-[#25D366]/40 animate-ping pointer-events-none" />
      
      {/* Tooltip */}
      <span className="absolute right-20 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 whitespace-nowrap pointer-events-none border border-white/10">
        Suporte VIP Online 💬
      </span>
    </button>
  );
}
