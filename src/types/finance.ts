export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  name: string; // Changed from description to name for consistency with current usage
  date: string;
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

export interface FinanceContextType {
  transactions: Transaction[];
  summary: FinanceSummary;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  expensesByCategory: { name: string; value: number }[];
  isLoading: boolean;
  clearAllFinanceData: () => Promise<void>;
  exportFinanceData: () => Promise<string | undefined>;
  importFinanceData: (jsonData: string) => Promise<void>;
}
