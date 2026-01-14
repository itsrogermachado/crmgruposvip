import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatsAppSupportProps {
  variant?: 'fixed' | 'inline';
  className?: string;
}

const WHATSAPP_NUMBER = '5511966572738';
const DEFAULT_MESSAGE = 'Olá! Preciso de ajuda com o CRM Grupos VIP.';

export function WhatsAppSupport({ variant = 'fixed', className = '' }: WhatsAppSupportProps) {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(DEFAULT_MESSAGE);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (variant === 'inline') {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleClick}
        className={`gap-2 border-green-500/30 text-green-600 hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/50 ${className}`}
      >
        <MessageCircle className="w-4 h-4" />
        <span>Suporte</span>
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${className}`}
      aria-label="Suporte via WhatsApp"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="font-medium">Suporte</span>
    </button>
  );
}
