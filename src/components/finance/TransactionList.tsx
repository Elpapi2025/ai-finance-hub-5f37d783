import { Transaction } from '@/types/finance';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { allCategories } from '@/data/categories';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const getCategoryIcon = (categoryName: string) => {
    const category = allCategories.find(c => c.name === categoryName);
    return category?.icon || '📦';
  };

  return (
    <div className="glass rounded-2xl p-6 animate-slide-up">
      <h3 className="text-lg font-semibold mb-4">Transacciones Recientes</h3>
      
      <div className="space-y-3">
        {transactions.slice(0, 6).map((transaction, index) => (
          <div
            key={transaction.id}
            className={cn(
              'flex items-center justify-between p-4 rounded-xl bg-secondary/50',
              'hover:bg-secondary transition-colors duration-200',
              'animate-fade-in'
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className="text-2xl">
                {getCategoryIcon(transaction.category)}
              </div>
              <div>
                <p className="font-medium text-sm">{transaction.name}</p>
                <p className="text-xs text-muted-foreground">
                  {transaction.category} • {format(transaction.date, "d MMM", { locale: es })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'font-semibold',
                  transaction.type === 'income' ? 'text-income' : 'text-expense'
                )}
              >
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-expense"
                onClick={() => onDelete(transaction.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        {transactions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No hay transacciones aún</p>
            <p className="text-sm">Añade tu primer ingreso o gasto</p>
          </div>
        )}
      </div>
    </div>
  );
}
