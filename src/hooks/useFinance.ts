import { useState, useMemo, useEffect, useCallback } from 'react';
import { Transaction, FinanceSummary } from '@/types/finance';
import { Capacitor } from '@capacitor/core';
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

const isNative = Capacitor.isNativePlatform();

export function useFinance() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuthContext();

  const fetchTransactions = useCallback(async () => {
    if (authLoading) return; // Wait until auth state is confirmed
    
    try {
      setIsLoading(true);
      let data: Transaction[];
      if (user) {
        // User is logged in, use Supabase
        data = await supabaseApi.getTransactions();
      } else {
        // User is logged out, use platform-specific storage
        if (isNative) {
          await initializeDatabase();
          data = await sqliteGetTransactions();
        } else {
          // On web, for logged-out users, we don't have a local DB.
          // You could use localStorage here, but for now, we default to empty.
          data = [];
          console.log("Running on web, local storage is disabled for guests.");
        }
      }
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Error al cargar transacciones');
    } finally {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      if (user) {
        const newTransaction = await supabaseApi.addTransaction(transaction);
        setTransactions(prev => [newTransaction, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        toast.success('Transacción agregada a la nube');
      } else if (isNative) {
        const newSqliteTransaction = { ...transaction, id: crypto.randomUUID() };
        await sqliteAddTransaction(newSqliteTransaction);
        setTransactions(prev => [newSqliteTransaction, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        toast.success('Transacción agregada localmente');
      } else {
        toast.info('Inicia sesión para guardar transacciones.');
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Error al agregar transacción');
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      if (user) {
        await supabaseApi.deleteTransaction(id);
      } else if (isNative) {
        await sqliteDeleteTransaction(id);
      } else {
        // No action needed for web guests as there's no local data to delete
      }
      toast.success('Transacción eliminada');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      fetchTransactions(); 
      toast.error('Error al eliminar transacción');
    }
  };
  
  const showInfoToast = () => toast.info('Esta función solo está disponible en la app móvil para usuarios no registrados.');

  const clearAllFinanceData = useCallback(async () => {
    if (user || !isNative) {
      showInfoToast();
      return;
    }
    // ... (rest of the function for native)
  }, [user]);

  const exportFinanceData = useCallback(async (): Promise<string | undefined> => {
    if (user || !isNative) {
      showInfoToast();
      return;
    }
    // ... (rest of the function for native)
  }, [user]);

  const importFinanceData = useCallback(async (jsonData: string) => {
    if (user || !isNative) {
      showInfoToast();
      return;
    }
    // ... (rest of the function for native)
  }, [user, fetchTransactions]);

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
    refetch: fetchTransactions,
    clearAllFinanceData,
    exportFinanceData,
    importFinanceData,
  };
}

