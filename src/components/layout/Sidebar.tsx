import { NavLink } from '@/components/NavLink';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  onViewChange: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard, path: '/' },
  { id: 'ai', label: 'Asistente IA', icon: Sparkles, path: '/ai' },
];

export function Sidebar({ onViewChange }: SidebarProps) {
  return (
    <>
      <aside
        className={cn(
          'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-sidebar border-r border-sidebar-border z-30', // z-index reduced
          'transition-transform duration-300 ease-in-out',
          '-translate-x-full lg:translate-x-0' // Hidden on mobile, visible on desktop
        )}
      >
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.id}
                to={item.path}
                pendingClassName="opacity-75"
                className={({ isActive }) =>
                  cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-primary'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  )
                }
                onClick={onViewChange}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn('w-5 h-5', isActive && 'text-sidebar-primary')} />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
