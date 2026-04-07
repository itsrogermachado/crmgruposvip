export function SocialProofBar() {
  const stats = [
    { value: '+2.400', label: 'Grupos Gerenciados' },
    { value: 'R$12M+', label: 'em Pagamentos' },
    { value: '94%', label: 'Taxa de Renovação' },
    { value: '99.9%', label: 'Disponibilidade' },
  ];

  return (
    <section className="py-14 md:py-20 bg-primary text-white">
      <div className="container mx-auto px-4">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 mb-10">
          Números que comprovam resultados
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-4xl mx-auto">
          {stats.map((s, i) => (
            <div key={s.label} className="text-center relative">
              <p className="font-heading text-3xl md:text-4xl font-extrabold text-accent tracking-tight">
                {s.value}
              </p>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 mt-2">{s.label}</p>
              {i < stats.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-white/10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
