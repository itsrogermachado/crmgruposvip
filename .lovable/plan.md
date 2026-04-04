

## Plano: Adicionar status "Não renovou"

### O que muda para o usuário
- Um novo status **"Não renovou"** aparecerá como opção manual ao editar um cliente
- Clientes com esse status ficam como "backup": continuam na lista mas **não contam no faturamento**
- O histórico de pagamentos anteriores é preservado integralmente
- O filtro de status ganha a nova opção para visualizar/ocultar esses clientes

### Arquivos que serão alterados

1. **`src/types/client.ts`** — Adicionar `'Não renovou'` ao tipo `Status` e ao `StatusFilter`

2. **`src/lib/dateUtils.ts`** — Ajustar `calculateStatus()` para **não sobrescrever** o status quando já for `'Não renovou'` (esse status é manual, não calculado por data)

3. **`src/hooks/useClients.ts`** — Na função `fetchClients`, preservar o status `'Não renovou'` vindo do banco em vez de recalcular automaticamente. Mesma lógica no `addClient` e `updateClient`

4. **`src/components/StatusBadge.tsx`** — Adicionar estilo visual para "Não renovou" (cor cinza/neutra, indicando inatividade)

5. **`src/components/FilterSection.tsx`** — Adicionar "Não renovou" como opção no filtro de status (mobile e desktop)

6. **`src/components/ClientDialog.tsx`** — Permitir selecionar "Não renovou" manualmente no campo de status ao editar cliente

7. **`src/pages/Index.tsx`** — Excluir clientes com status "Não renovou" dos cálculos de:
   - `faturamentoTotal`
   - `faturamentoMensal`
   - Cards de "Clientes Ativos" (no `statsClients`)

8. **`src/components/StatsGrid.tsx`** — Adicionar um card ou ajustar contagens para mostrar quantos clientes estão em "Não renovou"

9. **`src/components/MobileClientCard.tsx`** — Garantir que o novo status renderize corretamente nos cards mobile

### Detalhes técnicos
- O campo `status` no banco (tabela `clients`) já é `text`, então aceita o novo valor sem migração
- A lógica-chave: no `useClients.fetchClients`, se `c.status === 'Não renovou'`, manter esse valor; caso contrário, calcular automaticamente via `calculateStatus()`
- Nos cálculos financeiros, filtrar com `client.status !== 'Não renovou'` antes de somar valores

