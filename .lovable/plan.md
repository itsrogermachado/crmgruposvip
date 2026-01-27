
## Plano: Landing Page de Alta Conversao - CRM Grupos VIP

### Visao Geral
Criar uma landing page profissional e otimizada para vendas em uma nova rota `/landing` que funcionara como a porta de entrada do site. A pagina atual de login/dashboard permanecera intacta para usuarios existentes.

---

### Estrutura da Landing Page

#### 1. HEADER/NAVEGACAO

```text
+------------------------------------------------------------------+
|  [Logo CRM Grupos VIP]     Beneficios  Planos  Contato   [Entrar] |
+------------------------------------------------------------------+
|  (Mobile: Menu hamburguer colapsavel)                             |
+------------------------------------------------------------------+
```

**Componente**: `LandingHeader.tsx`
- Logo + nome do produto a esquerda
- Links de ancoragem para secoes (scroll suave)
- Botao "Entrar" leva para `/auth`
- Menu hamburguer no mobile com animacao de transicao

---

#### 2. HERO SECTION (Acima da dobra)

```text
+------------------------------------------------------------------+
|                                                                    |
|      Gerencie Seu Grupo VIP com Simplicidade                       |
|      e Multiplique Seus Resultados                                 |
|                                                                    |
|      Controle financeiro, lembretes automaticos e gestao           |
|      completa de membros em um unico lugar.                        |
|                                                                    |
|      [COMECAR GRATIS - 7 DIAS]    [RECEBER GUIA GRATIS]           |
|                   (Primario)          (Secundario - Lead)          |
|                                                                    |
|      Ilustracao/Mockup do Dashboard                                |
|                                                                    |
+------------------------------------------------------------------+
```

**Componente**: `HeroSection.tsx`
- Headline forte com beneficio principal
- Subtitulo explicativo e claro
- CTA Primario: Leva para `/auth` (cadastro com trial gratis)
- CTA Secundario: Abre modal/formulario de captacao de lead
- Badge "7 dias gratis" ou "Sem cartao de credito"

---

#### 3. SOCIAL PROOF (Numeros de autoridade)

```text
+------------------------------------------------------------------+
|    +500 Grupos       R$2M+ Gerenciados      98% Renovam           |
|    Ativos             em Pagamentos          a Assinatura          |
+------------------------------------------------------------------+
```

**Componente**: `SocialProofBar.tsx`
- 3-4 metricas de impacto em linha
- Animacao de contagem ao entrar na viewport
- Icones representativos

---

#### 4. SECAO DE BENEFICIOS (Cards visuais)

```text
+------------------------------------------------------------------+
|  Por que escolher o CRM Grupos VIP?                               |
|                                                                    |
|  +----------------+  +----------------+  +----------------+        |
|  | [Icone]        |  | [Icone]        |  | [Icone]        |        |
|  | Controle       |  | Lembretes      |  | Relatorios     |        |
|  | Financeiro     |  | Automaticos    |  | Completos      |        |
|  |                |  |                |  |                |        |
|  | Gerencie       |  | Notificacoes   |  | Veja quanto    |        |
|  | pagamentos,    |  | de vencimento  |  | fatura por     |        |
|  | renovacoes...  |  | via WhatsApp   |  | mes e grupo    |        |
|  +----------------+  +----------------+  +----------------+        |
|                                                                    |
|  +----------------+  +----------------+  +----------------+        |
|  | [Icone]        |  | [Icone]        |  | [Icone]        |        |
|  | Multi-Grupos   |  | Exportacao     |  | Suporte        |        |
|  |                |  | Excel          |  | Rapido         |        |
|  +----------------+  +----------------+  +----------------+        |
+------------------------------------------------------------------+
```

**Componente**: `BenefitsSection.tsx`
- Grid responsivo: 1 coluna mobile, 2 tablet, 3 desktop
- Cada card com icone Lucide, titulo e descricao curta
- Hover com elevacao sutil

---

#### 5. SECAO DE DEMONSTRACAO (Screenshot/Video)

