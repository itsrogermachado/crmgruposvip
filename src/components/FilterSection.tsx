import { useState } from 'react';
import { Filter, Search, SlidersHorizontal, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { StatusFilter, PlanoFilter } from '@/types/client';
import { cn } from '@/lib/utils';
import { useClientPlans } from '@/hooks/useClientPlans';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface FilterSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  planoFilter: PlanoFilter;
  onPlanoChange: (value: PlanoFilter) => void;
}

export function FilterSection({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  planoFilter,
  onPlanoChange,
}: FilterSectionProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const hasActiveFilters = statusFilter !== 'Todos' || planoFilter !== 'Todos';
  const { plans, addPlan } = useClientPlans();
  const [newPlanDialogOpen, setNewPlanDialogOpen] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');

  const handleCreatePlan = () => {
    if (newPlanName.trim()) {
      addPlan(newPlanName.trim());
      setNewPlanName('');
      setNewPlanDialogOpen(false);
    }
  };

  return (
    <>
      <div className="filter-section mx-4 md:mx-6 animate-slide-in-left p-4 sm:p-5 md:p-6" style={{ animationDelay: '0.3s' }}>
        {/* Mobile: Search + Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="relative group flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 input-glow transition-all duration-300 border-border/50 focus:border-primary/50 bg-background/50"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={cn(
              'flex-shrink-0 transition-all duration-300',
              hasActiveFilters && 'border-primary text-primary'
            )}
          >
            {filtersOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <Filter className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        {/* Mobile: Collapsible Filters */}
        <div className={cn(
          'md:hidden overflow-hidden transition-all duration-300',
          filtersOpen ? 'max-h-40 mt-3' : 'max-h-0'
        )}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as StatusFilter)}>
                <SelectTrigger className="h-9 text-sm border-border/50 focus:border-primary/50 bg-background/50">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="Ativo">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-status-active" />
                      Ativo
                    </span>
                  </SelectItem>
                  <SelectItem value="Próximo">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-status-warning" />
                      Próximo
                    </span>
                  </SelectItem>
                  <SelectItem value="Vencido">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-status-expired" />
                      Vencido
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Plano</label>
              <Select value={planoFilter} onValueChange={(v) => {
                if (v === '__new__') {
                  setNewPlanDialogOpen(true);
                } else {
                  onPlanoChange(v as PlanoFilter);
                }
              }}>
                <SelectTrigger className="h-9 text-sm border-border/50 focus:border-primary/50 bg-background/50">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos os Planos</SelectItem>
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
          </div>
        </div>
        
        {/* Desktop: Full Layout */}
        <div className="hidden md:block">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-semibold text-foreground text-lg">Filtros</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground block">
                Buscar
              </label>
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  placeholder="Nome, número ou Discord..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 input-glow transition-all duration-300 border-border/50 focus:border-primary/50 bg-background/50"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground block">
                Status
              </label>
              <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as StatusFilter)}>
                <SelectTrigger className="transition-all duration-300 border-border/50 focus:border-primary/50 bg-background/50">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos os Status</SelectItem>
                  <SelectItem value="Ativo">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-status-active" />
                      Ativo
                    </span>
                  </SelectItem>
                  <SelectItem value="Próximo">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-status-warning" />
                      Próximo
                    </span>
                  </SelectItem>
                  <SelectItem value="Vencido">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-status-expired" />
                      Vencido
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground block">
                Plano
              </label>
              <Select value={planoFilter} onValueChange={(v) => {
                if (v === '__new__') {
                  setNewPlanDialogOpen(true);
                } else {
                  onPlanoChange(v as PlanoFilter);
                }
              }}>
                <SelectTrigger className="transition-all duration-300 border-border/50 focus:border-primary/50 bg-background/50">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos os Planos</SelectItem>
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
          </div>
        </div>
      </div>

      {/* Dialog para criar novo plano */}
      <Dialog open={newPlanDialogOpen} onOpenChange={setNewPlanDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Novo Plano</DialogTitle>
            <DialogDescription>
              Crie um novo plano para categorizar seus clientes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="planName">Nome do Plano</Label>
              <Input
                id="planName"
                value={newPlanName}
                onChange={(e) => setNewPlanName(e.target.value)}
                placeholder="Ex: Premium, Gold, Básico..."
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
    </>
  );
}
