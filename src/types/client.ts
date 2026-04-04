export interface Client {
  id: string;
  nome: string;
  telefone: string;
  discord?: string;
  telegram?: string;
  plano: string;
  preco: number;
  precoRenovacao?: number;
  dataEntrada: string;
  dataVencimento: string;
  status: 'Ativo' | 'Vencido' | 'Próximo' | 'Não renovou';
  observacoes?: string;
  comprovanteUrl?: string;
}

export type StatusFilter = 'Todos' | 'Ativo' | 'Vencido' | 'Próximo' | 'Não renovou';
export type PlanoFilter = string;
