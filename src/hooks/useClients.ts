import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { calculateStatus } from '@/lib/dateUtils';

export interface Client {
  id: string;
  nome: string;
  telefone: string;
  discord?: string;
  telegram?: string;
  plano: 'VIP Completo' | 'Delay' | 'Básico';
  preco: number;
  data_entrada: string;
  data_vencimento: string;
  status: 'Ativo' | 'Vencido' | 'Próximo';
  observacoes?: string;
  comprovante_url?: string;
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchClients = useCallback(async () => {
    if (!user) {
      setClients([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedClients: Client[] = (data || []).map((c) => {
        // Auto-calculate status based on due date
        const autoStatus = calculateStatus(c.data_vencimento);
        
        return {
          id: c.id,
          nome: c.nome,
          telefone: c.telefone,
          discord: c.discord || undefined,
          telegram: c.telegram || undefined,
          plano: c.plano as Client['plano'],
          preco: Number(c.preco),
          data_entrada: c.data_entrada,
          data_vencimento: c.data_vencimento,
          status: autoStatus,
          observacoes: c.observacoes || undefined,
          comprovante_url: c.comprovante_url || undefined,
        };
      });

      setClients(mappedClients);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os clientes.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const addClient = async (clientData: Omit<Client, 'id'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          user_id: user.id,
          nome: clientData.nome,
          telefone: clientData.telefone,
          discord: clientData.discord || null,
          telegram: clientData.telegram || null,
          plano: clientData.plano,
          preco: clientData.preco,
          data_entrada: clientData.data_entrada,
          data_vencimento: clientData.data_vencimento,
          status: clientData.status,
          observacoes: clientData.observacoes || null,
          comprovante_url: clientData.comprovante_url || null,
        })
        .select()
        .single();

      if (error) throw error;

      const newClient: Client = {
        id: data.id,
        nome: data.nome,
        telefone: data.telefone,
        discord: data.discord || undefined,
        telegram: data.telegram || undefined,
        plano: data.plano as Client['plano'],
        preco: Number(data.preco),
        data_entrada: data.data_entrada,
        data_vencimento: data.data_vencimento,
        status: calculateStatus(data.data_vencimento),
        observacoes: data.observacoes || undefined,
        comprovante_url: data.comprovante_url || undefined,
      };

      setClients((prev) => [newClient, ...prev]);
      
      toast({
        title: 'Cliente criado',
        description: 'O novo cliente foi adicionado com sucesso.',
      });

      return newClient;
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o cliente.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateClient = async (id: string, clientData: Partial<Omit<Client, 'id'>>) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({
          nome: clientData.nome,
          telefone: clientData.telefone,
          discord: clientData.discord || null,
          telegram: clientData.telegram || null,
          plano: clientData.plano,
          preco: clientData.preco,
          data_entrada: clientData.data_entrada,
          data_vencimento: clientData.data_vencimento,
          status: clientData.status,
          observacoes: clientData.observacoes || null,
          comprovante_url: clientData.comprovante_url || null,
        })
        .eq('id', id);

      if (error) throw error;

      setClients((prev) =>
        prev.map((c) => {
          if (c.id === id) {
            const updated = { ...c, ...clientData };
            updated.status = calculateStatus(updated.data_vencimento);
            return updated;
          }
          return c;
        })
      );

      toast({
        title: 'Cliente atualizado',
        description: 'As informações do cliente foram atualizadas.',
      });

      return true;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o cliente.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setClients((prev) => prev.filter((c) => c.id !== id));

      toast({
        title: 'Cliente removido',
        description: 'O cliente foi removido com sucesso.',
      });

      return true;
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o cliente.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const importClients = async (newClients: Omit<Client, 'id'>[]) => {
    if (!user) return false;

    try {
      const clientsToInsert = newClients.map((c) => ({
        user_id: user.id,
        nome: c.nome,
        telefone: c.telefone,
        discord: c.discord || null,
        telegram: c.telegram || null,
        plano: c.plano,
        preco: c.preco,
        data_entrada: c.data_entrada,
        data_vencimento: c.data_vencimento,
        status: c.status,
        observacoes: c.observacoes || null,
      }));

      const { data, error } = await supabase
        .from('clients')
        .insert(clientsToInsert)
        .select();

      if (error) throw error;

      const insertedClients: Client[] = (data || []).map((c) => ({
        id: c.id,
        nome: c.nome,
        telefone: c.telefone,
        discord: c.discord || undefined,
        telegram: c.telegram || undefined,
        plano: c.plano as Client['plano'],
        preco: Number(c.preco),
        data_entrada: c.data_entrada,
        data_vencimento: c.data_vencimento,
        status: calculateStatus(c.data_vencimento),
        observacoes: c.observacoes || undefined,
        comprovante_url: c.comprovante_url || undefined,
      }));

      setClients((prev) => [...insertedClients, ...prev]);

      toast({
        title: 'Importação concluída',
        description: `${insertedClients.length} clientes foram importados.`,
      });

      return true;
    } catch (error) {
      console.error('Erro ao importar clientes:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível importar os clientes.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    clients,
    loading,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    importClients,
  };
}
