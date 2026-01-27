-- Tabela de leads para captação
CREATE TABLE public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact TEXT NOT NULL,
  contact_type TEXT NOT NULL CHECK (contact_type IN ('whatsapp', 'email')),
  source TEXT DEFAULT 'landing',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Habilitar segurança
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Admins podem ler todos os leads usando a função has_role existente
CREATE POLICY "Admins can read all leads"
  ON public.leads FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Qualquer um pode inserir leads (formulário público)
CREATE POLICY "Anyone can insert leads"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);