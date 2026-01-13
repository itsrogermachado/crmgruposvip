import { useState, useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Header } from '@/components/Header';
import { StatsGrid } from '@/components/StatsGrid';
import { FilterSection } from '@/components/FilterSection';
import { ClientTable } from '@/components/ClientTable';
import { ClientDialog } from '@/components/ClientDialog';
import { mockClients } from '@/data/mockClients';
import { Client, StatusFilter, PlanoFilter } from '@/types/client';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Todos');
  const [planoFilter, setPlanoFilter] = useState<PlanoFilter>('Todos');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  const handleNewClient = () => {
    setEditingClient(null);
    setDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setDialogOpen(true);
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(clients.filter((c) => c.id !== clientId));
    toast({
      title: 'Cliente removido',
      description: 'O cliente foi removido com sucesso.',
    });
  };

  const handleSaveClient = (clientData: Omit<Client, 'id'> & { id?: string }) => {
    if (clientData.id) {
      setClients(clients.map((c) => (c.id === clientData.id ? { ...clientData, id: c.id } as Client : c)));
      toast({
        title: 'Cliente atualizado',
        description: 'As informações do cliente foram atualizadas.',
      });
    } else {
      const newClient: Client = {
        ...clientData,
        id: Date.now().toString(),
      } as Client;
      setClients([...clients, newClient]);
      toast({
        title: 'Cliente criado',
        description: 'O novo cliente foi adicionado com sucesso.',
      });
    }
  };

  const handleRefresh = () => {
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
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[];

        const importedClients: Client[] = jsonData.map((row, index) => ({
          id: Date.now().toString() + index,
          nome: String(row['Nome'] || row['nome'] || ''),
          telefone: String(row['Telefone'] || row['telefone'] || ''),
          discord: row['Discord'] || row['discord'] ? String(row['Discord'] || row['discord']) : undefined,
          telegram: row['Telegram'] || row['telegram'] ? String(row['Telegram'] || row['telegram']) : undefined,
          plano: (row['Plano'] || row['plano'] || 'VIP Completo') as Client['plano'],
          preco: Number(row['Preço'] || row['preco'] || row['Preco'] || 0),
          dataEntrada: String(row['Data Entrada'] || row['dataEntrada'] || ''),
          dataVencimento: String(row['Data Vencimento'] || row['dataVencimento'] || ''),
          status: (row['Status'] || row['status'] || 'Ativo') as Client['status'],
        }));

        setClients([...clients, ...importedClients]);
        toast({
          title: 'Importação concluída',
          description: `${importedClients.length} clientes foram importados.`,
        });
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
      'Data Entrada': c.dataEntrada,
      'Data Vencimento': c.dataVencimento,
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

  return (
    <div className="min-h-screen bg-background">
      <Header
        onImport={handleImport}
        onExport={handleExport}
        onNewClient={handleNewClient}
        onRefresh={handleRefresh}
      />

      <StatsGrid clients={clients} />

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
          clients={filteredClients}
          onEdit={handleEditClient}
          onDelete={handleDeleteClient}
        />
      </div>

      <ClientDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        client={editingClient}
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
