import { AlertTriangle, MessageCircle, Clock } from 'lucide-react';
import { Client } from '@/hooks/useClients';
import { Button } from '@/components/ui/button';
import { parseBRDate } from '@/lib/dateUtils';
import { differenceInDays } from 'date-fns';
import { useMemo } from 'react';

interface ExpiringClientsAlertProps {
  clients: Client[];
  onWhatsApp?: (client: Client) => void;
}

export function ExpiringClientsAlert({ clients, onWhatsApp }: ExpiringClientsAlertProps) {
  const expiringClients = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return clients
      .filter(c => {
        if (c.status === 'Vencido') return true;
        const dueDate = parseBRDate(c.data_vencimento);
        if (!dueDate) return false;
        const diff = differenceInDays(dueDate, today);
        return diff >= 0 && diff <= 3;
      })
      .sort((a, b) => {
        const dateA = parseBRDate(a.data_vencimento);
        const dateB = parseBRDate(b.data_vencimento);
        if (!dateA || !dateB) return 0;
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5);
  }, [clients]);

  if (expiringClients.length === 0) return null;

  const vencidos = expiringClients.filter(c => c.status === 'Vencido').length;
  const proximos = expiringClients.length - vencidos;

  return (
    <div className="mx-4 md:mx-6 mt-4">
      <div className="rounded-xl border border-status-warning/30 bg-status-warning-bg/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-status-warning" />
          <h3 className="font-semibold text-sm text-foreground">
            Atenção: {vencidos > 0 && `${vencidos} vencido${vencidos > 1 ? 's' : ''}`}
            {vencidos > 0 && proximos > 0 && ' e '}
            {proximos > 0 && `${proximos} vencendo em breve`}
          </h3>
        </div>
        <div className="space-y-2">
          {expiringClients.map(client => {
            const dueDate = parseBRDate(client.data_vencimento);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const diff = dueDate ? differenceInDays(dueDate, today) : -1;
            
            return (
              <div key={client.id} className="flex items-center justify-between gap-2 py-1.5 px-3 rounded-lg bg-background/60">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    client.status === 'Vencido' ? 'bg-status-expired' : 'bg-status-warning animate-pulse'
                  }`} />
                  <span className="text-sm font-medium truncate">{client.nome}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {client.status === 'Vencido' 
                      ? 'Vencido' 
                      : diff === 0 
                        ? 'Vence hoje' 
                        : diff === 1 
                          ? 'Vence amanhã' 
                          : `Vence em ${diff} dias`}
                  </span>
                </div>
                {onWhatsApp && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onWhatsApp(client)}
                    className="h-7 px-2 text-stat-green hover:text-stat-green hover:bg-stat-green/10 flex-shrink-0"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
