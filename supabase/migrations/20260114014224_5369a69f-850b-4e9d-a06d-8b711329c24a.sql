-- =============================================
-- FEATURE 2: Histórico de Pagamentos por Cliente
-- =============================================

-- Tabela de pagamentos/renovações dos clientes do CRM
CREATE TABLE public.client_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    amount NUMERIC NOT NULL,
    payment_date TEXT NOT NULL,
    payment_method TEXT DEFAULT 'pix',
    notes TEXT,
    comprovante_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client_payments
CREATE POLICY "Users can view their own client payments"
ON public.client_payments FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own client payments"
ON public.client_payments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own client payments"
ON public.client_payments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own client payments"
ON public.client_payments FOR DELETE
USING (auth.uid() = user_id);

-- =============================================
-- FEATURE 7: Multi-Grupo (Multi-Tenant)
-- =============================================

-- Tabela de grupos
CREATE TABLE public.groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#3B82F6',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- RLS Policies for groups
CREATE POLICY "Users can view their own groups"
ON public.groups FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own groups"
ON public.groups FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own groups"
ON public.groups FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own groups"
ON public.groups FOR DELETE
USING (auth.uid() = user_id);

-- Add group_id column to clients table
ALTER TABLE public.clients ADD COLUMN group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL;

-- =============================================
-- FEATURE 1: Lembretes Automáticos de Renovação
-- =============================================

-- Tabela de configurações de lembretes por usuário
CREATE TABLE public.reminder_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    days_before INTEGER NOT NULL DEFAULT 3,
    reminder_template TEXT DEFAULT 'Olá {nome}! Seu plano VIP vence em {dias} dias. Renove para continuar aproveitando os benefícios!',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reminder_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reminder_settings
CREATE POLICY "Users can view their own reminder settings"
ON public.reminder_settings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reminder settings"
ON public.reminder_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminder settings"
ON public.reminder_settings FOR UPDATE
USING (auth.uid() = user_id);

-- Tabela de lembretes enviados
CREATE TABLE public.sent_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT now(),
    reminder_type TEXT NOT NULL,
    message TEXT
);

-- Enable RLS
ALTER TABLE public.sent_reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sent_reminders
CREATE POLICY "Users can view their own sent reminders"
ON public.sent_reminders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sent reminders"
ON public.sent_reminders FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Trigger for updating updated_at on groups
CREATE TRIGGER update_groups_updated_at
BEFORE UPDATE ON public.groups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updating updated_at on reminder_settings
CREATE TRIGGER update_reminder_settings_updated_at
BEFORE UPDATE ON public.reminder_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();