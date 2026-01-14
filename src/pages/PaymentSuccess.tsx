import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-20 h-20 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-700 dark:text-green-400">
            Pagamento Confirmado!
          </CardTitle>
          <CardDescription className="text-base">
            Sua assinatura foi ativada com sucesso.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Você já pode acessar todas as funcionalidades do sistema.
            Obrigado por assinar!
          </p>
          
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate('/')} className="w-full">
              Ir para o Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" onClick={() => navigate('/plans')}>
              Ver outros planos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
