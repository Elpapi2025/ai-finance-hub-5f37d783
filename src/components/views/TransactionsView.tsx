import { useState } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types/finance';
import { cn } from '@/lib/utils';
import { allCategories } from '@/data/categories';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TransactionsViewProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function TransactionsView({ transactions, onDelete }: TransactionsViewProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = transactions
    .filter((t) => {
      if (filter !== 'all' && t.type !== filter) return false;
      if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const getCategoryIcon = (categoryName: string) => {
    const category = allCategories.find((c) => c.name === categoryName);
    return category?.icon || '📦';
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Transacciones</h1>
        <p className="text-muted-foreground mt-1">
          Historial completo de tus movimientos
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar transacciones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todos
          </Button>
          <Button
            variant={filter === 'income' ? 'income' : 'outline'}
            size="sm"
            onClick={() => setFilter('income')}
          >
            Ingresos
          </Button>
          <Button
            variant={filter === 'expense' ? 'expense' : 'outline'}
            size="sm"
            onClick={() => setFilter('expense')}
          >
            Gastos
          </Button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="glass rounded-2xl divide-y divide-border/50">
        {filteredTransactions.map((transaction, index) => (
          <div
            key={transaction.id}
            className={cn(
              'flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors',
              'animate-fade-in'
            )}
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className="text-2xl p-2 bg-secondary rounded-xl">
                {getCategoryIcon(transaction.category)}
              </div>
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.category} •{' '}
                  {format(transaction.date, "d 'de' MMMM, yyyy", { locale: es })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span
                className={cn(
                  'font-semibold text-lg',
                  transaction.type === 'income' ? 'text-income' : 'text-expense'
                )}
              >
                {transaction.type === 'income' ? '+' : '-'}$
                {transaction.amount.toLocaleString()}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-expense"
                onClick={() => onDelete(transaction.id)}
              >
                Eliminar
              </Button>
            </div>
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <ArrowUpDown className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No se encontraron transacciones</p>
          </div>
        )}
      </div>
    </div>
  );
}
