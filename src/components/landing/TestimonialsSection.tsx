import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Rafaela Mendes',
    role: 'Gestora de 3 Grupos VIP',
    avatar: 'RM',
    text: 'Minha taxa de renovação subiu de 70% para 95%. O CRM Grupos VIP praticamente se paga sozinho.',
    stars: 5,
  },
  {
    name: 'Lucas Ferreira',
    role: 'Trader — Grupo de Sinais',
    avatar: 'LF',
    text: 'Os lembretes automáticos no WhatsApp reduziram minha inadimplência em 80%. Melhor investimento que fiz pro meu grupo.',
    stars: 5,
  },
  {
    name: 'Camila Oliveira',
    role: 'Mentora de Negócios',
    avatar: 'CO',
    text: 'Gerencio 5 grupos com mais de 400 membros e nunca perdi o controle. Os relatórios financeiros são incríveis.',
    stars: 5,
  },
  {
    name: 'Bruno Almeida',
    role: 'Tipster Esportivo',
    avatar: 'BA',
    text: 'Testei 3 ferramentas antes. Nenhuma era tão focada em grupos VIP. Em 2 minutos eu já estava operando.',
    stars: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section id="depoimentos" className="py-24 md:py-32 scroll-mt-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 mb-4">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Depoimentos
            </span>
          </div>
          <h2 className="text-3xl md:text-[2.75rem] font-bold mb-4 text-foreground leading-tight">
            Quem usa,{' '}
            <span className="text-primary">recomenda</span>
          </h2>
          <p className="text-muted-foreground text-base">
            Veja o que gestores de grupos VIP dizem sobre a plataforma
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 max-w-4xl mx-auto">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-md"
            >
              <Quote className="w-8 h-8 text-primary/10 absolute top-5 right-5" />

              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
