import { Users, TrendingUp, RefreshCw, Shield } from 'lucide-react';

const stats = [
  { icon: Users, value: '+500', label: 'Grupos Ativos' },
  { icon: TrendingUp, value: 'R$2M+', label: 'Gerenciados' },
  { icon: RefreshCw, value: '98%', label: 'Taxa de Renovação' },
  { icon: Shield, value: '99.9%', label: 'Uptime' },
];

export function SocialProofBar() {
  return (
    <section className="py-14 border-y border-white/5 bg-[#0A0818]/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="flex flex-col items-center text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center mb-3">
                <stat.icon className="w-5 h-5 text-[#9D67ED]" />
              </div>
              <span className="text-2xl md:text-3xl font-bold text-white">
                {stat.value}
              </span>
              <span className="text-sm text-white/40 mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
