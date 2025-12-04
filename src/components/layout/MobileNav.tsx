import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ArrowUpDown,
  PieChart,
  Plus,
  Sparkles,
} from 'lucide-react';

interface MobileNavProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onAddClick: () => void;
}

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Inicio' },
  { id: 'transactions', icon: ArrowUpDown, label: 'Movimientos' },
  { id: 'add', icon: Plus, label: 'Añadir', isAction: true },
  { id: 'reports', icon: PieChart, label: 'Reportes' },
  { id: 'ai', icon: Sparkles, label: 'IA' },
];

export function MobileNav({ currentView, onViewChange, onAddClick }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden glass border-t border-border/50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          if (item.isAction) {
            return (
              <button
                key={item.id}
                onClick={onAddClick}
                className="flex flex-col items-center justify-center -mt-6"
              >
                <div className="p-4 rounded-full bg-primary glow hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
              </button>
            );
          }
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                'flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
