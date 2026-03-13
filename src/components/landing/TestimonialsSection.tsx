import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Rafaela Mendes',
    role: 'Gestora de 3 Grupos VIP',
    avatar: 'RM',
    text: 'Antes eu usava planilha e perdia horas controlando pagamentos. Com o CRM Grupos VIP, tudo ficou automático. Minha taxa de renovação subiu de 70% para 95%!',
    stars: 5,
  },
  {
    name: 'Lucas Ferreira',
    role: 'Trader - Grupo de Sinais',
    avatar: 'LF',
    text: 'O melhor investimento que fiz pro meu grupo. Os lembretes automáticos no WhatsApp reduziram minha inadimplência em 80%. Recomendo demais!',
    stars: 5,
  },
  {
    name: 'Camila Oliveira',
    role: 'Mentora de Negócios',
    avatar: 'CO',
    text: 'Gerencio 5 grupos VIP com mais de 400 membros e nunca perdi o controle. A visão de quem vai vencer e o relatório financeiro são incríveis.',
    stars: 5,
  },
  {
    name: 'Bruno Almeida',
    role: 'Grupo VIP de Apostas',
    avatar: 'BA',
    text: 'Testei 3 ferramentas antes e nenhuma era focada em grupos VIP como essa. Em 2 minutos eu já estava usando. Interface limpa e intuitiva.',
    stars: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-primary font-medium text-sm uppercase tracking-wider mb-3">Depoimentos</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Quem usa,{' '}
            <span className="text-primary">recomenda</span>
          </h2>
          <p className="text-base text-muted-foreground">
            Veja o que nossos clientes dizem sobre o CRM Grupos VIP
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {testimonials.map((t, index) => (
            <div
              key={t.name}
              className="group relative p-7 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-primary/[0.03] transition-all duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500" />

              <div className="relative z-10">
                <Quote className="w-8 h-8 text-primary/20 mb-4" />

                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  "{t.text}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
