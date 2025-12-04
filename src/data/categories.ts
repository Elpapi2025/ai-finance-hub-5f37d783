import { Category } from '@/types/finance';

export const expenseCategories: Category[] = [
  { id: '1', name: 'Alimentación', icon: '🍔', color: 'hsl(38 92% 50%)', type: 'expense' },
  { id: '2', name: 'Transporte', icon: '🚗', color: 'hsl(200 80% 50%)', type: 'expense' },
  { id: '3', name: 'Entretenimiento', icon: '🎬', color: 'hsl(280 70% 60%)', type: 'expense' },
  { id: '4', name: 'Servicios', icon: '💡', color: 'hsl(45 90% 50%)', type: 'expense' },
  { id: '5', name: 'Salud', icon: '💊', color: 'hsl(0 72% 51%)', type: 'expense' },
  { id: '6', name: 'Compras', icon: '🛒', color: 'hsl(320 70% 55%)', type: 'expense' },
  { id: '7', name: 'Educación', icon: '📚', color: 'hsl(180 60% 45%)', type: 'expense' },
  { id: '8', name: 'Otros', icon: '📦', color: 'hsl(220 14% 40%)', type: 'expense' },
];

export const incomeCategories: Category[] = [
  { id: '9', name: 'Salario', icon: '💰', color: 'hsl(160 84% 39%)', type: 'income' },
  { id: '10', name: 'Freelance', icon: '💻', color: 'hsl(170 70% 45%)', type: 'income' },
  { id: '11', name: 'Inversiones', icon: '📈', color: 'hsl(200 80% 50%)', type: 'income' },
  { id: '12', name: 'Ventas', icon: '🏷️', color: 'hsl(38 92% 50%)', type: 'income' },
  { id: '13', name: 'Otros', icon: '✨', color: 'hsl(280 70% 60%)', type: 'income' },
];

export const allCategories = [...expenseCategories, ...incomeCategories];
