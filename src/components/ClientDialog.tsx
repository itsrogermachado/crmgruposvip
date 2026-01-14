import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Upload, X, Image as ImageIcon, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Client } from '@/types/client';
import { cn } from '@/lib/utils';
import { parseBRDate, formatToBRDate, calculateStatus } from '@/lib/dateUtils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useClientPlans } from '@/hooks/useClientPlans';

interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  onSave: (client: Omit<Client, 'id'> & { id?: string }) => void;
}

export function ClientDialog({ open, onOpenChange, client, onSave }: ClientDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { plans, addPlan } = useClientPlans();
  
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    discord: '',
    telegram: '',
    plano: 'VIP Completo',
    preco: 150,
    dataEntrada: '',
    dataVencimento: '',
    observacoes: '',
    comprovanteUrl: '',
  });

  const [dataEntradaDate, setDataEntradaDate] = useState<Date | undefined>();
  const [dataVencimentoDate, setDataVencimentoDate] = useState<Date | undefined>();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [newPlanDialogOpen, setNewPlanDialogOpen] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');

  const handleCreatePlan = () => {
    if (newPlanName.trim()) {
      addPlan(newPlanName.trim());
      setFormData({ ...formData, plano: newPlanName.trim() });
      setNewPlanName('');
      setNewPlanDialogOpen(false);
    }
  };

  useEffect(() => {
    if (client) {
      setFormData({
        nome: client.nome,
        telefone: client.telefone,
        discord: client.discord || '',
        telegram: client.telegram || '',
        plano: client.plano,
        preco: client.preco,
        dataEntrada: client.dataEntrada,
        dataVencimento: client.dataVencimento,
        observacoes: client.observacoes || '',
        comprovanteUrl: client.comprovanteUrl || '',
      });
      
      const entradaParsed = parseBRDate(client.dataEntrada);
      const vencimentoParsed = parseBRDate(client.dataVencimento);
      setDataEntradaDate(entradaParsed || undefined);
      setDataVencimentoDate(vencimentoParsed || undefined);
      setPreviewUrl(client.comprovanteUrl || null);
    } else {
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      setFormData({
        nome: '',
        telefone: '',
        discord: '',
        telegram: '',
        plano: 'VIP Completo',
        preco: 150,
        dataEntrada: formatToBRDate(today),
        dataVencimento: formatToBRDate(nextMonth),
        observacoes: '',
        comprovanteUrl: '',
      });
      setDataEntradaDate(today);
      setDataVencimentoDate(nextMonth);
      setPreviewUrl(null);
    }
  }, [client, open]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione apenas arquivos de imagem.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Erro',
        description: 'A imagem deve ter no máximo 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('comprovantes')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('comprovantes')
        .getPublicUrl(fileName);

      setFormData({ ...formData, comprovanteUrl: urlData.publicUrl });
      setPreviewUrl(urlData.publicUrl);
      
      toast({
        title: 'Upload concluído',
        description: 'O comprovante foi enviado com sucesso.',
      });
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar o comprovante.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const removeComprovante = () => {
    setFormData({ ...formData, comprovanteUrl: '' });
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDataEntradaSelect = (date: Date | undefined) => {
    setDataEntradaDate(date);
    if (date) {
      setFormData({ ...formData, dataEntrada: formatToBRDate(date) });
    }
  };

  const handleDataVencimentoSelect = (date: Date | undefined) => {
    setDataVencimentoDate(date);
    if (date) {
      setFormData({ ...formData, dataVencimento: formatToBRDate(date) });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-calculate status based on due date
    const status = calculateStatus(formData.dataVencimento);
    
    onSave({
      ...(client ? { id: client.id } : {}),
      ...formData,
      status,
      discord: formData.discord || undefined,
      telegram: formData.telegram || undefined,
      observacoes: formData.observacoes || undefined,
      comprovanteUrl: formData.comprovanteUrl || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{client ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="+55 00 00000-0000"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discord">Discord (opcional)</Label>
              <Input
                id="discord"
                value={formData.discord}
                onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                placeholder="username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telegram">Telegram (opcional)</Label>
              <Input
                id="telegram"
                value={formData.telegram}
                onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                placeholder="@username"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plano">Plano</Label>
              <Select
                value={formData.plano}
                onValueChange={(v) => {
                  if (v === '__new__') {
                    setNewPlanDialogOpen(true);
                  } else {
                    setFormData({ ...formData, plano: v });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan} value={plan}>{plan}</SelectItem>
                  ))}
                  <Separator className="my-1" />
                  <SelectItem value="__new__">
                    <span className="flex items-center gap-2 text-primary">
                      <Plus className="w-3 h-3" />
                      Novo Plano
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preco">Preço (R$)</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                value={formData.preco}
                onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data de Entrada</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataEntradaDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataEntradaDate ? format(dataEntradaDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataEntradaDate}
                    onSelect={handleDataEntradaSelect}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Data de Vencimento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataVencimentoDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataVencimentoDate ? format(dataVencimentoDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataVencimentoDate}
                    onSelect={handleDataVencimentoSelect}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações (opcional)</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Anotações sobre o cliente..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Comprovante (opcional)</Label>
            <div className="flex flex-col gap-2">
              {previewUrl ? (
                <div className="relative group">
                  <img 
                    src={previewUrl} 
                    alt="Comprovante" 
                    className="w-full h-32 object-cover rounded-md border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={removeComprovante}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  {uploading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Clique para adicionar comprovante</span>
                    </>
                  )}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {client ? 'Salvar' : 'Criar Cliente'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      {/* Dialog para criar novo plano */}
      <Dialog open={newPlanDialogOpen} onOpenChange={setNewPlanDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Novo Plano</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newPlanName">Nome do Plano</Label>
              <Input
                id="newPlanName"
                value={newPlanName}
                onChange={(e) => setNewPlanName(e.target.value)}
                placeholder="Ex: Premium, Gold..."
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewPlanDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreatePlan} disabled={!newPlanName.trim()}>
              Criar Plano
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
