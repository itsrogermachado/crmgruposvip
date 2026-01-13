import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { Header } from '@/components/Header';
import { StatsGrid } from '@/components/StatsGrid';
import { FilterSection } from '@/components/FilterSection';
import { ClientTable } from '@/components/ClientTable';
import { ClientDialog } from '@/components/ClientDialog';
import { StatusFilter, PlanoFilter } from '@/types/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useClients, Client } from '@/hooks/useClients';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { clients, loading: clientsLoading, fetchClients, addClient, updateClient, deleteClient, importClients } = useClients();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Todos');
  const [planoFilter, setPlanoFilter] = useState<PlanoFilter>('Todos');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Redirect to auth if not logged in
  if (!authLoading && !user) {
    navigate('/auth');
    return null;
  }

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.telefone.includes(searchTerm) ||
        (client.discord && client.discord.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'Todos' || client.status === statusFilter;
      const matchesPlano = planoFilter === 'Todos' || client.plano === planoFilter;

      return matchesSearch && matchesStatus && matchesPlano;
    });
  }, [clients, searchTerm, statusFilter, planoFilter]);

  // Convert Client to table format
  const tableClients = useMemo(() => {
    return filteredClients.map((c) => ({
      id: c.id,
      nome: c.nome,
      telefone: c.telefone,
      discord: c.discord,
      telegram: c.telegram,
      plano: c.plano,
      preco: c.preco,
      dataEntrada: c.data_entrada,
      dataVencimento: c.data_vencimento,
      status: c.status,
    }));
  }, [filteredClients]);

  // Convert for stats
  const statsClients = useMemo(() => {
    return clients.map((c) => ({
      id: c.id,
      nome: c.nome,
      telefone: c.telefone,
      discord: c.discord,
      telegram: c.telegram,
      plano: c.plano,
      preco: c.preco,
      dataEntrada: c.data_entrada,
      dataVencimento: c.data_vencimento,
      status: c.status,
    }));
  }, [clients]);

  const handleNewClient = () => {
    setEditingClient(null);
    setDialogOpen(true);
  };

  const handleEditClient = (client: { id: string; nome: string; telefone: string; discord?: string; telegram?: string; plano: string; preco: number; dataEntrada: string; dataVencimento: string; status: string }) => {
    const clientToEdit: Client = {
      id: client.id,
      nome: client.nome,
      telefone: client.telefone,
      discord: client.discord,
      telegram: client.telegram,
      plano: client.plano as Client['plano'],
      preco: client.preco,
      data_entrada: client.dataEntrada,
      data_vencimento: client.dataVencimento,
      status: client.status as Client['status'],
    };
    setEditingClient(clientToEdit);
    setDialogOpen(true);
  };

  const handleDeleteClient = async (clientId: string) => {
    await deleteClient(clientId);
  };

  const handleSaveClient = async (clientData: { id?: string; nome: string; telefone: string; discord?: string; telegram?: string; plano: string; preco: number; dataEntrada: string; dataVencimento: string; status: string }) => {
    if (clientData.id) {
      await updateClient(clientData.id, {
        nome: clientData.nome,
        telefone: clientData.telefone,
        discord: clientData.discord,
        telegram: clientData.telegram,
        plano: clientData.plano as Client['plano'],
        preco: clientData.preco,
        data_entrada: clientData.dataEntrada,
        data_vencimento: clientData.dataVencimento,
        status: clientData.status as Client['status'],
      });
    } else {
      await addClient({
        nome: clientData.nome,
        telefone: clientData.telefone,
        discord: clientData.discord,
        telegram: clientData.telegram,
        plano: clientData.plano as Client['plano'],
        preco: clientData.preco,
        data_entrada: clientData.dataEntrada,
        data_vencimento: clientData.dataVencimento,
        status: clientData.status as Client['status'],
      });
    }
  };

  const handleRefresh = () => {
    fetchClients();
    toast({
      title: 'Dados atualizados',
      description: 'A lista de clientes foi atualizada.',
    });
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[];

        const importedClients: Omit<Client, 'id'>[] = jsonData.map((row) => ({
          nome: String(row['Nome'] || row['nome'] || ''),
          telefone: String(row['Telefone'] || row['telefone'] || ''),
          discord: row['Discord'] || row['discord'] ? String(row['Discord'] || row['discord']) : undefined,
          telegram: row['Telegram'] || row['telegram'] ? String(row['Telegram'] || row['telegram']) : undefined,
          plano: (row['Plano'] || row['plano'] || 'VIP Completo') as Client['plano'],
          preco: Number(row['Preço'] || row['preco'] || row['Preco'] || 0),
          data_entrada: String(row['Data Entrada'] || row['dataEntrada'] || row['data_entrada'] || ''),
          data_vencimento: String(row['Data Vencimento'] || row['dataVencimento'] || row['data_vencimento'] || ''),
          status: (row['Status'] || row['status'] || 'Ativo') as Client['status'],
        }));

        await importClients(importedClients);
      } catch (error) {
        toast({
          title: 'Erro na importação',
          description: 'Não foi possível importar o arquivo.',
          variant: 'destructive',
        });
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const handleExport = () => {
    const exportData = clients.map((c) => ({
      Nome: c.nome,
      Telefone: c.telefone,
      Discord: c.discord || '',
      Telegram: c.telegram || '',
      Plano: c.plano,
      Preço: c.preco,
      'Data Entrada': c.data_entrada,
      'Data Vencimento': c.data_vencimento,
      Status: c.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');
    XLSX.writeFile(workbook, 'clientes_vip.xlsx');

    toast({
      title: 'Exportação concluída',
      description: 'O arquivo Excel foi baixado.',
    });
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  if (authLoading || clientsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onImport={handleImport}
        onExport={handleExport}
        onNewClient={handleNewClient}
        onRefresh={handleRefresh}
        onLogout={handleLogout}
        userEmail={user?.email}
      />

      <StatsGrid clients={statsClients} />

      <FilterSection
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        planoFilter={planoFilter}
        onPlanoChange={setPlanoFilter}
      />

      <div className="mt-6">
        <ClientTable
          clients={tableClients}
          onEdit={handleEditClient}
          onDelete={handleDeleteClient}
        />
      </div>

      <ClientDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        client={editingClient ? {
          id: editingClient.id,
          nome: editingClient.nome,
          telefone: editingClient.telefone,
          discord: editingClient.discord,
          telegram: editingClient.telegram,
          plano: editingClient.plano,
          preco: editingClient.preco,
          dataEntrada: editingClient.data_entrada,
          dataVencimento: editingClient.data_vencimento,
          status: editingClient.status,
        } : null}
        onSave={handleSaveClient}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default Index;
