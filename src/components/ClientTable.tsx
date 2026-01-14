import { useState } from 'react';
import { MessageCircle, Pencil, Trash2, Send, FileText, Users } from 'lucide-react';
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
import { StatusBadge } from './StatusBadge';
import { WhatsAppMessageDialog } from './WhatsAppMessageDialog';
import { MobileClientCard } from './MobileClientCard';
import { Client } from '@/types/client';

interface ClientTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
}

export function ClientTable({ clients, onEdit, onDelete }: ClientTableProps) {
  const [whatsappDialog, setWhatsappDialog] = useState<{ 
    open: boolean; 
    client: Client | null 
  }>({
    open: false,
    client: null,
  });

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
      <div className="md:hidden mx-4 mb-20 space-y-3">
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
            />
          </div>
        ))}
      </div>

      {/* Desktop: Table */}
      <div className="hidden md:block data-table mx-6 mb-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
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
    </>
  );
}
