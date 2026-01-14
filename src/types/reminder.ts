export interface ReminderSettings {
  id: string;
  user_id: string;
  days_before: number;
  reminder_template: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SentReminder {
  id: string;
  client_id: string;
  user_id: string;
  sent_at: string;
  reminder_type: 'whatsapp' | 'email';
  message?: string;
}
