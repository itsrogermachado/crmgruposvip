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
    <section id="depoimentos" className="py-24 md:py-36 scroll-mt-20 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-6 font-bold text-xs uppercase tracking-widest text-primary">
            Resultados Reais
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-foreground tracking-tight leading-tight">
            Quem vive de grupos, <span className="text-accent underline decoration-accent/30 underline-offset-8">recomenda.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Gestores que escalaram suas operações e profissionalizaram seus negócios com o CRM VIP.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`group relative p-8 md:p-10 rounded-[2.5rem] bg-card border-2 border-primary/5 hover:border-accent/20 transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] ${
                i % 2 === 1 ? 'md:translate-y-8' : ''
              }`}
            >
              <div className="absolute top-8 right-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-12 h-12 text-primary" />
              </div>

              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>

              <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed mb-8 italic">
                "{t.text}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-sm font-black text-white shadow-lg shadow-primary/20">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-black text-base text-foreground tracking-tight uppercase">{t.name}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-accent">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
