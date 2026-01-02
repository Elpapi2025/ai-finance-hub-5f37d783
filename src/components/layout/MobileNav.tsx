import { NavLink } from '@/components/NavLink'; // Import NavLink
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Plus,
  Sparkles,
} from 'lucide-react';

interface MobileNavProps {
  currentView: string; // This will now be the current URL path
  onViewChange: () => void; // Used to close the mobile nav
  onAddClick: () => void;
}

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Inicio', path: '/' },
  { id: 'ai', icon: Sparkles, label: 'IA', path: '/ai' },
];

export function MobileNav({ currentView, onViewChange, onAddClick }: MobileNavProps) {
  const renderNavLink = (item: typeof navItems[0]) => {
    const Icon = item.icon;
    return (
      <NavLink
        key={item.id}
        to={item.path}
        onClick={onViewChange}
        pendingClassName="opacity-75"
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors',
            isActive ? 'text-primary' : 'text-muted-foreground'
          )
        }
      >
        <Icon className="w-5 h-5" />
        <span className="text-xs font-medium truncate">{item.label}</span>
      </NavLink>
    );
  };

  const leftNavItems = navItems.slice(0, 1); // Only 'Inicio'
  const rightNavItems = navItems.slice(1);   // Only 'IA'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden glass border-t border-border/50">
      <div className="relative flex items-center justify-between h-16 px-2">
        {/* Grupo Izquierdo de elementos de navegación */}
        <div className="flex justify-evenly flex-1 min-w-0">
          {leftNavItems.map(renderNavLink)}
        </div>

        {/* Botón Central de Añadir */}
        <button
          onClick={onAddClick}
          className="absolute left-1/2 -translate-x-1/2 -mt-6 z-50" // Asegurar que esté por encima de todo
        >
          <div className="p-4 rounded-full bg-primary glow hover:scale-110 transition-transform">
            <Plus className="w-6 h-6 text-primary-foreground" />
          </div>
        </button>

        {/* Grupo Derecho de elementos de navegación */}
        <div className="flex justify-evenly flex-1 min-w-0">
          {rightNavItems.map(renderNavLink)}
        </div>
      </div>
    </nav>
  );
}
