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
    <section id="faq" className="py-24 md:py-40 scroll-mt-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-6 font-bold text-xs uppercase tracking-widest text-primary">
            Dúvidas
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-foreground tracking-tight leading-tight">
            Perguntas <span className="text-accent underline decoration-accent/30 underline-offset-8">frequentes</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Tudo o que você precisa saber antes de escalar sua operação VIP.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border-2 border-primary/5 rounded-[2rem] px-8 data-[state=open]:border-accent/20 data-[state=open]:shadow-xl transition-all duration-500 overflow-hidden"
              >
                <AccordionTrigger className="text-left font-black hover:no-underline py-6 text-foreground text-base md:text-lg uppercase tracking-tight">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm md:text-base pb-8 leading-relaxed font-medium">
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
