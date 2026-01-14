import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePublicPlans } from '@/hooks/usePublicPlans';
import { useCheckout } from '@/hooks/useCheckout';
import { useAuth } from '@/hooks/useAuth';
import { PlanCard } from '@/components/checkout/PlanCard';
import { PixPayment } from '@/components/checkout/PixPayment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, CreditCard } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { data: plans, isLoading: plansLoading } = usePublicPlans();
  const { pixData, createPix, isCreatingPix, usePaymentStatus } = useCheckout();
  
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
    searchParams.get('planId') || sessionStorage.getItem('selectedPlanId')
  );

  const { data: paymentStatus, isLoading: isCheckingStatus } = usePaymentStatus(pixData?.paymentId || null);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      if (selectedPlanId) {
        sessionStorage.setItem('selectedPlanId', selectedPlanId);
      }
      navigate('/auth?redirect=/checkout');
    }
  }, [user, authLoading, navigate, selectedPlanId]);

  // Clear stored plan after loading
  useEffect(() => {
    const storedPlanId = sessionStorage.getItem('selectedPlanId');
    if (storedPlanId && !searchParams.get('planId')) {
      setSelectedPlanId(storedPlanId);
      sessionStorage.removeItem('selectedPlanId');
    }
  }, [searchParams]);

  // Redirect on successful payment
  useEffect(() => {
    if (paymentStatus?.status === 'paid') {
      setTimeout(() => {
        navigate('/payment-success');
      }, 2000);
    }
  }, [paymentStatus, navigate]);

  const selectedPlan = plans?.find(p => p.id === selectedPlanId);

  const handleGeneratePix = () => {
    if (selectedPlanId) {
      createPix(selectedPlanId);
    }
  };

  if (authLoading || plansLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/plans')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Checkout</h1>
            <p className="text-sm text-muted-foreground">Finalize sua assinatura</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan Selection / Summary */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">
              {pixData ? 'Resumo do Pedido' : 'Selecione um Plano'}
            </h2>
            
            {pixData && selectedPlan ? (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedPlan.name}</CardTitle>
                  {selectedPlan.description && (
                    <CardDescription>{selectedPlan.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(selectedPlan.price_cents / 100)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Duração: {selectedPlan.duration_days} dias
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {plans?.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onSelect={setSelectedPlanId}
                    isSelected={selectedPlanId === plan.id}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Pagamento</h2>
            
            {pixData ? (
              <PixPayment
                qrCode={pixData.qrCode}
                qrCodeBase64={pixData.qrCodeBase64}
                value={pixData.value}
                paymentStatus={paymentStatus?.status || 'pending'}
                isCheckingStatus={isCheckingStatus}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Pagar com PIX
                  </CardTitle>
                  <CardDescription>
                    Pagamento instantâneo e seguro
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedPlan && (
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total a pagar:</p>
                      <p className="text-2xl font-bold">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(selectedPlan.price_cents / 100)}
                      </p>
                    </div>
                  )}
                  
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleGeneratePix}
                    disabled={!selectedPlanId || isCreatingPix}
                  >
                    {isCreatingPix ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Gerando PIX...
                      </>
                    ) : (
                      'Gerar QR Code PIX'
                    )}
                  </Button>
                  
                  {!selectedPlanId && (
                    <p className="text-sm text-muted-foreground text-center">
                      Selecione um plano para continuar
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
