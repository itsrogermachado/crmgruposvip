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
      // Save lead to database
      const { error } = await supabase
        .from('leads')
        .insert({ 
          contact, 
          contact_type: contactType, 
          source: 'landing' 
        });
      
      if (error) throw error;
      
      // If it's an email, send the ebook automatically
      if (contactType === 'email') {
        const { error: emailError } = await supabase.functions.invoke('send-lead-email', {
          body: { email: contact }
        });
        
        if (emailError) {
          console.error('Error sending email:', emailError);
          // Don't throw - lead was saved, email sending is secondary
        }
      }
      
      return { contactType };
    },
    onSuccess: (data) => {
      if (data?.contactType === 'email') {
        toast({
          title: "🎉 E-book enviado!",
          description: "Verifique sua caixa de entrada (e o spam também)!",
        });
      } else {
        toast({
          title: "🎉 Pronto!",
          description: "Entraremos em contato pelo seu WhatsApp em breve!",
        });
      }
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
