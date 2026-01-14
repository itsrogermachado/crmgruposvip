import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PixResponse {
  paymentId: string;
  subscriptionId: string;
  qrCode: string;
  qrCodeBase64: string;
  externalId: string;
  value: number;
  status: string;
}

interface PaymentStatusResponse {
  status: 'pending' | 'paid';
  paid_at?: string;
  error?: string;
}

export function useCheckout() {
  const { toast } = useToast();
  const [pixData, setPixData] = useState<PixResponse | null>(null);

  const createPixMutation = useMutation({
    mutationFn: async (planId: string): Promise<PixResponse> => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Usuário não autenticado');
      }

      const response = await supabase.functions.invoke('create-pix', {
        body: { planId },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Erro ao criar PIX');
      }

      return response.data;
    },
    onSuccess: (data) => {
      setPixData(data);
      toast({
        title: 'PIX gerado!',
        description: 'Escaneie o QR Code ou copie o código para pagar.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao gerar PIX',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const usePaymentStatus = (paymentId: string | null) => {
    return useQuery<PaymentStatusResponse | null>({
      queryKey: ['payment-status', paymentId],
      queryFn: async (): Promise<PaymentStatusResponse | null> => {
        if (!paymentId) return null;

        // Call edge function to check status directly on PushinPay
        const response = await supabase.functions.invoke('check-payment-status', {
          body: { paymentId },
        });

        if (response.error) {
          console.error('Error checking payment status:', response.error);
          throw new Error(response.error.message);
        }

        return response.data as PaymentStatusResponse;
      },
      enabled: !!paymentId,
      // Disable aggressive polling - rely on realtime updates instead
      // Only allow manual refresh via refetch
      refetchInterval: false,
      staleTime: Infinity,
    });
  };

  return {
    pixData,
    setPixData,
    createPix: createPixMutation.mutate,
    isCreatingPix: createPixMutation.isPending,
    usePaymentStatus,
  };
}
