import { Clock, Calendar, Info, AlertTriangle } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export function SubscriptionCountdown() {
  const { subscription, daysRemaining, expiresAtFormatted, urgencyLevel, isAdmin, loading } = useSubscription();
  const navigate = useNavigate();

  // Don't show for admins or while loading
  if (loading || isAdmin || !subscription) {
    return null;
  }

  const getUrgencyStyles = () => {
    switch (urgencyLevel) {
      case 'safe':
        return {
          container: 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400',
          icon: 'text-green-500',
          badge: 'bg-green-500/20 text-green-700 dark:text-green-300'
        };
      case 'warning':
        return {
          container: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400',
          icon: 'text-yellow-500',
          badge: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
        };
      case 'danger':
        return {
          container: 'bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-400',
          icon: 'text-orange-500',
          badge: 'bg-orange-500/20 text-orange-700 dark:text-orange-300'
        };
      case 'critical':
        return {
          container: 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400',
          icon: 'text-red-500',
          badge: 'bg-red-500/20 text-red-700 dark:text-red-300'
        };
      default:
        return {
          container: 'bg-muted border-border text-muted-foreground',
          icon: 'text-muted-foreground',
          badge: 'bg-muted text-muted-foreground'
        };
    }
  };

  const styles = getUrgencyStyles();

  const getMessage = () => {
    if (daysRemaining === null) return '';
    if (daysRemaining <= 0) return 'Assinatura vencida';
    if (daysRemaining === 1) return '1 dia restante';
    return `${daysRemaining} dias restantes`;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm cursor-help transition-colors',
            styles.container
          )}>
            {urgencyLevel === 'critical' || urgencyLevel === 'danger' ? (
              <AlertTriangle className={cn('w-4 h-4', styles.icon)} />
            ) : (
              <Clock className={cn('w-4 h-4', styles.icon)} />
            )}
            
            <span className="font-medium">{getMessage()}</span>
            
            {expiresAtFormatted && (
              <span className={cn('text-xs px-1.5 py-0.5 rounded', styles.badge)}>
                {expiresAtFormatted}
              </span>
            )}

            {(urgencyLevel === 'danger' || urgencyLevel === 'critical') && (
              <Button 
                size="sm" 
                variant="outline" 
                className="h-6 text-xs ml-1"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/plans');
                }}
              >
                Renovar
              </Button>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs p-3">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Seus dados estão seguros!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Quando sua assinatura vencer, seu acesso será temporariamente pausado, 
                  mas <strong>nenhum dado será perdido</strong>. Todos os seus clientes, 
                  grupos e histórico continuarão salvos.
                </p>
              </div>
            </div>
            {expiresAtFormatted && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t">
                <Calendar className="w-3 h-3" />
                <span>Vence em: {expiresAtFormatted}</span>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
