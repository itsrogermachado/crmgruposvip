import { Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusFilter, PlanoFilter } from '@/types/client';

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
  return (
    <div className="filter-section mx-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-muted-foreground" />
        <h2 className="font-semibold text-foreground">Filtros</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Buscar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Nome, número ou Discord..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Status
          </label>
          <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as StatusFilter)}>
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Ativo">Ativo</SelectItem>
              <SelectItem value="Próximo">Próximo</SelectItem>
              <SelectItem value="Vencido">Vencido</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Plano
          </label>
          <Select value={planoFilter} onValueChange={(v) => onPlanoChange(v as PlanoFilter)}>
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="VIP Completo">VIP Completo</SelectItem>
              <SelectItem value="Delay">Delay</SelectItem>
              <SelectItem value="Básico">Básico</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
