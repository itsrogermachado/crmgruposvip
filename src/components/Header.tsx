import { RefreshCw, Upload, Download, UserPlus, Moon, Sun, LogOut, Shield, CreditCard, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { SubscriptionCountdown } from './SubscriptionCountdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
  onImport: () => void;
  onExport: () => void;
  onNewClient: () => void;
  onRefresh: () => void;
  onLogout: () => void;
  userEmail?: string;
  groupName?: string | null;
  avatarUrl?: string | null;
}

export function Header({ 
  onImport, 
  onExport, 
  onNewClient, 
  onRefresh, 
  onLogout, 
  userEmail,
  groupName,
  avatarUrl
}: HeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
  };

  const displayName = groupName || 'CRM Grupos VIP';
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <header className="flex items-center justify-between py-4 px-6 bg-card border-b">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/settings')} 
          className="flex items-center gap-4 hover:opacity-80 transition-opacity cursor-pointer"
          title="Clique para editar seu perfil"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarUrl || undefined} alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <h1 className="text-xl font-bold text-foreground">{displayName}</h1>
            {userEmail && (
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            )}
          </div>
        </button>
        <SubscriptionCountdown />
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => navigate('/plans')}>
          <CreditCard className="w-4 h-4 mr-2" />
          Ver Planos
        </Button>

        {isAdmin && (
          <Button variant="outline" onClick={() => navigate('/admin')}>
            <Shield className="w-4 h-4 mr-2" />
            Painel Admin
          </Button>
        )}
        
        <Button variant="ghost" size="icon" onClick={onRefresh}>
          <RefreshCw className="w-5 h-5" />
        </Button>
        
        <Button onClick={onImport} className="bg-stat-green hover:bg-stat-green/90">
          <Upload className="w-4 h-4 mr-2" />
          Importar Excel
        </Button>
        
        <Button onClick={onExport} className="bg-stat-cyan hover:bg-stat-cyan/90">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
        
        <Button onClick={onNewClient}>
          <UserPlus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
        
        <Button variant="ghost" size="icon" onClick={() => navigate('/settings')} title="Configurações">
          <Settings className="w-5 h-5" />
        </Button>

        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        <Button variant="ghost" size="icon" onClick={onLogout} title="Sair">
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
