import { useState, useRef } from 'react';
import { MessageCircle, Pencil, Trash2, FileText, Calendar, DollarSign, Receipt, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { StatusBadge } from './StatusBadge';
import { Client } from '@/types/client';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MobileClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
  onWhatsApp: (client: Client) => void;
  onClientUpdate?: () => void;
}

export function MobileClientCard({ client, onEdit, onDelete, onWhatsApp, onClientUpdate }: MobileClientCardProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [comprovanteOpen, setComprovanteOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(client.comprovanteUrl);
  
  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const handleUpdateComprovante = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas imagens.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${client.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('comprovantes')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('comprovantes')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('clients')
        .update({ comprovante_url: publicUrl })
        .eq('id', client.id);

      if (updateError) throw updateError;

      setCurrentUrl(publicUrl);

      toast({
        title: "Sucesso",
        description: "Comprovante atualizado com sucesso!",
      });

      onClientUpdate?.();
    } catch (error) {
      console.error('Error updating comprovante:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar comprovante. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
    <Dialog open={comprovanteOpen} onOpenChange={setComprovanteOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-stat-green" />
            Comprovante - {client.nome}
          </DialogTitle>
          <DialogDescription>
            Visualização do comprovante de pagamento do cliente.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-4">
          {(currentUrl || client.comprovanteUrl) ? (
            <img
              src={currentUrl || client.comprovanteUrl}
              alt={`Comprovante de ${client.nome}`}
              className="max-w-full max-h-[60vh] object-contain rounded-lg border border-border"
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Upload className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum comprovante cadastrado</p>
              <p className="text-sm text-muted-foreground/60">Clique no botão abaixo para adicionar</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleUpdateComprovante}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Atualizar Comprovante
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <div className="glass-card rounded-xl animate-fade-in" style={{ padding: 'clamp(0.75rem, 3vw, 1rem)' }}>
      {/* Header: Name + Status */}
      <div className="flex items-start justify-between" style={{ gap: 'clamp(0.5rem, 2vw, 0.75rem)', marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center" style={{ gap: 'clamp(0.375rem, 1.5vw, 0.5rem)' }}>
            <h3 className="font-semibold text-foreground truncate" style={{ fontSize: 'clamp(0.875rem, 3.5vw, 1rem)' }}>{client.nome}</h3>
            {client.observacoes && (
              <FileText className="text-primary/60 flex-shrink-0" style={{ width: 'clamp(0.875rem, 3.5vw, 1rem)', height: 'clamp(0.875rem, 3.5vw, 1rem)' }} />
            )}
          </div>
          <p className="text-muted-foreground" style={{ fontSize: 'clamp(0.75rem, 3vw, 0.875rem)' }}>{client.telefone}</p>
        </div>
        <StatusBadge status={client.status} />
      </div>

      {/* Info Row */}
      <div className="flex flex-wrap items-center" style={{ gap: 'clamp(0.5rem, 2vw, 0.75rem)', fontSize: 'clamp(0.75rem, 3vw, 0.875rem)', marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-primary/10 text-primary font-medium">
          {client.plano}
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          {formatCurrency(client.preco)}
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          {client.dataVencimento}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center" style={{ gap: 'clamp(0.375rem, 1.5vw, 0.5rem)', paddingTop: 'clamp(0.125rem, 0.5vw, 0.25rem)' }}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onWhatsApp(client)}
          className="flex-1 border-stat-green/30 text-stat-green hover:bg-stat-green/10"
          style={{ gap: 'clamp(0.375rem, 1.5vw, 0.5rem)', height: 'clamp(2rem, 8vw, 2.25rem)', fontSize: 'clamp(0.75rem, 3vw, 0.875rem)' }}
        >
          <MessageCircle style={{ width: 'clamp(0.875rem, 3.5vw, 1rem)', height: 'clamp(0.875rem, 3.5vw, 1rem)' }} />
          WhatsApp
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setComprovanteOpen(true)}
          className={`${
            client.comprovanteUrl || currentUrl
              ? 'text-stat-green hover:text-stat-green hover:bg-stat-green/10'
              : 'text-primary hover:text-primary hover:bg-primary/10'
          }`}
          style={{ width: 'clamp(2rem, 8vw, 2.25rem)', height: 'clamp(2rem, 8vw, 2.25rem)' }}
        >
          {client.comprovanteUrl || currentUrl ? (
            <Receipt style={{ width: 'clamp(0.875rem, 3.5vw, 1rem)', height: 'clamp(0.875rem, 3.5vw, 1rem)' }} />
          ) : (
            <Upload style={{ width: 'clamp(0.875rem, 3.5vw, 1rem)', height: 'clamp(0.875rem, 3.5vw, 1rem)' }} />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(client)}
          className="text-muted-foreground hover:text-primary hover:bg-primary/10"
          style={{ width: 'clamp(2rem, 8vw, 2.25rem)', height: 'clamp(2rem, 8vw, 2.25rem)' }}
        >
          <Pencil style={{ width: 'clamp(0.875rem, 3.5vw, 1rem)', height: 'clamp(0.875rem, 3.5vw, 1rem)' }} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(client.id)}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          style={{ width: 'clamp(2rem, 8vw, 2.25rem)', height: 'clamp(2rem, 8vw, 2.25rem)' }}
        >
          <Trash2 style={{ width: 'clamp(0.875rem, 3.5vw, 1rem)', height: 'clamp(0.875rem, 3.5vw, 1rem)' }} />
        </Button>
      </div>
    </div>
    </>
  );
}
