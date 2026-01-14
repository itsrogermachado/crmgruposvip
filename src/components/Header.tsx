import { RefreshCw, Upload, Download, UserPlus, Moon, Sun, LogOut, Shield, CreditCard, Settings, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { SubscriptionCountdown } from './SubscriptionCountdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { WhatsAppSupport } from './WhatsAppSupport';

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
  const [isRefreshing, setIsRefreshing] = useState(false);
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

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const displayName = groupName || 'CRM Grupos VIP';
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <header className="header-premium sticky top-0 z-50 animate-fade-in-down">
      <div className="flex items-center justify-between py-3 px-4 md:py-4 md:px-6">
        {/* Left: Avatar + Name */}
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <button 
            onClick={() => navigate('/settings')} 
            className="group flex items-center gap-3 md:gap-4 transition-all duration-300 hover:scale-[1.02] min-w-0"
            title="Clique para editar seu perfil"
          >
            <div className="relative flex-shrink-0">
              <Avatar className="h-10 w-10 md:h-12 md:w-12 ring-2 ring-primary/20 ring-offset-2 ring-offset-background transition-all duration-300 group-hover:ring-primary/50">
                <AvatarImage src={avatarUrl || undefined} alt={displayName} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-bold text-sm md:text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-status-active rounded-full border-2 border-background animate-pulse" />
            </div>
            <div className="text-left hidden sm:block min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent truncate max-w-[150px] md:max-w-none">
                  {displayName}
                </h1>
                <Sparkles className="w-4 h-4 text-primary animate-pulse flex-shrink-0" />
              </div>
              {userEmail && (
                <p className="text-xs md:text-sm text-muted-foreground truncate max-w-[150px] md:max-w-none">{userEmail}</p>
              )}
            </div>
          </button>
          <div className="hidden lg:block">
            <SubscriptionCountdown />
          </div>
        </div>
        
        {/* Right: Actions - Hidden on mobile (handled by BottomNav) */}
        <div className="hidden md:flex items-center gap-2">
          <WhatsAppSupport variant="inline" />
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/plans')}
            className="border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Ver Planos
          </Button>

          {isAdmin && (
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
              className="border-stat-purple/20 hover:border-stat-purple/50 hover:bg-stat-purple/5 transition-all duration-300"
            >
              <Shield className="w-4 h-4 mr-2 text-stat-purple" />
              Admin
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh}
            className="hover:bg-primary/10 transition-all duration-300"
          >
            <RefreshCw className={`w-5 h-5 transition-transform duration-500 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button 
            onClick={onImport} 
            className="hidden lg:flex btn-premium bg-gradient-to-r from-stat-green to-stat-green/80 hover:from-stat-green/90 hover:to-stat-green/70 text-white border-0"
          >
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
          
          <Button 
            onClick={onExport} 
            className="hidden lg:flex btn-premium bg-gradient-to-r from-stat-cyan to-stat-cyan/80 hover:from-stat-cyan/90 hover:to-stat-cyan/70 text-white border-0"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          
          <Button 
            onClick={onNewClient}
            className="btn-premium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 border-0"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/settings')} 
            title="Configurações"
            className="hover:bg-primary/10 transition-all duration-300"
          >
            <Settings className="w-5 h-5" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="hover:bg-primary/10 transition-all duration-300"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-stat-yellow transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-5 h-5 transition-transform duration-300 hover:-rotate-12" />
            )}
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onLogout} 
            title="Sair"
            className="hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
