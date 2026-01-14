import { useState, useRef } from 'react';
import { MessageCircle, Pencil, Trash2, Send, FileText, Users, Receipt, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { StatusBadge } from './StatusBadge';
import { WhatsAppMessageDialog } from './WhatsAppMessageDialog';
import { MobileClientCard } from './MobileClientCard';
import { Client } from '@/types/client';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ClientTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
  onClientUpdate?: () => void;
}

export function ClientTable({ clients, onEdit, onDelete, onClientUpdate }: ClientTableProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  
  const [whatsappDialog, setWhatsappDialog] = useState<{ 
    open: boolean; 
    client: Client | null 
  }>({
    open: false,
    client: null,
  });

  const [comprovanteDialog, setComprovanteDialog] = useState<{
    open: boolean;
    url: string | null;
    clientName: string;
    clientId: string;
  }>({
    open: false,
    url: null,
    clientName: '',
    clientId: '',
  });

  const openComprovanteModal = (url: string, clientName: string, clientId: string) => {
    setComprovanteDialog({ open: true, url, clientName, clientId });
  };

  const handleUpdateComprovante = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !comprovanteDialog.clientId) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas imagens.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
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
      const fileName = `${comprovanteDialog.clientId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('comprovantes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('comprovantes')
        .getPublicUrl(filePath);

      // Update client record
      const { error: updateError } = await supabase
        .from('clients')
        .update({ comprovante_url: publicUrl })
        .eq('id', comprovanteDialog.clientId);

      if (updateError) throw updateError;

      // Update modal with new URL
      setComprovanteDialog(prev => ({ ...prev, url: publicUrl }));

      toast({
        title: "Sucesso",
        description: "Comprovante atualizado com sucesso!",
      });

      // Notify parent to refresh list
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
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const openWhatsAppDialog = (client: Client) => {
    setWhatsappDialog({ open: true, client });
  };

  if (clients.length === 0) {
    return (
      <div className="mx-4 md:mx-6 mb-6 p-8 md:p-12 text-center animate-fade-in glass-card rounded-xl">
        <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 mb-4">
          <Users className="w-7 h-7 md:w-8 md:h-8 text-primary" />
        </div>
        <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">Nenhum cliente encontrado</h3>
        <p className="text-sm text-muted-foreground">Adicione seu primeiro cliente clicando em "Novo Cliente"</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile: Card List */}
      <div className="lg:hidden mx-4 pb-24 space-y-2.5 sm:space-y-3">
        {clients.map((client, index) => (
          <div
            key={client.id}
            style={{ animationDelay: `${0.1 + index * 0.05}s` }}
          >
            <MobileClientCard
              client={client}
              onEdit={onEdit}
              onDelete={onDelete}
              onWhatsApp={openWhatsAppDialog}
              onClientUpdate={onClientUpdate}
            />
          </div>
        ))}
      </div>

      {/* Desktop: Table */}
      <div className="hidden lg:block data-table mx-4 md:mx-6 mb-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                Cliente
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                Contato
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                Plano
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                Preço
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                Vencimento
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                Status
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client, index) => (
              <TableRow 
                key={client.id} 
                className="table-row-animated opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${0.5 + index * 0.05}s`, animationFillMode: 'forwards' }}
              >
                <TableCell className="font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{client.nome}</span>
                    {client.observacoes && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <FileText className="w-4 h-4 text-primary/60 hover:text-primary transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[300px] bg-popover border-border">
                            <p className="text-sm">{client.observacoes}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => openWhatsAppDialog(client)}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 transition-all duration-300 hover:translate-x-1"
                  >
                    <span className="font-medium">{client.telefone}</span>
                    <MessageCircle className="w-4 h-4 text-stat-green" />
                  </button>
                  {client.discord && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MessageCircle className="w-3 h-3" />
                      {client.discord}
                    </span>
                  )}
                  {client.telegram && (
                    <span className="text-xs text-stat-cyan flex items-center gap-1 mt-0.5">
                      <Send className="w-3 h-3" />
                      {client.telegram}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-sm font-medium">
                    {client.plano}
                  </span>
                </TableCell>
                <TableCell className="font-semibold text-foreground">
                  {formatCurrency(client.preco)}
                </TableCell>
                <TableCell>
                  <div>
                    <span className="text-foreground font-medium block">{client.dataVencimento}</span>
                    <span className="text-xs text-muted-foreground">
                      Entrada: {client.dataEntrada}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={client.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {client.comprovanteUrl && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openComprovanteModal(client.comprovanteUrl!, client.nome, client.id)}
                              className="h-8 w-8 text-stat-green hover:text-stat-green hover:bg-stat-green/10 transition-all duration-300"
                            >
                              <Receipt className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ver comprovante</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(client)}
                      className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(client.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {whatsappDialog.client && (
        <WhatsAppMessageDialog
          open={whatsappDialog.open}
          onOpenChange={(open) => setWhatsappDialog({ ...whatsappDialog, open })}
          clientName={whatsappDialog.client.nome}
          phone={whatsappDialog.client.telefone}
          status={whatsappDialog.client.status}
          dataVencimento={whatsappDialog.client.dataVencimento}
        />
      )}

      <Dialog open={comprovanteDialog.open} onOpenChange={(open) => setComprovanteDialog({ ...comprovanteDialog, open })}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-stat-green" />
              Comprovante - {comprovanteDialog.clientName}
            </DialogTitle>
            <DialogDescription>
              Visualização do comprovante de pagamento do cliente.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-4">
            {comprovanteDialog.url && (
              <img
                src={comprovanteDialog.url}
                alt={`Comprovante de ${comprovanteDialog.clientName}`}
                className="max-w-full max-h-[60vh] object-contain rounded-lg border border-border"
              />
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
    </>
  );
}