```text
+------------------------------------------------------------------+
|  Veja o CRM Grupos VIP em acao                                    |
|                                                                    |
|  +------------------------------------------------------------+   |
|  |                                                            |   |
|  |           [Screenshot do Dashboard Principal]              |   |
|  |                                                            |   |
|  +------------------------------------------------------------+   |
|                                                                    |
|  "Interface intuitiva projetada para gestores de grupos VIP"      |
+------------------------------------------------------------------+
```

**Componente**: `DemoSection.tsx`
- Screenshot/mockup do dashboard real
- Legenda explicativa
- Opcional: Video curto ou GIF animado

---

#### 6. SECAO DE CAPTACAO DE LEADS

```text
+------------------------------------------------------------------+
|  Receba nosso Guia Gratuito:                                      |
|  "5 Estrategias para Aumentar a Retencao no Seu Grupo VIP"        |
|                                                                    |
|  +---------------------------+                                    |
|  | [Seu WhatsApp ou E-mail]  |  [QUERO RECEBER GRATIS]           |
|  +---------------------------+                                    |
|                                                                    |
|  Prometemos nao enviar spam. Apenas conteudo valioso.             |
+------------------------------------------------------------------+
```

**Componente**: `LeadCaptureSection.tsx`
- Headline com oferta clara (guia/checklist/cupom)
- Campo de WhatsApp OU email (apenas um)
- Botao de CTA destacado
- Texto de seguranca/privacidade
- Validacao do campo com feedback visual

**Tabela no banco**: `leads`
```sql
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact TEXT NOT NULL,          -- WhatsApp ou email
  contact_type TEXT NOT NULL,     -- 'whatsapp' ou 'email'
  source TEXT DEFAULT 'landing',  -- origem do lead
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

#### 7. SECAO DE PLANOS/PRECOS

```text
+------------------------------------------------------------------+
|  Escolha o plano ideal para voce                                  |
|                                                                    |
|  +----------------+  +------------------+  +----------------+      |
|  |   MENSAL       |  |   ANUAL          |  |   TRIMESTRAL   |      |
|  |                |  |   MAIS POPULAR   |  |                |      |
|  |   R$ 149,90    |  |   R$ 999,90      |  |   R$ 399,90    |      |
|  |   /mes         |  |   /ano           |  |   /trimestre   |      |
|  |                |  |   Economize 30%  |  |   Economize15% |      |
|  |   [ Comecar ]  |  |   [ Comecar ]    |  |   [ Comecar ]  |      |
|  +----------------+  +------------------+  +----------------+      |
|                                                                    |
|  Todos os planos incluem 7 dias de teste gratis                   |
+------------------------------------------------------------------+
```

**Componente**: `PricingSection.tsx`
- Reutilizar dados do hook `usePublicPlans`
- Destaque visual no plano anual (ja existente no PlanCard)
- CTA leva para `/auth` ou `/checkout`
- Badge "7 dias gratis" abaixo dos cards

---

#### 8. FAQ (Perguntas Frequentes)

```text
+------------------------------------------------------------------+
|  Perguntas Frequentes                                             |
|                                                                    |
|  [+] O que acontece apos o teste gratis?                          |
|      Voce pode continuar usando escolhendo um plano...            |
|                                                                    |
|  [+] Posso cancelar a qualquer momento?                           |
|  [+] Como funciona o suporte?                                     |
|  [+] Meus dados estao seguros?                                    |
+------------------------------------------------------------------+
```

**Componente**: `FAQSection.tsx`
- Accordion com 4-6 perguntas comuns
- Reutilizar componente `Accordion` do shadcn/ui

---

#### 9. CTA FINAL

```text
+------------------------------------------------------------------+
|  Pronto para profissionalizar seu grupo VIP?                      |
|                                                                    |
|  [COMECAR AGORA - GRATIS POR 7 DIAS]                              |
|                                                                    |
|  Sem cartao de credito necessario                                 |
+------------------------------------------------------------------+
```

**Componente**: `FinalCTASection.tsx`
- Fundo com gradiente/destaque visual
- Headline persuasiva
- Botao grande e destacado
- Texto de seguranca

---

#### 10. FOOTER

```text
+------------------------------------------------------------------+
|  CRM Grupos VIP                                                   |
|                                                                    |
|  Links: Home | Planos | Entrar | Suporte                          |
|  Contato: WhatsApp (55) 11 96657-2738                             |
|                                                                    |
|  (c) 2026 CRM Grupos VIP. Todos os direitos reservados.           |
+------------------------------------------------------------------+
```

**Componente**: `LandingFooter.tsx`
- Links rapidos
- Contato via WhatsApp (reutilizar logica existente)
- Copyright

---

### Arquivos a Criar

| Arquivo | Descricao |
|---------|-----------|
| `src/pages/Landing.tsx` | Pagina principal da landing page |
| `src/components/landing/LandingHeader.tsx` | Header com navegacao e menu mobile |
| `src/components/landing/HeroSection.tsx` | Hero com headline e CTAs |
| `src/components/landing/SocialProofBar.tsx` | Barra de numeros/autoridade |
| `src/components/landing/BenefitsSection.tsx` | Grid de cards de beneficios |
| `src/components/landing/DemoSection.tsx` | Screenshot/demonstracao |
| `src/components/landing/LeadCaptureSection.tsx` | Formulario de captacao |
| `src/components/landing/PricingSection.tsx` | Secao de planos |
| `src/components/landing/FAQSection.tsx` | Perguntas frequentes |
| `src/components/landing/FinalCTASection.tsx` | CTA final |
| `src/components/landing/LandingFooter.tsx` | Footer |
| `src/hooks/useLeadCapture.ts` | Hook para salvar leads |

---

### Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/App.tsx` | Adicionar rota `/landing` |
| `index.html` | Atualizar meta tags para SEO da landing |

