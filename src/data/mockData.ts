import { Transaction, MonthlyData } from '@/types/finance';

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 3500,
    category: 'Salario',
    description: 'Salario mensual',
    date: new Date(2024, 11, 1),
    createdAt: new Date(2024, 11, 1),
  },
  {
    id: '2',
    type: 'expense',
    amount: 150,
    category: 'Alimentación',
    description: 'Supermercado semanal',
    date: new Date(2024, 11, 3),
    createdAt: new Date(2024, 11, 3),
  },
  {
    id: '3',
    type: 'expense',
    amount: 45,
    category: 'Transporte',
    description: 'Gasolina',
    date: new Date(2024, 11, 5),
    createdAt: new Date(2024, 11, 5),
  },
  {
    id: '4',
    type: 'income',
    amount: 500,
    category: 'Freelance',
    description: 'Proyecto web',
    date: new Date(2024, 11, 10),
    createdAt: new Date(2024, 11, 10),
  },
  {
    id: '5',
    type: 'expense',
    amount: 80,
    category: 'Servicios',
    description: 'Internet y teléfono',
    date: new Date(2024, 11, 15),
    createdAt: new Date(2024, 11, 15),
  },
  {
    id: '6',
    type: 'expense',
    amount: 35,
    category: 'Entretenimiento',
    description: 'Netflix y Spotify',
    date: new Date(2024, 11, 15),
    createdAt: new Date(2024, 11, 15),
  },
];

export const mockMonthlyData: MonthlyData[] = [
  { month: 'Jul', income: 3200, expenses: 2100 },
  { month: 'Ago', income: 3500, expenses: 2400 },
  { month: 'Sep', income: 3800, expenses: 2200 },
  { month: 'Oct', income: 4000, expenses: 2800 },
  { month: 'Nov', income: 3600, expenses: 2500 },
  { month: 'Dic', income: 4000, expenses: 1890 },
];
