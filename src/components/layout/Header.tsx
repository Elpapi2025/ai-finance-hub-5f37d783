
import { useNavigate } from 'react-router-dom';
import { useTransition } from 'react';
import { Menu, X, Wallet, Bell, LogOut, User as UserIcon, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthContext } from '@/contexts/AuthContext';
// import { useNavigate } from 'react-router-dom'; // This line is now redundant as it's moved up

// ... AuthNav component (it will use the top-level useNavigate from react-router-dom)

export function Header({}: HeaderProps) {
  const navigate = useNavigate();
  const [, startTransition] = useTransition();

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
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg gradient-text hidden sm:block">
              FinanceAI
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
          </Button>
          <AuthNav />
        </div>
      </div>
    </header>
  );
}