---

### Banco de Dados

**Nova tabela**: `leads`
- Armazenar contatos capturados (WhatsApp ou email)
- RLS: apenas admins podem ler todos os leads

---

### Fluxo de Conversao

```text
Visitante acessa /landing
        |
        +--> CTA Primario "Comecar Gratis"
        |           |
        |           v
        |     /auth (cadastro) --> 7 dias gratis --> Dashboard
        |
        +--> CTA Secundario "Receber Guia"
                    |
                    v
              Modal/Form de Lead
                    |
                    v
              Salva no banco 'leads'
                    |
                    v
              Mensagem de sucesso
              "Enviaremos o guia no seu WhatsApp!"
```

---

### Recursos Visuais

- **Cores**: Manter paleta existente (azul primario, gradientes)
- **Animacoes**: Usar animacoes ja definidas no Tailwind (fade-in-up, scale-in)
- **Glassmorphism**: Aplicar nos cards (glass-card ja existe)
- **Scroll suave**: CSS `scroll-behavior: smooth`
- **Responsividade**: Mobile-first com breakpoints sm/md/lg

---

### Secao Tecnica

#### Hook de Captacao de Leads

```typescript
// src/hooks/useLeadCapture.ts
export function useLeadCapture() {
  const mutation = useMutation({
    mutationFn: async ({ contact, contactType }: { 
      contact: string; 
      contactType: 'whatsapp' | 'email' 
    }) => {
      const { error } = await supabase
        .from('leads')
        .insert({ contact, contact_type: contactType, source: 'landing' });
      if (error) throw error;
    }
  });
  return mutation;
}
```

#### Migracao SQL

```sql
-- Tabela de leads
CREATE TABLE public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact TEXT NOT NULL,
  contact_type TEXT NOT NULL CHECK (contact_type IN ('whatsapp', 'email')),
  source TEXT DEFAULT 'landing',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Admins podem ler todos os leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all leads"
  ON public.leads FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Qualquer um pode inserir leads (formulario publico)
CREATE POLICY "Anyone can insert leads"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
```

#### Estrutura do Header Mobile

```typescript
// Estado do menu
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

// Toggle com animacao
<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
  <SheetTrigger className="md:hidden">
    <Menu className="w-6 h-6" />
  </SheetTrigger>
  <SheetContent side="right">
    {/* Links de navegacao */}
  </SheetContent>
</Sheet>
```

#### Scroll Suave para Ancoras

```typescript
// No componente de navegacao
const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
  setMobileMenuOpen(false);
};
```

---

### Resultado Esperado

- Landing page moderna e profissional
- Fluxo claro de conversao para vendas
- Captacao de leads com oferta de valor
- Experiencia mobile-first otimizada
- Navegacao intuitiva com scroll suave
- Integracao completa com sistema existente
