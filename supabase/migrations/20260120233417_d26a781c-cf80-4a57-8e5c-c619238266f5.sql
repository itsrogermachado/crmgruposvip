-- Insert payment records for existing clients based on data_entrada (first payment)
-- Only for clients that don't already have a payment record
INSERT INTO public.client_payments (client_id, user_id, amount, payment_date, payment_method, notes)
SELECT 
  c.id as client_id,
  c.user_id,
  c.preco as amount,
  c.data_entrada as payment_date,
  'pix' as payment_method,
  'Primeiro pagamento - ' || c.plano as notes
FROM public.clients c
WHERE NOT EXISTS (
  SELECT 1 FROM public.client_payments cp 
  WHERE cp.client_id = c.id
);