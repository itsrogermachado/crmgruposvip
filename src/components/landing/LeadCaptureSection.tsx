import { useState } from 'react';
import { Gift, Send, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLeadCapture } from '@/hooks/useLeadCapture';

export function LeadCaptureSection() {
  const [contact, setContact] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const leadCapture = useLeadCapture();

  const isEmail = contact.includes('@');
  const contactType = isEmail ? 'email' : 'whatsapp';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contact.trim()) return;

    // Validate
    if (isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contact)) return;
    } else {
      const phoneRegex = /^\d{10,11}$/;
      const cleanPhone = contact.replace(/\D/g, '');
      if (!phoneRegex.test(cleanPhone)) return;
    }

    await leadCapture.mutateAsync({ contact, contactType });
    setIsSuccess(true);
    setContact('');
  };

  if (isSuccess) {
    return (
      <section id="contato" className="py-20 md:py-28 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Pronto! 🎉</h3>
            <p className="text-muted-foreground">
              Você receberá nosso guia gratuito em breve. Fique de olho no seu{' '}
              {contactType === 'email' ? 'e-mail' : 'WhatsApp'}!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contato" className="py-20 md:py-28 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Card */}
          <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-card to-primary/5 border border-primary/20">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <Gift className="w-8 h-8 text-primary" />
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Receba nosso Guia Gratuito
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                "5 Estratégias para Aumentar a Retenção no Seu Grupo VIP" 
                - direto no seu WhatsApp ou e-mail.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Seu WhatsApp ou E-mail"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="h-12 text-base"
                disabled={leadCapture.isPending}
              />
              <Button 
                type="submit" 
                size="lg"
                disabled={leadCapture.isPending || !contact.trim()}
                className="h-12 px-6 font-semibold bg-gradient-to-r from-primary to-primary/80 whitespace-nowrap"
              >
                {leadCapture.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Quero Receber
                  </>
                )}
              </Button>
            </form>

            {/* Privacy */}
            <p className="text-center text-xs text-muted-foreground mt-4">
              🔒 Prometemos não enviar spam. Apenas conteúdo valioso.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
