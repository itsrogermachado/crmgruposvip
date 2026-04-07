import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Rafaela Mendes',
    role: 'Gestora de 3 Grupos VIP',
    avatar: 'RM',
    text: 'Minha taxa de renovação subiu de 70% para 95%. O CRM Grupos VIP praticamente se paga sozinho.',
    stars: 5,
    size: 'large',
  },
  {
    name: 'Lucas Ferreira',
    role: 'Trader — Grupo de Sinais',
    avatar: 'LF',
    text: 'Os lembretes automáticos no WhatsApp reduziram minha inadimplência em 80%. Melhor investimento que fiz pro meu grupo.',
    stars: 5,
    size: 'small',
  },
  {
    name: 'Camila Oliveira',
    role: 'Mentora de Negócios',
    avatar: 'CO',
    text: 'Gerencio 5 grupos com mais de 400 membros e nunca perdi o controle. Os relatórios financeiros são incríveis.',
    stars: 5,
    size: 'small',
  },
  {
    name: 'Bruno Almeida',
    role: 'Tipster Esportivo',
    avatar: 'BA',
    text: 'Testei 3 ferramentas antes. Nenhuma era tão focada em grupos VIP. Em 2 minutos eu já estava operando.',
    stars: 5,
    size: 'large',
  },
];

export function TestimonialsSection() {
  return (
    <section id="depoimentos" className="py-24 md:py-40 scroll-mt-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-6">
            <span className="text-[11px] font-bold text-primary uppercase tracking-[0.2em]">
              Depoimentos
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-[2.75rem] font-extrabold mb-4 text-primary leading-tight tracking-tight">
            Quem usa,{' '}
            <span className="relative inline-block">
              <span className="text-accent">recomenda</span>
              <span className="absolute -bottom-1.5 left-0 right-0 h-[4px] bg-accent/25 rounded-full" />
            </span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg font-medium">
            Veja o que gestores de grupos VIP dizem sobre a plataforma
          </p>
        </div>

        {/* Masonry-like grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {testimonials.map((t, idx) => (
            <div
              key={t.name}
              className={`relative p-7 md:p-8 rounded-2xl bg-[#FAFAFA] border border-primary/10 hover:border-accent/20 transition-all duration-500 hover:shadow-lg hover:shadow-accent/5 ${
                t.size === 'large' ? 'md:py-10' : ''
              }`}
            >
              {/* Decorative quote */}
              <span className="font-serif text-6xl text-accent/15 absolute top-4 right-6 leading-none select-none">
                "
              </span>

              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 font-medium">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-sm font-extrabold text-primary font-heading">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-heading font-extrabold text-sm text-primary">{t.name}</p>
                  <p className="text-xs text-muted-foreground font-medium">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
