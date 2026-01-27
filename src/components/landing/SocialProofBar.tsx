import { Users, TrendingUp, RefreshCw, Shield } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '+500',
    label: 'Grupos Ativos',
  },
  {
    icon: TrendingUp,
    value: 'R$2M+',
    label: 'Gerenciados',
  },
  {
    icon: RefreshCw,
    value: '98%',
    label: 'Taxa de Renovação',
  },
  {
    icon: Shield,
    value: '99.9%',
    label: 'Uptime',
  },
];

export function SocialProofBar() {
  return (
    <section className="py-12 bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="flex flex-col items-center text-center animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-2xl md:text-3xl font-bold text-foreground">
                {stat.value}
              </span>
              <span className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
