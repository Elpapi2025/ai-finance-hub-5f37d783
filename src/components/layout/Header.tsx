import { useTransition } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // Import Avatar y AvatarFallback

interface HeaderProps {} // No props for Header function

const AuthNav = () => { // AuthNav definition starts here
  const { user, logout, loading } = useAuthContext();
  const navigate = useNavigate(); // AuthNav's own useNavigate
  const [, startTransition] = useTransition(); // AuthNav's own useTransition

  const handleLogout = async () => {
    await logout();
    startTransition(() => {
      navigate('/login');
    });
  };

  if (loading) {
    return <Skeleton className="h-9 w-9 rounded-full" />;
  }

  if (!user) {
    return (
      <Button variant="ghost" className="relative h-9 w-9 rounded-full" onClick={() => {
        startTransition(() => {
          navigate('/profile');
        });
      }}>
         <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-muted text-muted-foreground">
                <LucideIcons.User className="w-5 h-5" />
            </AvatarFallback>
         </Avatar>
      </Button>
    );
  }

  const userInitial = user.email ? user.email.charAt(0).toUpperCase() : <LucideIcons.User size={20} />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
            {userInitial}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Mi Cuenta</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => startTransition(() => navigate('/profile'))}>
          <LucideIcons.Settings className="mr-2 h-4 w-4" />
          <span>Ajustes</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LucideIcons.LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; // AuthNav definition ends here


export function Header({}: HeaderProps) {
  const navigate = useNavigate(); // Header's own useNavigate
  const [, startTransition] = useTransition(); // Header's own useTransition

  const handleGoToDashboard = () => {
    startTransition(() => {
      navigate('/dashboard');
    });
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleGoToDashboard}>
            <div className="p-2 rounded-xl bg-primary/20 glow">
              <LucideIcons.Wallet className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg gradient-text hidden sm:block">
              FinanceAI
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <LucideIcons.Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
          </Button>
          <AuthNav />
        </div>
      </div>
    </header>
  );
}