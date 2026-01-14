import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PixPaymentProps {
  qrCode: string;
  qrCodeBase64: string;
  value: number;
  paymentStatus: 'pending' | 'paid' | string;
  isCheckingStatus?: boolean;
}

export function PixPayment({ qrCode, qrCodeBase64, value, paymentStatus, isCheckingStatus }: PixPaymentProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrCode);
      setCopied(true);
      toast({
        title: 'Código copiado!',
        description: 'Cole no seu app de banco para pagar.',
      });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast({
        title: 'Erro ao copiar',
        description: 'Tente selecionar e copiar manualmente.',
        variant: 'destructive',
      });
    }
  };

  if (paymentStatus === 'paid') {
    return (
      <Card className="border-green-500 bg-green-50 dark:bg-green-950">
        <CardContent className="pt-6 text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          <div>
            <h3 className="text-xl font-bold text-green-700 dark:text-green-300">
              Pagamento Confirmado!
            </h3>
            <p className="text-green-600 dark:text-green-400">
              Sua assinatura foi ativada com sucesso.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Pagamento PIX</CardTitle>
        <CardDescription>
          Escaneie o QR Code ou copie o código para pagar
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center">
          <span className="text-2xl font-bold">{formatPrice(value)}</span>
        </div>

        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-lg">
            <img 
              src={`data:image/png;base64,${qrCodeBase64}`} 
              alt="QR Code PIX" 
              className="w-48 h-48"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Código PIX (Copia e Cola):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={qrCode}
              readOnly
              className="flex-1 px-3 py-2 text-sm bg-muted rounded-md border truncate"
            />
            <Button onClick={handleCopy} variant="outline" size="icon">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          {isCheckingStatus ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Aguardando pagamento...</span>
            </>
          ) : (
            <span>Verificando status do pagamento...</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
