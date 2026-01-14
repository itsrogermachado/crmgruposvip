import { MessageCircle, Pencil, Trash2, FileText, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { Client } from '@/types/client';

interface MobileClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
  onWhatsApp: (client: Client) => void;
}

export function MobileClientCard({ client, onEdit, onDelete, onWhatsApp }: MobileClientCardProps) {
  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className="glass-card p-3 sm:p-4 rounded-xl space-y-2.5 sm:space-y-3 animate-fade-in">
      {/* Header: Name + Status */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h3 className="font-semibold text-foreground truncate text-sm sm:text-base">{client.nome}</h3>
            {client.observacoes && (
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary/60 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">{client.telefone}</p>
        </div>
        <StatusBadge status={client.status} />
      </div>

      {/* Info Row */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
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
      <div className="flex items-center gap-1.5 sm:gap-2 pt-0.5 sm:pt-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onWhatsApp(client)}
          className="flex-1 gap-1.5 sm:gap-2 border-stat-green/30 text-stat-green hover:bg-stat-green/10 h-8 sm:h-9 text-xs sm:text-sm"
        >
          <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          WhatsApp
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(client)}
          className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
        >
          <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(client.id)}
          className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Button>
      </div>
    </div>
  );
}
