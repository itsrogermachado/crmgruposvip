import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Flame } from 'lucide-react';
import type { PublicPlan } from '@/hooks/usePublicPlans';

interface PlanCardProps {
  plan: PublicPlan;
  onSelect: (planId: string) => void;
  isSelected?: boolean;
}

export function PlanCard({ plan, onSelect, isSelected }: PlanCardProps) {
  const isAnnual = plan.duration_days >= 365;
  
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  const formatDuration = (days: number) => {
    if (days === 1) return '1 dia';
    if (days === 7) return '1 semana';
    if (days === 30) return '1 mês';
    if (days === 365) return '1 ano';
    return `${days} dias`;
  };

  return (
    <Card 
      className={`relative transition-all ${
        isAnnual 
          ? 'ring-2 ring-amber-500 shadow-xl scale-[1.02] md:scale-105 border-amber-500/50 bg-gradient-to-b from-amber-500/5 to-transparent' 
          : ''
      } ${
        isSelected 
          ? 'ring-2 ring-primary shadow-lg' 
          : 'hover:shadow-md'
      }`}
    >
      {/* Selo de destaque para plano anual */}
      {isAnnual && (
        <div className="absolute -top-3 -right-2 z-10">
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg px-3 py-1.5 text-xs font-bold animate-pulse">
            <Flame className="w-3.5 h-3.5 mr-1" />
            MAIOR ECONOMIA
          </Badge>
        </div>
      )}
      
      {isSelected && !isAnnual && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
          Selecionado
        </div>
      )}
      
      {isSelected && isAnnual && (
        <div className="absolute -top-3 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
          Selecionado
        </div>
      )}
      
      <CardHeader className={`text-center ${isAnnual ? 'pb-2 pt-6' : 'pb-2'}`}>
        <CardTitle className={`${isAnnual ? 'text-2xl text-amber-600 dark:text-amber-400' : 'text-xl'}`}>
          {plan.name}
        </CardTitle>
        {plan.description && (
          <CardDescription className="text-sm">{plan.description}</CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="text-center space-y-4">
        <div>
          <span className={`font-bold ${isAnnual ? 'text-5xl text-amber-600 dark:text-amber-400' : 'text-4xl text-foreground'}`}>
            {formatPrice(plan.price_cents)}
          </span>
          <span className="text-muted-foreground">/{formatDuration(plan.duration_days)}</span>
        </div>
        
        {/* Mensagem de economia para plano anual */}
        {isAnnual && (
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-lg py-2 px-3">
            💰 Economize mais de 35% em relação ao mensal
          </p>
        )}
        
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            Acesso completo ao sistema
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            Suporte via WhatsApp
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            {formatDuration(plan.duration_days)} de acesso
          </li>
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          className={`w-full ${isAnnual ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg' : ''}`}
          onClick={() => onSelect(plan.id)}
          variant={isSelected ? 'secondary' : isAnnual ? 'default' : 'default'}
        >
          {isSelected ? 'Selecionado' : isAnnual ? '🔥 Escolher Plano Anual' : 'Selecionar Plano'}
        </Button>
      </CardFooter>
    </Card>
  );
}
