import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant: 'blue' | 'purple' | 'yellow' | 'red' | 'cyan' | 'green';
}

const variantStyles = {
  blue: {
    bg: 'from-stat-blue/20 to-stat-blue/5',
    icon: 'from-stat-blue to-stat-blue/70',
    glow: 'shadow-stat-blue/20',
  },
  purple: {
    bg: 'from-stat-purple/20 to-stat-purple/5',
    icon: 'from-stat-purple to-stat-purple/70',
    glow: 'shadow-stat-purple/20',
  },
  yellow: {
    bg: 'from-stat-yellow/20 to-stat-yellow/5',
    icon: 'from-stat-yellow to-stat-yellow/70',
    glow: 'shadow-stat-yellow/20',
  },
  red: {
    bg: 'from-stat-red/20 to-stat-red/5',
    icon: 'from-stat-red to-stat-red/70',
    glow: 'shadow-stat-red/20',
  },
  cyan: {
    bg: 'from-stat-cyan/20 to-stat-cyan/5',
    icon: 'from-stat-cyan to-stat-cyan/70',
    glow: 'shadow-stat-cyan/20',
  },
  green: {
    bg: 'from-stat-green/20 to-stat-green/5',
    icon: 'from-stat-green to-stat-green/70',
    glow: 'shadow-stat-green/20',
  },
};

export function StatCard({ title, value, icon: Icon, variant }: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div 
      className={cn(
        'stat-card',
        `hover:shadow-xl ${styles.glow}`
      )}
      style={{ 
        padding: 'clamp(0.75rem, 2vw, 1.5rem)',
        minHeight: 'clamp(80px, 12vw, 120px)'
      }}
    >
      {/* Gradient overlay */}
      <div className={cn(
        'absolute inset-0 rounded-xl opacity-50 bg-gradient-to-br',
        styles.bg
      )} />
      
      {/* Content */}
      <div className="relative z-10 pr-12 md:pr-16">
        <p className="text-responsive-sm font-medium text-muted-foreground mb-1 truncate">{title}</p>
        <p className="text-responsive-xl font-bold text-foreground tracking-tight">{value}</p>
      </div>
      
      {/* Icon */}
      <div 
        className={cn(
          'stat-icon bg-gradient-to-br text-white rounded-xl',
          styles.icon
        )}
        style={{
          width: 'clamp(2.25rem, 4vw, 3.5rem)',
          height: 'clamp(2.25rem, 4vw, 3.5rem)',
        }}
      >
        <Icon style={{ width: 'clamp(1.125rem, 2vw, 1.75rem)', height: 'clamp(1.125rem, 2vw, 1.75rem)' }} />
      </div>
    </div>
  );
}
