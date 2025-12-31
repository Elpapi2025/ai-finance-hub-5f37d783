import { NavLink } from 'react-router-dom'; // Import NavLink
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ArrowUpDown,
  PieChart,
  Plus,
  Sparkles,
  Target, // Add Target for Goals
  Database, // Add Database for Data Management
  Settings // Add Settings for Settings
} from 'lucide-react';

interface MobileNavProps {
  currentView: string; // This will now be the current URL path
  onViewChange: () => void; // Used to close the mobile nav
  onAddClick: () => void;
}

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Inicio', path: '/' },
  { id: 'transactions', icon: ArrowUpDown, label: 'Movimientos', path: '/transactions' },
  { id: 'reports', icon: PieChart, label: 'Reportes', path: '/reports' },
  { id: 'goals', icon: Target, label: 'Metas', path: '/goals' }, // Add Goals
  { id: 'ai', icon: Sparkles, label: 'IA', path: '/ai' },
  { id: 'data-management', icon: Database, label: 'Datos', path: '/data-management' }, // Add Data Management
  { id: 'settings', icon: Settings, label: 'Ajustes', path: '/settings' }, // Add Settings
];

export function MobileNav({ currentView, onViewChange, onAddClick }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden glass border-t border-border/50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          if (item.id === 'add') { // Special case for the Add button
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
            <NavLink
              key={item.id}
              to={item.path}
              onClick={onViewChange} // Close mobile nav on click
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          );
        })}
        {/* Placeholder for the central Add button if it's not one of the navItems */}
        {navItems.some(item => item.id === 'add') ? null : (
          <button
            onClick={onAddClick}
            className="flex flex-col items-center justify-center -mt-6"
          >
            <div className="p-4 rounded-full bg-primary glow hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-primary-foreground" />
            </div>
          </button>
        )}
      </div>
    </nav>
  );
}
