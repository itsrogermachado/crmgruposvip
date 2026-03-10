import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useClients, Client } from '@/hooks/useClients';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { StatusBadge } from './StatusBadge';

interface GlobalSearchProps {
  onSelectClient?: (client: Client) => void;
  onWhatsApp?: (client: Client) => void;
  onEdit?: (client: Client) => void;
}

export function GlobalSearch({ onSelectClient, onWhatsApp, onEdit }: GlobalSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { clients } = useClients();

  const filteredClients = query.length > 0
    ? clients.filter(c =>
        c.nome.toLowerCase().includes(query.toLowerCase()) ||
        c.telefone.includes(query) ||
        (c.discord && c.discord.toLowerCase().includes(query.toLowerCase())) ||
        (c.plano && c.plano.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 8)
    : [];

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSelect = (client: Client) => {
    setOpen(false);
    onEdit?.(client);
  };

  const handleWhatsApp = (e: React.MouseEvent, client: Client) => {
    e.stopPropagation();
    setOpen(false);
    onWhatsApp?.(client);
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 bg-background/50 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-200 text-sm"
      >
        <Search className="w-4 h-4" />
        <span className="hidden lg:inline">Buscar cliente...</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground border border-border/50">
          ⌘K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[540px] p-0 gap-0 overflow-hidden">
          <DialogTitle className="sr-only">Buscar cliente</DialogTitle>
          <div className="flex items-center gap-3 px-4 border-b border-border/50">
            <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome, telefone, plano..."
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-14 text-base bg-transparent"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {query.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-sm">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>Digite para buscar clientes</p>
                <p className="text-xs mt-1 opacity-60">Busque por nome, telefone ou plano</p>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-sm">
                <User className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>Nenhum cliente encontrado</p>
              </div>
            ) : (
              <div className="py-2">
                {filteredClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => handleSelect(client)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left group"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground text-sm truncate">{client.nome}</span>
                        <StatusBadge status={client.status} />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span>{client.telefone}</span>
                        <span>{client.plano}</span>
                        <span className="font-medium">{formatCurrency(client.preco)}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleWhatsApp(e, client)}
                      className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-stat-green transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
