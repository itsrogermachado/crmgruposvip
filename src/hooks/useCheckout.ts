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
    return useQuery({
      queryKey: ['payment-status', paymentId],
      queryFn: async () => {
        if (!paymentId) return null;

        const { data, error } = await supabase
          .from('payments')
          .select('status, paid_at')
          .eq('id', paymentId)
          .single();

        if (error) throw error;
        return data;
      },
      enabled: !!paymentId,
      refetchInterval: (data) => {
        // Stop polling when payment is confirmed
        if (data?.state?.data?.status === 'paid') {
          return false;
        }
        return 3000; // Poll every 3 seconds
      },
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
