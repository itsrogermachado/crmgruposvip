import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Crown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const navLinks = [
  { label: 'Recursos', href: '#beneficios' },
  { label: 'Como Funciona', href: '#como-funciona' },
  { label: 'Depoimentos', href: '#depoimentos' },
  { label: 'Planos', href: '#planos' },
  { label: 'FAQ', href: '#faq' },
];

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id.replace('#', ''));
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300 group-hover:scale-105">
              <Crown className="w-4.5 h-4.5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight text-foreground tracking-tight">
                CRM Grupos VIP
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="px-3.5 py-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium rounded-lg hover:bg-muted/50"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" className="font-medium text-sm">
                Entrar
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="font-semibold text-sm bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all">
                Experimente Grátis
              </Button>
            </Link>
          </div>

          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="relative">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0">
              <SheetHeader className="p-6 pb-4 border-b border-border/50">
                <SheetTitle className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                    <Crown className="w-4 h-4 text-primary-foreground" />
                  </div>
                  CRM Grupos VIP
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col p-6 gap-1">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className="text-left text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all py-3 px-4 rounded-lg"
                  >
                    {link.label}
                  </button>
                ))}
                <hr className="my-4 border-border" />
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full font-semibold h-11">
                    Entrar
                  </Button>
                </Link>
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="mt-2">
                  <Button className="w-full font-semibold h-11 bg-primary hover:bg-primary/90">
                    Experimente Grátis
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
