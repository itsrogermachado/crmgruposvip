// Utility functions for date handling with São Paulo timezone

export function getSaoPauloDate(): Date {
  // Get current time in São Paulo timezone
  const now = new Date();
  const saoPauloTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  return saoPauloTime;
}

export function parseBRDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  // Handle ISO format YYYY-MM-DD
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
  }

  // Handle DD/MM/YYYY format
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
  }
  
  // Fallback to native Date parsing for other formats
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

export function formatToBRDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function calculateStatus(dataVencimento: string, currentStatus?: string): 'Ativo' | 'Vencido' | 'Próximo' | 'Não renovou' {
  // Manual status "Não renovou" should never be overridden by auto-calculation
  if (currentStatus === 'Não renovou') return 'Não renovou';

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
