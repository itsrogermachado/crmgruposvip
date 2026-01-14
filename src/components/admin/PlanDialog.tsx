import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { SubscriptionPlan, useCreatePlan, useUpdatePlan } from '@/hooks/useAdminData';

const planSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  price: z.string().min(1, 'Preço é obrigatório'),
  duration_days: z.string().min(1, 'Duração é obrigatória'),
  is_active: z.boolean(),
});

type PlanFormData = z.infer<typeof planSchema>;

interface PlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: SubscriptionPlan | null;
}

export function PlanDialog({ open, onOpenChange, plan }: PlanDialogProps) {
  const createPlanMutation = useCreatePlan();
  const updatePlanMutation = useUpdatePlan();
  const isEditing = !!plan;

  const form = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      duration_days: '30',
      is_active: true,
    },
  });

  useEffect(() => {
    if (plan) {
      form.reset({
        name: plan.name,
        description: plan.description || '',
        price: (plan.price_cents / 100).toFixed(2).replace('.', ','),
        duration_days: plan.duration_days.toString(),
        is_active: plan.is_active,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        price: '',
        duration_days: '30',
        is_active: true,
      });
    }
  }, [plan, form]);

  const onSubmit = (data: PlanFormData) => {
    const priceInCents = Math.round(
      parseFloat(data.price.replace(',', '.')) * 100
    );

    const planData = {
      name: data.name,
      description: data.description || null,
      price_cents: priceInCents,
      duration_days: parseInt(data.duration_days),
      is_active: data.is_active,
    };

    if (isEditing && plan) {
      updatePlanMutation.mutate({ id: plan.id, ...planData }, {
        onSuccess: () => onOpenChange(false),
      });
    } else {
      createPlanMutation.mutate(planData, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const isPending = createPlanMutation.isPending || updatePlanMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Plano' : 'Novo Plano'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Plano</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Mensal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Ex: Acesso completo por 30 dias" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$)</FormLabel>
                    <FormControl>
                      <Input placeholder="49,90" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração (dias)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Plano Ativo</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Planos inativos não aparecem para novos clientes
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
