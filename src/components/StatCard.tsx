import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant: 'blue' | 'purple' | 'yellow' | 'red' | 'cyan' | 'green';
}

const variantStyles = {
  blue: 'bg-stat-blue/10 text-stat-blue',
  purple: 'bg-stat-purple/10 text-stat-purple',
  yellow: 'bg-stat-yellow/10 text-stat-yellow',
  red: 'bg-stat-red/10 text-stat-red',
  cyan: 'bg-stat-cyan/10 text-stat-cyan',
  green: 'bg-stat-green/10 text-stat-green',
};

const iconBgStyles = {
  blue: 'bg-stat-blue',
  purple: 'bg-stat-purple',
  yellow: 'bg-stat-yellow',
  red: 'bg-stat-red',
  cyan: 'bg-stat-cyan',
  green: 'bg-stat-green',
};

export function StatCard({ title, value, icon: Icon, variant }: StatCardProps) {
  return (
    <div className={cn('stat-card', variantStyles[variant])}>
      <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <div className={cn('stat-icon', iconBgStyles[variant])}>
        <Icon className="w-6 h-6 text-primary-foreground" />
      </div>
    </div>
  );
}
