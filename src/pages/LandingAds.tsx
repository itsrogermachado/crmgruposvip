import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  Send,
  Loader2,
  Shield,
  Zap,
  TrendingUp,
  Users,
  Bell,
  BarChart3,
  Star,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLeadCapture } from '@/hooks/useLeadCapture';
import { useUtmParams } from '@/hooks/useUtmParams';
import { useTheme } from '@/hooks/useTheme';
import { FloatingWhatsApp } from '@/components/landing/FloatingWhatsApp';

export default function LandingAds() {
  useTheme();
  const utmParams = useUtmParams();
  const [contact, setContact] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const leadCapture = useLeadCapture();

  const isEmail = contact.includes('@');
  const contactType = isEmail ? 'email' : 'whatsapp';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;

    if (isEmail) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) return;
    } else {
      if (!/^\d{10,11}$/.test(contact.replace(/\D/g, ''))) return;
    }

    await leadCapture.mutateAsync({ contact, contactType });
    setIsSuccess(true);
    setContact('');
  };

  const authUrl = `/auth${utmParams.utm_source ? `?utm_source=${utmParams.utm_source}&utm_medium=${utmParams.utm_medium || ''}&utm_campaign=${utmParams.utm_campaign || ''}` : ''}`;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Urgency badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-8 animate-fade-in">
              <Clock className="w-4 h-4 text-destructive" />
              <span className="text-sm font-semibold text-destructive">
                ⚡ Oferta por Tempo Limitado — 7 Dias Grátis
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.08] mb-6 tracking-tight animate-fade-in">
              <span className="text-foreground">Pare de </span>
              <span className="bg-gradient-to-r from-destructive to-destructive/70 bg-clip-text text-transparent">
                Perder Dinheiro
              </span>
              <br />
              <span className="text-foreground">no Seu Grupo VIP</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in leading-relaxed">
              Automatize cobranças, controle vencimentos e aumente sua taxa de renovação em até{' '}
              <strong className="text-foreground">40%</strong>. Tudo em um CRM feito para grupos VIP.
            </p>

            {/* Primary CTA */}
            <div className="flex flex-col items-center gap-4 mb-6 animate-fade-in">
              <Link to={authUrl}>
                <Button
                  size="lg"
                  className="text-lg px-10 py-7 font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 transition-all hover:scale-105 border-0"
                >
                  Começar Grátis Agora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                ✓ Sem cartão de crédito &nbsp; ✓ Configuração em 2 min
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ── */}
      <section className="py-8 border-y border-border/50 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center">
            {[
              { value: '+500', label: 'Grupos gerenciados' },
              { value: '94%', label: 'Taxa de renovação' },
              { value: '4.9★', label: 'Avaliação média' },
              { value: 'R$2M+', label: 'Processados' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl md:text-3xl font-bold text-primary">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Tudo o que você precisa para{' '}
            <span className="text-primary">lucrar mais</span>
          </h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-14">
            Pare de usar planilhas. Automatize seu grupo VIP com ferramentas profissionais.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Bell, title: 'Cobranças Automáticas', desc: 'Envio de lembretes de vencimento via WhatsApp automaticamente.' },
              { icon: TrendingUp, title: '+40% Renovação', desc: 'Clientes avisados na hora certa renovam muito mais.' },
              { icon: Users, title: 'Gestão de Membros', desc: 'Controle total: quem pagou, quem vence, quem saiu.' },
              { icon: BarChart3, title: 'Dashboard Completo', desc: 'Receita, membros ativos, vencimentos — tudo em tempo real.' },
              { icon: Shield, title: 'Dados Seguros', desc: 'Criptografia e backups automáticos para seus dados.' },
              { icon: Zap, title: 'Setup em 2 Minutos', desc: 'Cadastre-se e comece a usar imediatamente.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 md:py-28 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
            Quem usa, <span className="text-primary">recomenda</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Lucas M.', role: 'Trader — Grupo com 200+ membros', text: 'Minha taxa de renovação subiu de 60% para 92%. O CRM praticamente se paga sozinho.' },
              { name: 'Ana C.', role: 'Mentora de Emagrecimento', text: 'Antes eu perdia horas com planilhas. Agora dedico meu tempo ao conteúdo e o CRM cuida do resto.' },
              { name: 'Rafael S.', role: 'Tipster Esportivo', text: 'Comecei a usar no teste grátis e não larguei mais. A automação de WhatsApp é sensacional.' },
            ].map((t) => (
              <div
                key={t.name}
                className="p-6 rounded-2xl bg-card border border-border"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-6 italic">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEAD CAPTURE / FORM ── */}
      <section id="contato" className="py-20 md:py-28 scroll-mt-8">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            {isSuccess ? (
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Pronto! 🎉</h3>
                <p className="text-muted-foreground mb-8">
                  Você receberá nosso guia gratuito em breve no seu{' '}
                  {contactType === 'email' ? 'e-mail' : 'WhatsApp'}!
                </p>
                <Link to={authUrl}>
                  <Button size="lg" className="font-bold bg-gradient-to-r from-primary to-primary/80">
                    Criar Minha Conta Grátis
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-card to-primary/5 border border-primary/20 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  Receba o Guia Gratuito 🎁
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  "5 Estratégias para Aumentar a Retenção no Seu Grupo VIP" — direto no seu WhatsApp ou e-mail.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input
                    type="text"
                    placeholder="Seu WhatsApp ou E-mail"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="h-12 text-base"
                    disabled={leadCapture.isPending}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    disabled={leadCapture.isPending || !contact.trim()}
                    className="h-12 px-6 font-semibold bg-gradient-to-r from-primary to-primary/80 whitespace-nowrap"
                  >
                    {leadCapture.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Quero Receber
                      </>
                    )}
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground mt-4">
                  🔒 Sem spam. Apenas conteúdo valioso.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[150px]" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Pronto para{' '}
            <span className="text-primary">profissionalizar</span>{' '}
            seu grupo?
          </h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            Comece agora mesmo. Em menos de 5 minutos você terá seu CRM configurado.
          </p>

          <Link to={authUrl}>
            <Button
              size="lg"
              className="text-base px-10 py-7 font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 transition-all hover:scale-105 border-0"
            >
              Começar Agora — Grátis por 7 Dias
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground mt-8">
            ✓ Sem cartão de crédito &nbsp; ✓ Cancele quando quiser &nbsp; ✓ Suporte via WhatsApp
          </p>
        </div>
      </section>

      {/* ── FOOTER MINIMAL ── */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CRM Grupos VIP. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      <FloatingWhatsApp />
    </div>
  );
}
