import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Group } from '@/types/group';
import { useToast } from '@/hooks/use-toast';

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchGroups = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const groupsData = (data || []) as Group[];
      setGroups(groupsData);

      // Set active group to default or first group
      if (groupsData.length > 0 && !activeGroup) {
        const defaultGroup = groupsData.find(g => g.is_default) || groupsData[0];
        setActiveGroup(defaultGroup);
      }
    } catch (error: any) {
      console.error('Error fetching groups:', error);
      toast({
        title: 'Erro ao carregar grupos',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast, activeGroup]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const createGroup = async (groupData: { name: string; description?: string; color: string; is_default?: boolean }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // If this is set as default, unset other defaults
      if (groupData.is_default) {
        await supabase
          .from('groups')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      const { data, error } = await supabase
        .from('groups')
        .insert({
          user_id: user.id,
          name: groupData.name,
          description: groupData.description,
          color: groupData.color,
          is_default: groupData.is_default || false,
        })
        .select()
        .single();

      if (error) throw error;

      const newGroup = data as Group;
      setGroups(prev => [...prev, newGroup]);
      
      if (groupData.is_default || groups.length === 0) {
        setActiveGroup(newGroup);
      }

      toast({
        title: 'Grupo criado',
        description: `Grupo "${groupData.name}" criado com sucesso!`,
      });

      return newGroup;
    } catch (error: any) {
      console.error('Error creating group:', error);
      toast({
        title: 'Erro ao criar grupo',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateGroup = async (id: string, groupData: Partial<Group>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // If this is set as default, unset other defaults
      if (groupData.is_default) {
        await supabase
          .from('groups')
          .update({ is_default: false })
          .eq('user_id', user.id)
          .neq('id', id);
      }

      const { data, error } = await supabase
        .from('groups')
        .update(groupData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedGroup = data as Group;
      setGroups(prev => prev.map(g => g.id === id ? updatedGroup : g));
      
      if (activeGroup?.id === id) {
        setActiveGroup(updatedGroup);
      }

      toast({
        title: 'Grupo atualizado',
        description: 'Grupo atualizado com sucesso!',
      });

      return updatedGroup;
    } catch (error: any) {
      console.error('Error updating group:', error);
      toast({
        title: 'Erro ao atualizar grupo',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteGroup = async (id: string) => {
    try {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setGroups(prev => prev.filter(g => g.id !== id));
      
      if (activeGroup?.id === id) {
        const remaining = groups.filter(g => g.id !== id);
        setActiveGroup(remaining[0] || null);
      }

      toast({
        title: 'Grupo excluído',
        description: 'Grupo excluído com sucesso!',
      });
    } catch (error: any) {
      console.error('Error deleting group:', error);
      toast({
        title: 'Erro ao excluir grupo',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const createDefaultGroupIfNeeded = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Check if user has any groups
      const { data: existingGroups } = await supabase
        .from('groups')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (existingGroups && existingGroups.length > 0) {
        return null;
      }

      // Create default group
      const { data, error } = await supabase
        .from('groups')
        .insert({
          user_id: user.id,
          name: 'Grupo Padrão',
          description: 'Grupo padrão para seus clientes',
          color: '#3B82F6',
          is_default: true,
        })
        .select()
        .single();

      if (error) throw error;

      const newGroup = data as Group;
      setGroups([newGroup]);
      setActiveGroup(newGroup);

      return newGroup;
    } catch (error: any) {
      console.error('Error creating default group:', error);
      return null;
    }
  };

  return {
    groups,
    activeGroup,
    setActiveGroup,
    loading,
    fetchGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    createDefaultGroupIfNeeded,
  };
}
