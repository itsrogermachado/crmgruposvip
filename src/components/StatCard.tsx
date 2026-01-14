import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant: 'blue' | 'purple' | 'yellow' | 'red' | 'cyan' | 'green';
  delay?: number;
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

export function StatCard({ title, value, icon: Icon, variant, delay = 0 }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState<string | number>(typeof value === 'number' ? 0 : value);
  const [isVisible, setIsVisible] = useState(false);
  const styles = variantStyles[variant];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 100);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (typeof value === 'number' && isVisible) {
      const duration = 1000;
      const steps = 30;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, isVisible]);

  return (
    <div 
      className={cn(
        'stat-card opacity-0',
        isVisible && 'animate-fade-in-up',
        `hover:shadow-xl ${styles.glow}`
      )}
      style={{ animationDelay: `${delay * 100}ms`, animationFillMode: 'forwards' }}
    >
      {/* Gradient overlay */}
      <div className={cn(
        'absolute inset-0 rounded-xl opacity-50 bg-gradient-to-br',
        styles.bg
      )} />
      
      {/* Content */}
      <div className="relative z-10">
        <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
        <p className="text-3xl font-bold text-foreground tracking-tight">{displayValue}</p>
      </div>
      
      {/* Icon */}
      <div className={cn(
        'stat-icon bg-gradient-to-br text-white',
        styles.icon
      )}>
        <Icon className="w-7 h-7 animate-float" />
      </div>
    </div>
  );
}
