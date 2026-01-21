import { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Pencil, Trash2, Send, FileText, Users, Receipt, Upload, Loader2, ArrowUpDown, ArrowUp, ArrowDown, History } from 'lucide-react';
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
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

type SortField = 'nome' | 'preco' | 'dataVencimento' | 'status';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

const statusOrder = { 'Vencido': 0, 'Próximo': 1, 'Ativo': 2 };

export function ClientTable({ clients, onEdit, onDelete, onClientUpdate }: ClientTableProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
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

  // Sorting logic
  const sortedClients = useMemo(() => {
    if (!sortField) return clients;

    return [...clients].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'nome':
          comparison = a.nome.localeCompare(b.nome, 'pt-BR');
          break;
        case 'preco':
          comparison = a.preco - b.preco;
          break;
        case 'dataVencimento': {
          const parseDate = (dateStr: string): Date => {
            if (dateStr.includes('/')) {
              const [day, month, year] = dateStr.split('/');
              return new Date(Number(year), Number(month) - 1, Number(day));
            }
            return new Date(dateStr);
          };
          const dateA = parseDate(a.dataVencimento);
          const dateB = parseDate(b.dataVencimento);
          comparison = dateA.getTime() - dateB.getTime();
          break;
        }
        case 'status':
          comparison = (statusOrder[a.status as keyof typeof statusOrder] || 0) - 
                      (statusOrder[b.status as keyof typeof statusOrder] || 0);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [clients, sortField, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(sortedClients.length / ITEMS_PER_PAGE);
  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedClients.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedClients, currentPage]);

  // Reset to page 1 when clients change
  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [clients.length, totalPages, currentPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 text-muted-foreground/50" />;
    return sortDirection === 'asc' ? 
      <ArrowUp className="w-4 h-4 text-primary" /> : 
      <ArrowDown className="w-4 h-4 text-primary" />;
  };

  const openComprovanteModal = (url: string, clientName: string, clientId: string) => {
    setComprovanteDialog({ open: true, url, clientName, clientId });
  };

  const handleUpdateComprovante = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !comprovanteDialog.clientId) return;

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
      const fileName = `${comprovanteDialog.clientId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('comprovantes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('comprovantes')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('clients')
        .update({ comprovante_url: publicUrl })
        .eq('id', comprovanteDialog.clientId);

      if (updateError) throw updateError;

      setComprovanteDialog(prev => ({ ...prev, url: publicUrl }));

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

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const openWhatsAppDialog = (client: Client) => {
    setWhatsappDialog({ open: true, client });
  };

  const handleViewPaymentHistory = (clientId: string) => {
    navigate(`/client/${clientId}/payments`);
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
        {paginatedClients.map((client, index) => (
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
        
        {/* Mobile Pagination */}
        {totalPages > 1 && (
          <div className="pt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="text-sm text-muted-foreground px-4">
                    {currentPage} de {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Desktop: Table */}
      <div className="hidden lg:block data-table mx-4 md:mx-6 mb-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead 
                className="font-semibold text-muted-foreground uppercase text-xs tracking-wider cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('nome')}
              >
                <div className="flex items-center gap-2">
                  Cliente
                  {getSortIcon('nome')}
                </div>
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                Contato
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                Plano
              </TableHead>
              <TableHead 
                className="font-semibold text-muted-foreground uppercase text-xs tracking-wider cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('preco')}
              >
                <div className="flex items-center gap-2">
                  Preço
                  {getSortIcon('preco')}
                </div>
              </TableHead>
              <TableHead 
                className="font-semibold text-muted-foreground uppercase text-xs tracking-wider cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('dataVencimento')}
              >
                <div className="flex items-center gap-2">
                  Vencimento
                  {getSortIcon('dataVencimento')}
                </div>
              </TableHead>
              <TableHead 
                className="font-semibold text-muted-foreground uppercase text-xs tracking-wider cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  Status
                  {getSortIcon('status')}
                </div>
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedClients.map((client, index) => (
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
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewPaymentHistory(client.id)}
                            className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10 transition-all duration-300"
                          >
                            <History className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Histórico de pagamentos</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openComprovanteModal(client.comprovanteUrl || '', client.nome, client.id)}
                            className={`h-8 w-8 transition-all duration-300 ${
                              client.comprovanteUrl 
                                ? 'text-stat-green hover:text-stat-green hover:bg-stat-green/10' 
                                : 'text-primary hover:text-primary hover:bg-primary/10'
                            }`}
                          >
                            {client.comprovanteUrl ? (
                              <Receipt className="w-4 h-4" />
                            ) : (
                              <Upload className="w-4 h-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{client.comprovanteUrl ? 'Ver comprovante' : 'Adicionar comprovante'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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

        {/* Desktop Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, sortedClients.length)} de {sortedClients.length} clientes
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNum)}
                        isActive={currentPage === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
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
            {comprovanteDialog.url ? (
              <img
                src={comprovanteDialog.url}
                alt={`Comprovante de ${comprovanteDialog.clientName}`}
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
    </>
  );
}
