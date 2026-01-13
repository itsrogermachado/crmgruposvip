import { MessageCircle, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusBadge } from './StatusBadge';
import { Client } from '@/types/client';

interface ClientTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
}

export function ClientTable({ clients, onEdit, onDelete }: ClientTableProps) {
  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className="data-table mx-6 mb-6">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold text-muted-foreground uppercase text-xs">
              Cliente
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground uppercase text-xs">
              Contato
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground uppercase text-xs">
              Plano
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground uppercase text-xs">
              Preço
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground uppercase text-xs">
              Vencimento
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground uppercase text-xs">
              Status
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground uppercase text-xs">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id} className="hover:bg-muted/30 transition-colors">
              <TableCell className="font-medium text-foreground">
                {client.nome}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-primary">{client.telefone}</span>
                  <MessageCircle className="w-4 h-4 text-primary cursor-pointer hover:text-primary/80" />
                </div>
                {client.discord && (
                  <span className="text-xs text-muted-foreground block mt-0.5">
                    {client.discord}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-foreground">{client.plano}</TableCell>
              <TableCell className="text-foreground">{formatCurrency(client.preco)}</TableCell>
              <TableCell>
                <div>
                  <span className="text-foreground block">{client.dataVencimento}</span>
                  <span className="text-xs text-muted-foreground">
                    Entrada: {client.dataEntrada}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={client.status} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(client)}
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(client.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
