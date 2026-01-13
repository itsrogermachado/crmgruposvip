import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageCircle } from 'lucide-react';

interface WhatsAppMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string;
  phone: string;
}

const MESSAGE_TEMPLATES = [
  { label: 'Lembrete de Vencimento', message: 'Olá {nome}! Seu plano está próximo do vencimento. Gostaria de renovar?' },
  { label: 'Boas-vindas', message: 'Olá {nome}! Seja bem-vindo(a) ao nosso grupo VIP! 🎉' },
  { label: 'Renovação', message: 'Olá {nome}! Obrigado por renovar conosco! 💪' },
  { label: 'Cobrança', message: 'Olá {nome}! Notamos que seu plano venceu. Podemos ajudar com a renovação?' },
];

export function WhatsAppMessageDialog({ open, onOpenChange, clientName, phone }: WhatsAppMessageDialogProps) {
  const [message, setMessage] = useState('');

  const formatWhatsAppNumber = (phoneNumber: string) => {
    return phoneNumber.replace(/\D/g, '');
  };

  const handleSend = () => {
    const formattedNumber = formatWhatsAppNumber(phone);
    const encodedMessage = encodeURIComponent(message.replace('{nome}', clientName));
    window.open(`https://wa.me/${formattedNumber}?text=${encodedMessage}`, '_blank');
    onOpenChange(false);
    setMessage('');
  };

  const applyTemplate = (template: string) => {
    setMessage(template.replace('{nome}', clientName));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-stat-green" />
            Enviar mensagem para {clientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Modelos de mensagem</Label>
            <div className="flex flex-wrap gap-2">
              {MESSAGE_TEMPLATES.map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => applyTemplate(template.message)}
                  className="text-xs"
                >
                  {template.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensagem personalizada</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem aqui... Use {nome} para inserir o nome do cliente."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={!message.trim()}
            className="bg-stat-green hover:bg-stat-green/90"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Enviar no WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
