import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LeadData {
  contact: string;
  contactType: 'whatsapp' | 'email';
}

export function useLeadCapture() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ contact, contactType }: LeadData) => {
      const { error } = await supabase
        .from('leads')
        .insert({ 
          contact, 
          contact_type: contactType, 
          source: 'landing' 
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "🎉 Pronto!",
        description: "Enviaremos o conteúdo para você em breve!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}
