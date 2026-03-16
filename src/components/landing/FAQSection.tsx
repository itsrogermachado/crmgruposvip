import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'O que acontece após o teste grátis de 7 dias?',
    answer:
      'Após os 7 dias, você pode escolher um plano para continuar usando. Se não quiser continuar, sua conta será pausada automaticamente — sem cobranças surpresas.',
  },
  {
    question: 'Posso cancelar a qualquer momento?',
    answer:
      'Sim! Não há fidelidade ou multa. Cancele quando quiser diretamente pelo painel ou pelo nosso suporte no WhatsApp.',
  },
  {
    question: 'Como funciona o suporte?',
    answer:
      'Oferecemos suporte humanizado via WhatsApp. Nossa equipe responde rapidamente para resolver qualquer dúvida.',
  },
  {
    question: 'Meus dados estão seguros?',
    answer:
      'Absolutamente! Usamos criptografia e seguimos as melhores práticas de segurança. Seus dados e os de seus membros estão protegidos.',
  },
  {
    question: 'Posso gerenciar mais de um grupo?',
    answer:
      'Sim! Gerencie múltiplos grupos VIP em uma única conta, com controle centralizado de todos os seus projetos.',
  },
  {
    question: 'Preciso de conhecimento técnico?',
    answer:
      'Não! O CRM Grupos VIP é super intuitivo. Se você sabe usar WhatsApp, consegue usar nossa plataforma sem problemas.',
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-24 md:py-32 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 mb-4">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              FAQ
            </span>
          </div>
          <h2 className="text-3xl md:text-[2.75rem] font-bold mb-4 text-foreground leading-tight">
            Perguntas{' '}
            <span className="text-primary">frequentes</span>
          </h2>
          <p className="text-muted-foreground text-base">
            Tire suas dúvidas antes de começar
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border/50 rounded-xl px-6 data-[state=open]:border-primary/25 data-[state=open]:shadow-sm transition-all"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5 text-foreground text-sm">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
