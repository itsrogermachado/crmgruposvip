export function SocialProofBar() {
  const stats = [
    { value: '+500', label: 'Grupos Gerenciados' },
    { value: 'R$2M+', label: 'em Pagamentos' },
    { value: '94%', label: 'Taxa de Renovação' },
    { value: '99.9%', label: 'Disponibilidade' },
  ];

  return (
    <section className="py-12 bg-primary/5 border-y-2 border-primary/10 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center">
          {stats.map((s) => (
            <div key={s.label} className="text-center group">
              <p className="text-4xl md:text-5xl font-black text-primary tracking-tighter group-hover:scale-110 transition-transform duration-500">
                {s.value}
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2 opacity-60">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
