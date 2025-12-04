import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: 'default' | 'income' | 'expense' | 'balance';
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'glass rounded-2xl p-6 animate-slide-up',
        'hover:scale-[1.02] transition-transform duration-300',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            'p-3 rounded-xl',
            variant === 'income' && 'bg-income/20',
            variant === 'expense' && 'bg-expense/20',
            variant === 'balance' && 'bg-primary/20',
            variant === 'default' && 'bg-secondary'
          )}
        >
          <Icon
            className={cn(
              'w-5 h-5',
              variant === 'income' && 'text-income',
              variant === 'expense' && 'text-expense',
              variant === 'balance' && 'text-primary',
              variant === 'default' && 'text-muted-foreground'
            )}
          />
        </div>
        {trend && (
          <span
            className={cn(
              'text-xs font-medium px-2 py-1 rounded-full',
              trend.positive
                ? 'bg-income/20 text-income'
                : 'bg-expense/20 text-expense'
            )}
          >
            {trend.positive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      
      <p className="text-muted-foreground text-sm font-medium mb-1">{title}</p>
      <p
        className={cn(
          'text-2xl font-bold',
          variant === 'income' && 'text-income',
          variant === 'expense' && 'text-expense',
          variant === 'balance' && 'text-foreground'
        )}
      >
        {value}
      </p>
      {subtitle && (
        <p className="text-muted-foreground text-xs mt-1">{subtitle}</p>
      )}
    </div>
  );
}
