import { useState, useEffect } from 'react';
import { Bell, Settings } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { useReminderSettings } from '@/hooks/useReminderSettings';

interface ReminderSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReminderSettingsDialog({ open, onOpenChange }: ReminderSettingsDialogProps) {
  const { settings, loading, saveSettings } = useReminderSettings();
  
  const [formData, setFormData] = useState({
    days_before: 3,
    reminder_template: 'Olá {nome}! Seu plano VIP vence em {dias} dias. Renove para continuar aproveitando os benefícios!',
    is_active: true,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        days_before: settings.days_before,
        reminder_template: settings.reminder_template,
        is_active: settings.is_active,
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettings(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Configurações de Lembretes
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <Label htmlFor="is_active" className="cursor-pointer font-medium">
                Lembretes Ativos
              </Label>
              <p className="text-sm text-muted-foreground">
                Habilitar lembretes automáticos de renovação
              </p>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="days_before">Dias de Antecedência</Label>
            <div className="flex items-center gap-2">
              <Input
                id="days_before"
                type="number"
                min={1}
                max={30}
                value={formData.days_before}
                onChange={(e) => setFormData({ ...formData, days_before: parseInt(e.target.value) || 3 })}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">dias antes do vencimento</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder_template">Template da Mensagem</Label>
            <Textarea
              id="reminder_template"
              value={formData.reminder_template}
              onChange={(e) => setFormData({ ...formData, reminder_template: e.target.value })}
              placeholder="Mensagem de lembrete..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Variáveis disponíveis: {'{nome}'}, {'{dias}'}, {'{plano}'}, {'{valor}'}
            </p>
          </div>

          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm font-medium mb-1">Preview da mensagem:</p>
            <p className="text-sm text-muted-foreground">
              {formData.reminder_template
                .replace('{nome}', 'João')
                .replace('{dias}', String(formData.days_before))
                .replace('{plano}', 'VIP Completo')
                .replace('{valor}', 'R$ 150,00')}
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              Salvar Configurações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
