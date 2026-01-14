import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ReminderSettings, SentReminder } from '@/types/reminder';
import { useToast } from '@/hooks/use-toast';

export function useReminderSettings() {
  const [settings, setSettings] = useState<ReminderSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('reminder_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      setSettings(data as ReminderSettings | null);
    } catch (error: any) {
      console.error('Error fetching reminder settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveSettings = async (settingsData: Partial<ReminderSettings>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      if (settings) {
        // Update existing
        const { data, error } = await supabase
          .from('reminder_settings')
          .update(settingsData)
          .eq('id', settings.id)
          .select()
          .single();

        if (error) throw error;
        setSettings(data as ReminderSettings);
      } else {
        // Create new
        const { data, error } = await supabase
          .from('reminder_settings')
          .insert({
            user_id: user.id,
            days_before: settingsData.days_before || 3,
            reminder_template: settingsData.reminder_template || 'Olá {nome}! Seu plano VIP vence em {dias} dias. Renove para continuar aproveitando os benefícios!',
            is_active: settingsData.is_active !== false,
          })
          .select()
          .single();

        if (error) throw error;
        setSettings(data as ReminderSettings);
      }

      toast({
        title: 'Configurações salvas',
        description: 'Configurações de lembrete salvas com sucesso!',
      });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Erro ao salvar configurações',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logSentReminder = async (clientId: string, reminderType: 'whatsapp' | 'email', message: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('sent_reminders')
        .insert({
          client_id: clientId,
          user_id: user.id,
          reminder_type: reminderType,
          message,
        });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error logging reminder:', error);
    }
  };

  const getRecentReminders = async (clientId: string, withinHours: number = 24): Promise<SentReminder[]> => {
    try {
      const hoursAgo = new Date();
      hoursAgo.setHours(hoursAgo.getHours() - withinHours);

      const { data, error } = await supabase
        .from('sent_reminders')
        .select('*')
        .eq('client_id', clientId)
        .gte('sent_at', hoursAgo.toISOString())
        .order('sent_at', { ascending: false });

      if (error) throw error;

      return (data || []) as SentReminder[];
    } catch (error: any) {
      console.error('Error fetching recent reminders:', error);
      return [];
    }
  };

  return {
    settings,
    loading,
    fetchSettings,
    saveSettings,
    logSentReminder,
    getRecentReminders,
  };
}
