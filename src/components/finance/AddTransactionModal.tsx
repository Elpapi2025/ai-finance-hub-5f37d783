import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TransactionType, Transaction } from '@/types/finance';
import { expenseCategories, incomeCategories } from '@/data/categories';
import { cn } from '@/lib/utils';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

export function AddTransactionModal({ open, onClose, onAdd }: AddTransactionModalProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const categories = type === 'expense' ? expenseCategories : incomeCategories;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !description) return;

    onAdd({
      type,
      amount: parseFloat(amount),
      category,
      name: description,
      date: new Date().toISOString(),
    });

    setAmount('');
    setCategory('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Nueva Transacción</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Toggle */}
          <div className="flex gap-2 p-1 bg-secondary rounded-xl">
            <button
              type="button"
              onClick={() => { setType('expense'); setCategory(''); }}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all',
                type === 'expense'
                  ? 'bg-expense/20 text-expense'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <ArrowDownLeft className="w-4 h-4" />
              Gasto
            </button>
            <button
              type="button"
              onClick={() => { setType('income'); setCategory(''); }}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all',
                type === 'income'
                  ? 'bg-income/20 text-income'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <ArrowUpRight className="w-4 h-4" />
              Ingreso
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Monto</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 h-12 text-lg"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Categoría</Label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={cn(
                    'flex flex-col items-center gap-1 p-3 rounded-xl transition-all',
                    category === cat.name
                      ? 'bg-primary/20 ring-2 ring-primary'
                      : 'bg-secondary hover:bg-secondary/80'
                  )}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-xs text-muted-foreground truncate w-full text-center">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              placeholder="Ej: Compra en supermercado"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-12"
              required
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-12"
            variant={type === 'income' ? 'income' : 'expense'}
          >
            Añadir {type === 'income' ? 'Ingreso' : 'Gasto'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
