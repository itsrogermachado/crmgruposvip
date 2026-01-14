import { useState } from 'react';
import { MessageCircle, Send, ExternalLink } from 'lucide-react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface ClientToNotify {
  id: string;
  nome: string;
  telefone: string;
  dataVencimento: string;
  status: string;
}

interface NotifyClientsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: ClientToNotify[];
}

export function NotifyClientsDialog({ open, onOpenChange, clients }: NotifyClientsDialogProps) {
  const [message, setMessage] = useState(
    'Olá {nome}! 👋\n\nNotamos que sua assinatura VIP venceu em {dataVencimento}.\n\nPara continuar aproveitando todos os benefícios exclusivos, entre em contato conosco para renovar seu plano.\n\nAguardamos seu retorno! 🚀'
  );
  const [selectedClients, setSelectedClients] = useState<Set<string>>(
    new Set(clients.map(c => c.id))
  );
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState<Set<string>>(new Set());

  const toggleClient = (clientId: string) => {
    const newSelected = new Set(selectedClients);
    if (newSelected.has(clientId)) {
      newSelected.delete(clientId);
    } else {
      newSelected.add(clientId);
    }
    setSelectedClients(newSelected);
  };

  const toggleAll = () => {
    if (selectedClients.size === clients.length) {
      setSelectedClients(new Set());
    } else {
      setSelectedClients(new Set(clients.map(c => c.id)));
    }
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/\D/g, '');
  };

  const getPersonalizedMessage = (client: ClientToNotify) => {
    return message
      .replace('{nome}', client.nome.split(' ')[0])
      .replace('{dataVencimento}', client.dataVencimento);
  };

  const openWhatsApp = (client: ClientToNotify) => {
    const personalizedMessage = getPersonalizedMessage(client);
    const phone = formatPhone(client.telefone);
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(personalizedMessage)}`;
    window.open(url, '_blank');
    setSentTo(prev => new Set([...prev, client.id]));
  };

  const sendToSelected = () => {
    setSending(true);
    const clientsToSend = clients.filter(c => selectedClients.has(c.id) && !sentTo.has(c.id));
    
    clientsToSend.forEach((client, index) => {
      setTimeout(() => {
        openWhatsApp(client);
      }, index * 1000); // 1 second delay between each to avoid browser blocking
    });
    
    setTimeout(() => {
      setSending(false);
    }, clientsToSend.length * 1000);
  };

  const selectedCount = selectedClients.size;
  const pendingCount = clients.filter(c => selectedClients.has(c.id) && !sentTo.has(c.id)).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-500" />
            Notificar Clientes via WhatsApp
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Mensagem (use {'{nome}'} e {'{dataVencimento}'} como variáveis)</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Clientes para notificar ({selectedCount} selecionados)</Label>
              <Button variant="ghost" size="sm" onClick={toggleAll}>
                {selectedClients.size === clients.length ? 'Desmarcar todos' : 'Selecionar todos'}
              </Button>
            </div>
            
            <ScrollArea className="h-[200px] border rounded-md p-2">
              {clients.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  Nenhum cliente vencido
                </div>
              ) : (
                <div className="space-y-2">
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        checked={selectedClients.has(client.id)}
                        onCheckedChange={() => toggleClient(client.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{client.nome}</p>
                        <p className="text-sm text-muted-foreground">{client.telefone}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-red-600 border-red-600">
                          Venceu: {client.dataVencimento}
                        </Badge>
                        {sentTo.has(client.id) && (
                          <Badge className="bg-green-500">Enviado</Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openWhatsApp(client)}
                        title="Abrir WhatsApp"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button
            onClick={sendToSelected}
            disabled={pendingCount === 0 || sending}
            className="bg-green-600 hover:bg-green-700"
          >
            <Send className="h-4 w-4 mr-2" />
            {sending ? 'Abrindo...' : `Enviar para ${pendingCount} cliente${pendingCount !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
