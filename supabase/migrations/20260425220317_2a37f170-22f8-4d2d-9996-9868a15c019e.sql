-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own notifications') THEN
        CREATE POLICY "Users can view their own notifications" ON public.notifications
            FOR SELECT USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own notifications') THEN
        CREATE POLICY "Users can update their own notifications" ON public.notifications
            FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own notifications') THEN
        CREATE POLICY "Users can delete their own notifications" ON public.notifications
            FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create push_subscriptions table for Web Push
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, subscription)
);

-- Enable RLS for push_subscriptions
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for push_subscriptions
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own subscriptions') THEN
        CREATE POLICY "Users can manage their own subscriptions" ON public.push_subscriptions
            FOR ALL USING (auth.uid() = user_id);
    END IF;
END $$;

-- Add control column to clients
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS vencimento_notificado BOOLEAN DEFAULT false;

-- Convert columns to DATE type safely
DO $$ 
BEGIN 
    -- Check if data_vencimento is still text
    IF (SELECT data_type FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'data_vencimento') = 'text' THEN
        ALTER TABLE public.clients 
        ALTER COLUMN data_vencimento TYPE DATE 
        USING CASE 
            WHEN data_vencimento IS NULL OR data_vencimento = '' THEN NULL 
            WHEN data_vencimento ~ '^[0-9]+$' THEN (DATE '1899-12-30' + (data_vencimento::int))
            WHEN data_vencimento ~ '^[0-9]{2}/[0-9]{2}/[0-9]{4}$' THEN to_date(data_vencimento, 'DD/MM/YYYY')
            ELSE NULL 
        END;
    END IF;

    -- Check if data_entrada is still text
    IF (SELECT data_type FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'data_entrada') = 'text' THEN
        ALTER TABLE public.clients 
        ALTER COLUMN data_entrada TYPE DATE 
        USING CASE 
            WHEN data_entrada IS NULL OR data_entrada = '' THEN NULL 
            WHEN data_entrada ~ '^[0-9]+$' THEN (DATE '1899-12-30' + (data_entrada::int))
            WHEN data_entrada ~ '^[0-9]{2}/[0-9]{2}/[0-9]{4}$' THEN to_date(data_entrada, 'DD/MM/YYYY')
            ELSE NULL 
        END;
    END IF;
END $$;
