import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Transaction, FinanceSummary } from '@/types/finance';
import { 
  initializeDatabase, 
  addTransaction as sqliteAddTransaction, 
  getTransactions as sqliteGetTransactions, 
  deleteTransaction as sqliteDeleteTransaction,
  clearAllTransactions as sqliteClearAllTransactions,
  exportTransactionsToJson as sqliteExportTransactionsToJson,
  importTransactionsFromJson as sqliteImportTransactionsFromJson
} from '@/services/sqliteService';
import * as supabaseApi from '@/services/supabaseApi';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useFinance() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuthContext();
  const prevUser = useRef(user);

  const syncAndFetchData = useCallback(async () => {
    if (authLoading) return; // Wait until auth state is confirmed

    const justLoggedIn = !prevUser.current && user;

    try {
      setIsLoading(true);
      let data: Transaction[] = [];

      // If the user just logged in, sync local data first
      if (justLoggedIn) {
        toast.info('Sincronizando datos locales...');
        const localTransactions = await sqliteGetTransactions();
        
        if (localTransactions && localTransactions.length > 0) {
          // Omit 'id' from local transactions as Supabase will generate new ones
          const transactionsToUpload = localTransactions.map(({ id, ...rest }) => rest);
          await supabaseApi.addTransactions(transactionsToUpload);
          await sqliteClearAllTransactions(); // Clear local data after successful sync
          toast.success('¡Datos locales sincronizados con la nube!');
        }
      }

      // Now, fetch the source of truth based on auth state
      if (user) {
        data = await supabaseApi.getTransactions();
      } else {
        await initializeDatabase();
        data = await sqliteGetTransactions();
      }
      setTransactions(data);

    } catch (error) {
      console.error('Error during sync or fetch:', error);
      toast.error(`Error al cargar datos: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    syncAndFetchData();
    // Update the previous user state after the effect runs
    prevUser.current = user;
  }, [syncAndFetchData]);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      if (user) {
        // Supabase handles ID generation and returns the new transaction
        const newTransaction = await supabaseApi.addTransaction(transaction);
        setTransactions(prev => [newTransaction, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } else {
        const newSqliteTransaction = { ...transaction, id: crypto.randomUUID() };
        await sqliteAddTransaction(newSqliteTransaction);
        setTransactions(prev => [newSqliteTransaction, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
      toast.success('Transacción agregada');
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Error al agregar transacción');
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      // Optimistic deletion from UI
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      if (user) {
        await supabaseApi.deleteTransaction(id);
      } else {
        await sqliteDeleteTransaction(id);
      }
      toast.success('Transacción eliminada');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      // Revert optimistic deletion on error
      fetchTransactions(); 
      toast.error('Error al eliminar transacción');
    }
  };
  
  const clearAllFinanceData = useCallback(async () => {
    if (user) {
      toast.info('Esta función no está disponible para usuarios autenticados.');
      return;
    }
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
  }, [user]);

  const exportFinanceData = useCallback(async (): Promise<string | undefined> => {
    if (user) {
      toast.info('Esta función no está disponible para usuarios autenticados.');
      return;
    }
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
  }, [user]);

  const importFinanceData = useCallback(async (jsonData: string) => {
    if (user) {
      toast.info('Esta función no está disponible para usuarios autenticados.');
      return;
    }
    try {
      setIsLoading(true);
      await sqliteImportTransactionsFromJson(jsonData);
      await syncAndFetchData(); // Refresh UI after import
      toast.success('Datos importados exitosamente.');
    } catch (error) {
      console.error('Error importing finance data:', error);
      toast.error('Error al importar datos financieros.');
    } finally {
      setIsLoading(false);
    }
  }, [user, syncAndFetchData]);

  const summary = useMemo<FinanceSummary>(() => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    return { totalIncome, totalExpenses, balance, savingsRate };
  }, [transactions]);

  const expensesByCategory = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  return {
    transactions,
    summary,
    addTransaction,
    deleteTransaction,
    expensesByCategory,
    isLoading: isLoading || authLoading,
    refetch: syncAndFetchData,
    clearAllFinanceData,
    exportFinanceData,
    importFinanceData,
  };
}

