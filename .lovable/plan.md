
## Correção: Tela Branca Causada por Navegação Durante Renderização

### Problema Identificado

O erro nos logs do console revela claramente a causa:

```
Warning: Cannot update a component (`BrowserRouter`) while rendering 
a different component (`Index`). To locate the bad setState() call inside `Index`...
```

**Localização exata**: `src/pages/Index.tsx:136`

```typescript
// PROBLEMA: Chamando navigate() durante a fase de renderização
if (!authLoading && !user) {
  navigate('/auth');  // ❌ Isso causa o bug!
  return null;
}
```

**Por que isso quebra**: O React não permite atualizar estado de um componente (BrowserRouter) enquanto outro componente (Index) está sendo renderizado. Isso pode causar comportamentos imprevisíveis, loops infinitos ou tela branca.

---

### Solução

Mover a navegação para dentro de um `useEffect`, que é a forma correta de executar efeitos colaterais no React.

---

### Mudanças Necessárias

#### Arquivo: `src/pages/Index.tsx`

**Antes (problemático):**
```typescript
const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  // ... outros hooks
  
  if (!authLoading && !user) {
    navigate('/auth');  // ❌ Durante renderização
    return null;
  }
  // ... resto do componente
}
```

**Depois (correto):**
```typescript
import { useEffect } from 'react';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  // ... outros hooks
  
  // ✅ Navegação dentro de useEffect
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [authLoading, user, navigate]);
  
  // Mostrar loading enquanto verifica autenticação ou redireciona
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // ... resto do componente (só renderiza se user existe)
}
```

---

### Resumo das Alterações

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `src/pages/Index.tsx` | Modificar | Mover `navigate('/auth')` para dentro de `useEffect` |

---

### Por que isso resolve

1. **useEffect roda APÓS a renderização**, não durante
2. O componente mostra um loading enquanto verifica a autenticação
3. Após o useEffect rodar, se não houver usuário, a navegação ocorre de forma segura
4. Não há mais conflito entre a renderização do Index e a atualização do Router

---

### Resultado Esperado

- Usuários não autenticados serão redirecionados corretamente para `/auth`
- Não haverá mais erro de "Cannot update component while rendering"
- Não haverá mais tela branca durante carregamento
- O fluxo de autenticação funcionará de forma consistente

---

### Seção Técnica

**Fluxo corrigido:**
```
1. Index.tsx monta
        ↓
2. useAuth() retorna loading=true
        ↓
3. Componente renderiza tela de loading (sem erros)
        ↓
4. Auth verifica sessão assincronamente
        ↓
5. loading muda para false
        ↓
6. useEffect detecta !user e chama navigate()
        ↓
7. Navegação para /auth ocorre após renderização (correto)
```

**Código completo da correção:**
```typescript
useEffect(() => {
  if (!authLoading && !user) {
    navigate('/auth');
  }
}, [authLoading, user, navigate]);

if (authLoading || !user) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 animated-bg dark:animated-bg animated-bg-light">
      <div className="relative">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <Sparkles className="w-5 h-5 text-primary absolute -top-1 -right-1 animate-pulse" />
      </div>
      <p className="text-muted-foreground animate-pulse">Carregando seu CRM...</p>
    </div>
  );
}
```
