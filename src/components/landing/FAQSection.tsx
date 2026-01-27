import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'O que acontece após o teste grátis de 7 dias?',
    answer: 'Após os 7 dias, você pode escolher um plano para continuar usando. Se não quiser continuar, sua conta será pausada automaticamente - sem cobranças surpresas.',
  },
  {
    question: 'Posso cancelar a qualquer momento?',
    answer: 'Sim! Não há fidelidade ou multa. Você pode cancelar quando quiser diretamente pelo painel ou entrando em contato com nosso suporte.',
  },
  {
    question: 'Como funciona o suporte?',
    answer: 'Oferecemos suporte humanizado via WhatsApp. Nossa equipe responde rapidamente para resolver qualquer dúvida ou problema que você tiver.',
  },
  {
    question: 'Meus dados estão seguros?',
    answer: 'Absolutamente! Usamos criptografia de ponta a ponta e seguimos as melhores práticas de segurança. Seus dados e os de seus membros estão protegidos.',
  },
  {
    question: 'Posso gerenciar mais de um grupo?',
    answer: 'Sim! Com qualquer plano você pode gerenciar múltiplos grupos VIP em uma única conta, facilitando o controle de todos os seus projetos.',
  },
  {
    question: 'Preciso de conhecimento técnico?',
    answer: 'Não! O CRM Grupos VIP foi projetado para ser super intuitivo. Se você sabe usar WhatsApp, consegue usar nossa plataforma.',
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20 md:py-28 scroll-mt-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Perguntas{' '}
            <span className="text-primary">Frequentes</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Tire suas dúvidas sobre o CRM Grupos VIP
          </p>
        </div>

        {/* Accordion */}
        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border/50 rounded-xl px-6 data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
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
