// Utility functions for date handling with São Paulo timezone

export function getSaoPauloDate(): Date {
  // Get current time in São Paulo timezone
  const now = new Date();
  const saoPauloTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  return saoPauloTime;
}

export function parseBRDate(dateStr: string): Date | null {
  // Parse DD/MM/YYYY format
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  
  return new Date(year, month, day);
}

export function formatToBRDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function calculateStatus(dataVencimento: string): 'Ativo' | 'Vencido' | 'Próximo' {
  const vencimento = parseBRDate(dataVencimento);
  if (!vencimento) return 'Ativo';
  
  const hoje = getSaoPauloDate();
  hoje.setHours(0, 0, 0, 0);
  vencimento.setHours(0, 0, 0, 0);
  
  const diffTime = vencimento.getTime() - hoje.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return 'Vencido';
  } else if (diffDays <= 3) {
    return 'Próximo';
  }
  
  return 'Ativo';
}
