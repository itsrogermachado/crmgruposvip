import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import type { PublicPlan } from '@/hooks/usePublicPlans';

interface PlanCardProps {
  plan: PublicPlan;
  onSelect: (planId: string) => void;
  isSelected?: boolean;
}

export function PlanCard({ plan, onSelect, isSelected }: PlanCardProps) {
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
    <Card className={`relative transition-all ${isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}`}>
      {isSelected && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
          Selecionado
        </div>
      )}
      
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        {plan.description && (
          <CardDescription className="text-sm">{plan.description}</CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="text-center space-y-4">
        <div>
          <span className="text-4xl font-bold text-foreground">{formatPrice(plan.price_cents)}</span>
          <span className="text-muted-foreground">/{formatDuration(plan.duration_days)}</span>
        </div>
        
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
          className="w-full" 
          onClick={() => onSelect(plan.id)}
          variant={isSelected ? 'secondary' : 'default'}
        >
          {isSelected ? 'Selecionado' : 'Selecionar Plano'}
        </Button>
      </CardFooter>
    </Card>
  );
}
