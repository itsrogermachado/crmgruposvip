-- Remove the foreign key constraint that references auth.users
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_user_id_fkey;

-- Also check and remove from payments if exists
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_user_id_fkey;