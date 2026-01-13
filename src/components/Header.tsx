import { RefreshCw, Upload, Download, UserPlus, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface HeaderProps {
  onImport: () => void;
  onExport: () => void;
  onNewClient: () => void;
  onRefresh: () => void;
}

export function Header({ onImport, onExport, onNewClient, onRefresh }: HeaderProps) {
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

  return (
    <header className="flex items-center justify-between py-4 px-6 bg-card border-b">
      <h1 className="text-xl font-bold text-foreground">CRM Grupos VIP</h1>
      
      <div className="flex items-center gap-3">
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
        
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>
    </header>
  );
}
