-- 1. Add missing UPDATE policy on comprovantes bucket (prevents users from overwriting other users' receipts)
CREATE POLICY "Users can update their own receipt files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'comprovantes'
  AND (auth.uid())::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'comprovantes'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- 2. Add data validation constraints on clients table (defense-in-depth)
ALTER TABLE public.clients
  ADD CONSTRAINT check_nome_length
    CHECK (length(nome) BETWEEN 1 AND 200),
  ADD CONSTRAINT check_telefone_length
    CHECK (length(telefone) BETWEEN 1 AND 30),
  ADD CONSTRAINT check_preco_positive
    CHECK (preco >= 0),
  ADD CONSTRAINT check_preco_reasonable
    CHECK (preco < 1000000),
  ADD CONSTRAINT check_preco_renovacao_valid
    CHECK (preco_renovacao IS NULL OR (preco_renovacao >= 0 AND preco_renovacao < 1000000)),
  ADD CONSTRAINT check_discord_length
    CHECK (discord IS NULL OR length(discord) <= 100),
  ADD CONSTRAINT check_telegram_length
    CHECK (telegram IS NULL OR length(telegram) <= 100),
  ADD CONSTRAINT check_observacoes_length
    CHECK (observacoes IS NULL OR length(observacoes) <= 5000);