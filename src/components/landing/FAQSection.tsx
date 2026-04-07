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
    <section id="faq" className="py-24 md:py-40 scroll-mt-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-6">
            <span className="text-[11px] font-bold text-primary uppercase tracking-[0.2em]">
              FAQ
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-[2.75rem] font-extrabold mb-4 text-primary leading-tight tracking-tight">
            Perguntas{' '}
            <span className="relative inline-block">
              <span className="text-accent">frequentes</span>
              <span className="absolute -bottom-1.5 left-0 right-0 h-[4px] bg-accent/25 rounded-full" />
            </span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg font-medium">
            Tire suas dúvidas antes de começar
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-[#FAFAFA] border border-primary/10 rounded-xl px-6 data-[state=open]:border-accent/25 data-[state=open]:shadow-md data-[state=open]:shadow-accent/5 transition-all duration-300"
              >
                <AccordionTrigger className="text-left font-heading font-bold hover:no-underline py-5 text-primary text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-6 leading-relaxed font-medium">
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
