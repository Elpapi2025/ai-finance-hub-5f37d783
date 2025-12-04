export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}
