import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'Ativo' | 'Vencido' | 'Próximo';
}

const statusConfig = {
  Ativo: {
    bg: 'bg-gradient-to-r from-status-active-bg to-status-active-bg/50',
    text: 'text-status-active',
    border: 'border-status-active/30',
    glow: 'status-badge-active',
  },
  Vencido: {
    bg: 'bg-gradient-to-r from-status-expired-bg to-status-expired-bg/50',
    text: 'text-status-expired',
    border: 'border-status-expired/30',
    glow: 'status-badge-expired',
  },
  Próximo: {
    bg: 'bg-gradient-to-r from-status-warning-bg to-status-warning-bg/50',
    text: 'text-status-warning',
    border: 'border-status-warning/30',
    glow: 'status-badge-warning',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300',
      config.bg,
      config.text,
      config.border,
      config.glow
    )}>
      <span className={cn(
        'w-1.5 h-1.5 rounded-full',
        status === 'Ativo' && 'bg-status-active',
        status === 'Vencido' && 'bg-status-expired',
        status === 'Próximo' && 'bg-status-warning animate-pulse'
      )} />
      {status}
    </span>
  );
}
