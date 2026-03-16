import { useState } from 'react';
import { 
  BarChart3, Users, Bell, FileSpreadsheet, 
  ArrowRight, ArrowLeft, X, Rocket, CheckCircle2,
  Zap, Globe, TrendingUp, HeadphonesIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OnboardingTutorialProps {
  onComplete: () => void;
}

const steps = [
  {
    icon: Rocket,
    title: 'Bem-vindo ao CRM Grupos VIP! 🎉',
    subtitle: 'Seu CRM está pronto para usar',
    description:
      'Parabéns pelo cadastro! Vamos fazer um tour rápido pela plataforma para que você aproveite ao máximo todas as funcionalidades.',
    tip: 'Este tour leva menos de 1 minuto.',
    image: null,
  },
  {
    icon: BarChart3,
    title: 'Dashboard Completo',
    subtitle: 'Passo 1 de 4',
    description:
      'Visualize o desempenho do seu grupo em tempo real. Membros ativos, faturamento, vencimentos e taxa de renovação — tudo em gráficos intuitivos.',
    tip: '💡 Vantagem: Tome decisões baseadas em dados precisos, não em achismo.',
    image: null,
  },
  {
    icon: Users,
    title: 'Gerenciamento de Membros',
    subtitle: 'Passo 2 de 4',
    description:
      'Adicione, edite e acompanhe cada membro do seu grupo. Veja quem está ativo, quem vai vencer e quem precisa de atenção.',
    tip: '💡 Vantagem: Mantenha todos os dados organizados e acessíveis em um só lugar.',
    image: null,
  },
  {
    icon: Bell,
    title: 'Automação de Lembretes',
    subtitle: 'Passo 3 de 4',
    description:
      'Configure lembretes automáticos via WhatsApp para avisar membros sobre vencimentos. Sem esforço manual, sem esquecimentos.',
    tip: '💡 Vantagem: Economize tempo e aumente sua taxa de renovação em até 40%.',
    image: null,
  },
  {
    icon: FileSpreadsheet,
    title: 'Relatórios e Exportação',
    subtitle: 'Passo 4 de 4',
    description:
      'Gere relatórios detalhados de faturamento e exporte dados para Excel sempre que precisar. Controle total do seu negócio.',
    tip: '💡 Vantagem: Visualize tendências e planeje o crescimento do seu grupo.',
    image: null,
  },
];

const benefits = [
  { icon: Zap, title: 'Eficiência', desc: 'Reduza processos manuais e ganhe tempo' },
  { icon: Globe, title: 'Centralização', desc: 'Tudo em uma única plataforma' },
  { icon: TrendingUp, title: 'Crescimento', desc: 'Escale junto com seu negócio' },
  { icon: HeadphonesIcon, title: 'Suporte', desc: 'Ajuda rápida via WhatsApp' },
];

export function OnboardingTutorial({ onComplete }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const isLastStep = currentStep === steps.length;
  const isFirstStep = currentStep === 0;

  const next = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const prev = () => {
    if (!isFirstStep) setCurrentStep((s) => s - 1);
  };

  const skip = () => onComplete();

  // Final screen with benefits
  if (isLastStep) {
    return (
      <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl shadow-primary/10 overflow-hidden animate-fade-in">
          <div className="p-6 md:p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Tudo pronto! 🚀
              </h2>
              <p className="text-muted-foreground text-sm">
                Seu CRM está configurado. Veja os benefícios que você vai aproveitar:
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="p-4 rounded-xl bg-muted/50 border border-border/50 text-center"
                >
                  <b.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold text-foreground">{b.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{b.desc}</p>
                </div>
              ))}
            </div>

            <Button
              onClick={onComplete}
              className="w-full h-12 font-bold text-base bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
            >
              Começar a Usar
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const step = steps[currentStep];
  const StepIcon = step.icon;

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl shadow-primary/10 overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-0">
          <span className="text-xs font-medium text-muted-foreground">{step.subtitle}</span>
          <button
            onClick={skip}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            Pular tutorial
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
            <StepIcon className="w-7 h-7 text-primary" />
          </div>

          <h2 className="text-xl font-bold text-foreground mb-2">{step.title}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            {step.description}
          </p>

          <div className="px-4 py-3 rounded-xl bg-primary/5 border border-primary/10 text-sm text-primary/90">
            {step.tip}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={prev}
            disabled={isFirstStep}
            className="gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>

          {/* Progress dots */}
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? 'w-6 bg-primary'
                    : i < currentStep
                    ? 'w-1.5 bg-primary/40'
                    : 'w-1.5 bg-border'
                }`}
              />
            ))}
          </div>

          <Button onClick={next} size="sm" className="gap-1 bg-primary hover:bg-primary/90">
            {currentStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
