export function SocialProofBar() {
  const stats = [
    { value: '+500', label: 'Grupos Gerenciados' },
    { value: 'R$2M+', label: 'em Pagamentos' },
    { value: '94%', label: 'Taxa de Renovação' },
    { value: '99.9%', label: 'Disponibilidade' },
  ];

  return (
    <section className="py-10 md:py-14 border-y border-border/40 bg-muted/20">
      <div className="container mx-auto px-4">
        <p className="text-center text-xs font-medium text-muted-foreground uppercase tracking-widest mb-8">
          Números que comprovam resultados
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                {s.value}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
