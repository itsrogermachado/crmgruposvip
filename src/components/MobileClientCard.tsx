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
  );
}
