import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ExcelJS from 'exceljs';
import { Header } from '@/components/Header';
import { StatsGrid } from '@/components/StatsGrid';
import { ChartsSection } from '@/components/ChartsSection';
import { FilterSection } from '@/components/FilterSection';
import { ClientTable } from '@/components/ClientTable';
import { ClientDialog } from '@/components/ClientDialog';
import { SubscriptionRequired } from '@/components/SubscriptionRequired';
import { BottomNav } from '@/components/BottomNav';
import { StatusFilter, PlanoFilter } from '@/types/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useClients, Client } from '@/hooks/useClients';
import { useProfile } from '@/hooks/useProfile';
import { Loader2, Sparkles } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { clients, loading: clientsLoading, fetchClients, addClient, updateClient, deleteClient, importClients } = useClients();
  const { profile } = useProfile();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Todos');
  const [planoFilter, setPlanoFilter] = useState<PlanoFilter>('Todos');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
      comprovanteUrl: c.comprovante_url,
      observacoes: c.observacoes,
    }));
  }, [filteredClients]);

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

  const handleEditClient = (client: { id: string; nome: string; telefone: string; discord?: string; telegram?: string; plano: string; preco: number; dataEntrada: string; dataVencimento: string; status: string; comprovanteUrl?: string; observacoes?: string }) => {
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
      comprovante_url: client.comprovanteUrl,
      observacoes: client.observacoes,
    };
    setEditingClient(clientToEdit);
    setDialogOpen(true);
  };

  const handleDeleteClient = async (clientId: string) => {
    await deleteClient(clientId);
  };

  const handleSaveClient = async (clientData: { id?: string; nome: string; telefone: string; discord?: string; telegram?: string; plano: string; preco: number; dataEntrada: string; dataVencimento: string; status: string; comprovanteUrl?: string; observacoes?: string }) => {
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
        comprovante_url: clientData.comprovanteUrl,
        observacoes: clientData.observacoes,
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
        comprovante_url: clientData.comprovanteUrl,
        observacoes: clientData.observacoes,
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);
      
      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        throw new Error('Planilha vazia');
      }

      const jsonData: Record<string, unknown>[] = [];
      const headerRow = worksheet.getRow(1);
      const headers: string[] = [];
      
      headerRow.eachCell((cell, colNumber) => {
        headers[colNumber] = String(cell.value || '');
      });

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const rowData: Record<string, unknown> = {};
        row.eachCell((cell, colNumber) => {
          const header = headers[colNumber];
          if (header) {
            rowData[header] = cell.value;
          }
        });
        if (Object.keys(rowData).length > 0) {
          jsonData.push(rowData);
        }
      });

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
    e.target.value = '';
  };

  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Clientes');

    worksheet.columns = [
      { header: 'Nome', key: 'nome', width: 25 },
      { header: 'Telefone', key: 'telefone', width: 15 },
      { header: 'Discord', key: 'discord', width: 20 },
      { header: 'Telegram', key: 'telegram', width: 20 },
      { header: 'Plano', key: 'plano', width: 15 },
      { header: 'Preço', key: 'preco', width: 10 },
      { header: 'Data Entrada', key: 'data_entrada', width: 15 },
      { header: 'Data Vencimento', key: 'data_vencimento', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
    ];

    clients.forEach((c) => {
      worksheet.addRow({
        nome: c.nome,
        telefone: c.telefone,
        discord: c.discord || '',
        telegram: c.telegram || '',
        plano: c.plano,
        preco: c.preco,
        data_entrada: c.data_entrada,
        data_vencimento: c.data_vencimento,
        status: c.status,
      });
    });

    worksheet.getRow(1).font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'clientes_vip.xlsx';
    link.click();
    URL.revokeObjectURL(url);

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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 animated-bg dark:animated-bg animated-bg-light">
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <Sparkles className="w-5 h-5 text-primary absolute -top-1 -right-1 animate-pulse" />
        </div>
        <p className="text-muted-foreground animate-pulse">Carregando seu CRM...</p>
      </div>
    );
  }

  return (
    <SubscriptionRequired>
      <div className="min-h-screen animated-bg dark:animated-bg animated-bg-light safe-area-pb" style={{ paddingBottom: 'clamp(5rem, 20vw, 0rem)' }}>
        <Header
          onImport={handleImport}
          onExport={handleExport}
          onNewClient={handleNewClient}
          onRefresh={handleRefresh}
          onLogout={handleLogout}
          userEmail={user?.email}
          groupName={profile?.group_name}
          avatarUrl={profile?.avatar_url}
        />

        <main className="pb-4 md:pb-8">
          <StatsGrid clients={statsClients} />

          <ChartsSection clients={statsClients} />

          <FilterSection
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            planoFilter={planoFilter}
            onPlanoChange={setPlanoFilter}
          />

          <div className="mt-4 md:mt-6">
            <ClientTable
              clients={tableClients}
              onEdit={handleEditClient}
              onDelete={handleDeleteClient}
            />
          </div>
        </main>

        {/* Bottom Navigation - Mobile Only */}
        <BottomNav
          onNewClient={handleNewClient}
          onImport={handleImport}
          onExport={handleExport}
          onRefresh={handleRefresh}
          onLogout={handleLogout}
        />

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
            comprovanteUrl: editingClient.comprovante_url,
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
    </SubscriptionRequired>
  );
};

export default Index;
