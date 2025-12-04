import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ArrowUpDown,
  PieChart,
  Target,
  Settings,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  currentView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transacciones', icon: ArrowUpDown },
  { id: 'reports', label: 'Reportes', icon: PieChart },
  { id: 'goals', label: 'Metas', icon: Target },
  { id: 'ai', label: 'Asistente IA', icon: Sparkles },
  { id: 'settings', label: 'Ajustes', icon: Settings },
];

export function Sidebar({ isOpen, currentView, onViewChange }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => onViewChange(currentView)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-sidebar border-r border-sidebar-border z-40',
          'transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive && 'text-sidebar-primary')} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary" />
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
