import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'Ativo' | 'Vencido' | 'Próximo';
}

const statusStyles = {
  Ativo: 'bg-status-active-bg text-status-active',
  Vencido: 'bg-status-expired-bg text-status-expired',
  Próximo: 'bg-status-warning-bg text-status-warning',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={cn(
      'px-3 py-1 rounded-full text-xs font-medium',
      statusStyles[status]
    )}>
      {status}
    </span>
  );
}
