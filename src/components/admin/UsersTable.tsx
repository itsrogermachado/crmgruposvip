import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Shield, ShieldOff, Search } from 'lucide-react';
import { Profile, UserRole, useToggleAdminRole } from '@/hooks/useAdminData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface UsersTableProps {
  profiles: Profile[];
  userRoles: UserRole[];
}

export function UsersTable({ profiles, userRoles }: UsersTableProps) {
  const [search, setSearch] = useState('');
  const toggleAdminMutation = useToggleAdminRole();

  const isUserAdmin = (userId: string) => {
    return userRoles.some(role => role.user_id === userId && role.role === 'admin');
  };

  const filteredProfiles = profiles.filter(profile =>
    profile.email?.toLowerCase().includes(search.toLowerCase()) ||
    profile.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleAdmin = (userId: string) => {
    const isCurrentlyAdmin = isUserAdmin(userId);
    toggleAdminMutation.mutate({ userId, isCurrentlyAdmin });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por email ou nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Data de Cadastro</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProfiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredProfiles.map((profile) => {
                const isAdmin = isUserAdmin(profile.user_id);
                return (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">{profile.email || '-'}</TableCell>
                    <TableCell>{profile.full_name || '-'}</TableCell>
                    <TableCell>
                      {format(new Date(profile.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge variant="secondary">user</Badge>
                        {isAdmin && <Badge variant="default">admin</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant={isAdmin ? 'destructive' : 'outline'}
                        size="sm"
                        onClick={() => handleToggleAdmin(profile.user_id)}
                        disabled={toggleAdminMutation.isPending}
                      >
                        {isAdmin ? (
                          <>
                            <ShieldOff className="h-4 w-4 mr-1" />
                            Remover Admin
                          </>
                        ) : (
                          <>
                            <Shield className="h-4 w-4 mr-1" />
                            Tornar Admin
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
