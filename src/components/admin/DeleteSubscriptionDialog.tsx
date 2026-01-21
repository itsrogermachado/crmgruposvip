import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Subscription, useDeleteSubscription } from '@/hooks/useAdminData';

interface DeleteSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: Subscription | null;
}

export function DeleteSubscriptionDialog({
  open,
  onOpenChange,
  subscription,
}: DeleteSubscriptionDialogProps) {
  const deleteMutation = useDeleteSubscription();

  if (!subscription) return null;

  const handleDelete = () => {
    deleteMutation.mutate(subscription.id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Assinatura</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a assinatura de{' '}
            <strong>{subscription.profiles?.email || 'usuário desconhecido'}</strong>?
            <br />
            <br />
            Esta ação não pode ser desfeita. A assinatura será permanentemente
            removida do sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
