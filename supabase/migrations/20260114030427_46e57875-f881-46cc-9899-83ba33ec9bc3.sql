-- Enable realtime for payments table so UI updates instantly
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;