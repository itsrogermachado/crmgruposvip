-- Habilitar realtime para as tabelas clients e client_payments
ALTER PUBLICATION supabase_realtime ADD TABLE public.clients;
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_payments;