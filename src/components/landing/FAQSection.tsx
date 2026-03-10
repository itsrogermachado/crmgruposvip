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
    <section id="faq" className="py-24 md:py-32 scroll-mt-20 relative">
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-[#4630B1]/5 rounded-full blur-[100px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[#9D67ED] font-medium text-sm uppercase tracking-wider mb-3">FAQ</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Perguntas{' '}
            <span className="bg-gradient-to-r from-[#9D67ED] to-[#4630B1] bg-clip-text text-transparent">Frequentes</span>
          </h2>
          <p className="text-base text-white/50">
            Tire suas dúvidas sobre o CRM Grupos VIP
          </p>
        </div>

        {/* Accordion */}
        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-6 data-[state=open]:border-[#7C3AED]/30 data-[state=open]:bg-[#7C3AED]/[0.05] transition-all"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5 text-white/90 hover:text-white">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-white/50 pb-5">
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
