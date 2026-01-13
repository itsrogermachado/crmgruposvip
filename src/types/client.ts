export interface Client {
  id: string;
  nome: string;
  telefone: string;
  discord?: string;
  telegram?: string;
  plano: 'VIP Completo' | 'Delay' | 'Básico';
  preco: number;
  dataEntrada: string;
  dataVencimento: string;
  status: 'Ativo' | 'Vencido' | 'Próximo';
}

export type StatusFilter = 'Todos' | 'Ativo' | 'Vencido' | 'Próximo';
export type PlanoFilter = 'Todos' | 'VIP Completo' | 'Delay' | 'Básico';
