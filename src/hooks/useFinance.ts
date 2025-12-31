import { useState, useMemo, useEffect, useCallback } from 'react';
import { Transaction, FinanceSummary } from '@/types/finance';
import { initializeDatabase, addTransaction as sqliteAddTransaction, getTransactions as sqliteGetTransactions, deleteTransaction as sqliteDeleteTransaction, clearAllTransactions as sqliteClearAllTransactions, exportTransactionsToJson as sqliteExportTransactionsToJson, importTransactionsFromJson as sqliteImportTransactionsFromJson } from '@/services/sqliteService';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export function useFinance() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      await initializeDatabase(); // Initialize DB
      const data = await sqliteGetTransactions(); // Use sqlite service
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Error al cargar transacciones');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearAllFinanceData = useCallback(async () => {
    try {
      setIsLoading(true);
      await sqliteClearAllTransactions();
      setTransactions([]); // Clear local state immediately
      toast.success('Todos los datos financieros han sido borrados.');
    } catch (error) {
      console.error('Error clearing all finance data:', error);
      toast.error('Error al borrar todos los datos financieros.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const exportFinanceData = useCallback(async (): Promise<string | undefined> => {
    try {
      setIsLoading(true);
      const jsonData = await sqliteExportTransactionsToJson();
      toast.success('Datos exportados exitosamente.');
      return jsonData;
    } catch (error) {
      console.error('Error exporting finance data:', error);
      toast.error('Error al exportar datos financieros.');
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const importFinanceData = useCallback(async (jsonData: string) => {
    try {
      setIsLoading(true);
      await sqliteImportTransactionsFromJson(jsonData);
      await fetchTransactions(); // Refresh UI after import
      toast.success('Datos importados exitosamente.');
    } catch (error) {
      console.error('Error importing finance data:', error);
      toast.error('Error al importar datos financieros.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const summary = useMemo<FinanceSummary>(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpenses,
      balance,
      savingsRate,
    };
  }, [transactions]);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction: Transaction = {
        ...transaction,
        id: uuidv4(), // Generate a UUID for the id
      };
      await sqliteAddTransaction(newTransaction);
      setTransactions(prev => [newTransaction, ...prev]);
      toast.success('Transacción agregada');
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Error al agregar transacción');
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await sqliteDeleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast.success('Transacción eliminada');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Error al eliminar transacción');
    }
  };

  const expensesByCategory = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
    }));
  }, [transactions]);

  return {
    transactions,
    summary,
    addTransaction,
    deleteTransaction,
    expensesByCategory,
    isLoading,
    refetch: fetchTransactions,
    clearAllFinanceData,
    exportFinanceData,
    importFinanceData,
  };
}
