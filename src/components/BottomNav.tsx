import { Home, Users, Plus, CreditCard, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Upload, Download, Settings, LogOut, Shield, RefreshCw, Moon, Sun } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { useState, useEffect } from 'react';

interface BottomNavProps {
  onNewClient: () => void;
  onImport: () => void;
  onExport: () => void;
  onRefresh: () => void;
  onLogout: () => void;
}

export function BottomNav({ onNewClient, onImport, onExport, onRefresh, onLogout }: BottomNavProps) {
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToClients = () => {
    const table = document.querySelector('.data-table');
    table?.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { icon: Home, label: 'Início', onClick: scrollToTop },
    { icon: Users, label: 'Clientes', onClick: scrollToClients },
    { icon: Plus, label: 'Novo', onClick: onNewClient, primary: true },
    { icon: CreditCard, label: 'Planos', onClick: () => navigate('/plans') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-background/95 backdrop-blur-lg border-t border-border/50 px-2 py-2 safe-area-pb">
        <div className="flex items-center justify-around">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200',
                item.primary 
                  ? 'bg-primary text-primary-foreground -mt-6 shadow-lg shadow-primary/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <item.icon className={cn('w-5 h-5', item.primary && 'w-6 h-6')} />
              <span className={cn('text-[10px] font-medium', item.primary && 'text-xs')}>{item.label}</span>
            </button>
          ))}
          
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200">
                <Menu className="w-5 h-5" />
                <span className="text-[10px] font-medium">Menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-3 gap-3 py-6">
                <Button
                  variant="outline"
                  className="flex flex-col h-20 gap-2"
                  onClick={() => {
                    onRefresh();
                    setSheetOpen(false);
                  }}
                >
                  <RefreshCw className="w-5 h-5" />
                  <span className="text-xs">Atualizar</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="flex flex-col h-20 gap-2"
                  onClick={() => {
                    onImport();
                    setSheetOpen(false);
                  }}
                >
                  <Upload className="w-5 h-5 text-stat-green" />
                  <span className="text-xs">Importar</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="flex flex-col h-20 gap-2"
                  onClick={() => {
                    onExport();
                    setSheetOpen(false);
                  }}
                >
                  <Download className="w-5 h-5 text-stat-cyan" />
                  <span className="text-xs">Exportar</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="flex flex-col h-20 gap-2"
                  onClick={() => {
                    navigate('/settings');
                    setSheetOpen(false);
                  }}
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-xs">Configurações</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="flex flex-col h-20 gap-2"
                  onClick={() => {
                    toggleTheme();
                  }}
                >
                  {isDark ? (
                    <Sun className="w-5 h-5 text-stat-yellow" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                  <span className="text-xs">Tema</span>
                </Button>
                
                {isAdmin && (
                  <Button
                    variant="outline"
                    className="flex flex-col h-20 gap-2"
                    onClick={() => {
                      navigate('/admin');
                      setSheetOpen(false);
                    }}
                  >
                    <Shield className="w-5 h-5 text-stat-purple" />
                    <span className="text-xs">Admin</span>
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  className="flex flex-col h-20 gap-2 text-destructive hover:text-destructive"
                  onClick={() => {
                    onLogout();
                    setSheetOpen(false);
                  }}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-xs">Sair</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
