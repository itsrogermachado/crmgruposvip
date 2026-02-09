import { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { MessageCircle, Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { useMessageTemplates } from '@/hooks/useMessageTemplates';

interface WhatsAppMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string;
  phone: string;
  status?: string;
  dataVencimento?: string;
}

export function WhatsAppMessageDialog({ open, onOpenChange, clientName, phone, status, dataVencimento }: WhatsAppMessageDialogProps) {
  const [message, setMessage] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState('');
  const [newMessage, setNewMessage] = useState('');
  
  const { templates, isLoading, createTemplate, updateTemplate, deleteTemplate } = useMessageTemplates();

  // Auto-fill message when dialog opens and client is expired
  useEffect(() => {
    if (open && status === 'Vencido' && dataVencimento) {
      const expiredMessage = `Olá ${clientName}! 👋\n\nNotamos que sua assinatura VIP venceu em ${dataVencimento}.\n\nPara continuar aproveitando todos os benefícios exclusivos, entre em contato conosco para renovar seu plano.\n\nAguardamos seu retorno! 🚀`;
      setMessage(expiredMessage);
    } else if (open) {
      setMessage('');
    }
  }, [open, status, dataVencimento, clientName]);

  const formatWhatsAppNumber = (phoneNumber: string) => {
    return phoneNumber.replace(/\D/g, '');
  };

  const handleSend = () => {
    const formattedNumber = formatWhatsAppNumber(phone);
    const encodedMessage = encodeURIComponent(message.replace(/{nome}/g, clientName));
    window.open(`https://wa.me/${formattedNumber}?text=${encodedMessage}`, '_blank');
    onOpenChange(false);
    setMessage('');
  };

  const applyTemplate = (templateMessage: string) => {
    setMessage(templateMessage.replace(/{nome}/g, clientName));
  };

  const handleCreateTemplate = () => {
    if (!newLabel.trim() || !newMessage.trim()) return;
    createTemplate.mutate({ label: newLabel, message: newMessage }, {
      onSuccess: () => {
        setIsCreating(false);
        setNewLabel('');
        setNewMessage('');
      }
    });
  };

  const handleUpdateTemplate = (id: string) => {
    if (!newLabel.trim() || !newMessage.trim()) return;
    updateTemplate.mutate({ id, label: newLabel, message: newMessage }, {
      onSuccess: () => {
        setEditingId(null);
        setNewLabel('');
        setNewMessage('');
      }
    });
  };

  const handleDeleteTemplate = (id: string) => {
    deleteTemplate.mutate(id);
  };

  const startEditing = (template: { id: string; label: string; message: string }) => {
    setEditingId(template.id);
    setNewLabel(template.label);
    setNewMessage(template.message);
    setIsCreating(false);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setIsCreating(false);
    setNewLabel('');
    setNewMessage('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-stat-green" />
            Enviar mensagem para {clientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Templates Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Modelos de mensagem</Label>
              {!isCreating && !editingId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCreating(true)}
                  className="h-8 text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Novo modelo
                </Button>
              )}
            </div>

            {/* Create/Edit Form */}
            {(isCreating || editingId) && (
              <div className="p-3 border rounded-lg space-y-2 bg-muted/30">
                <Input
                  placeholder="Nome do modelo (ex: Cobrança PIX)"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="h-8 text-sm"
                />
                <Textarea
                  placeholder="Mensagem... Use {nome} para o nome do cliente"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={3}
                  className="text-sm"
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={cancelEditing}>
                    <X className="w-3 h-3 mr-1" />
                    Cancelar
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => editingId ? handleUpdateTemplate(editingId) : handleCreateTemplate()}
                    disabled={!newLabel.trim() || !newMessage.trim()}
                  >
                    <Check className="w-3 h-3 mr-1" />
                    {editingId ? 'Salvar' : 'Criar'}
                  </Button>
                </div>
              </div>
            )}

            {/* Templates List */}
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Carregando...</p>
            ) : templates.length === 0 && !isCreating ? (
              <p className="text-sm text-muted-foreground">
                Nenhum modelo criado. Clique em "Novo modelo" para adicionar.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {templates.map((template) => (
                  <div key={template.id} className="flex items-center gap-1 group">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => applyTemplate(template.message)}
                      className="text-xs"
                    >
                      {template.label}
                    </Button>
                    <div className="hidden group-hover:flex gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => startEditing(template)}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Input */}
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
