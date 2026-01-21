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
  status: 'Ativo' | 'Vencido' | 'Próximo';
  observacoes?: string;
  comprovanteUrl?: string;
}

export type StatusFilter = 'Todos' | 'Ativo' | 'Vencido' | 'Próximo';
export type PlanoFilter = string;
