export interface ClientPayment {
  id: string;
  client_id: string;
  user_id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  notes?: string;
  comprovante_url?: string;
  created_at: string;
}

export type PaymentMethod = 'pix' | 'dinheiro' | 'cartao' | 'transferencia';
