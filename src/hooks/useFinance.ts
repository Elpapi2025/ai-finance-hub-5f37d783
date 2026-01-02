import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  Transaction,
  FinanceSummary,
  FinanceContextType,
} from "@/types/finance";
import {
  initializeDatabase,
  addTransaction as sqliteAddTransaction,
  getTransactions as sqliteGetTransactions,
  deleteTransaction as sqliteDeleteTransaction,
  clearAllTransactions as sqliteClearAllTransactions,
  exportTransactionsToJson as sqliteExportTransactionsToJson,
  importTransactionsFromJson as sqliteImportTransactionsFromJson,
} from "@/services/sqliteService";
import * as supabaseApi from "@/services/supabaseApi";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useFinance() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuthContext();
  const prevUser = useRef(user);

  // Function to load data from SQLite and update state
  const loadTransactionsFromSqlite = useCallback(async () => {
    setIsLoading(true);
    await initializeDatabase(); // Ensure DB is initialized
    const data = await sqliteGetTransactions();
    setTransactions(data);
    setIsLoading(false);
  }, []);

  // --- Explicit Sync Functions (manual user trigger) ---

  const syncToCloud = useCallback(async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para sincronizar con la nube.");
      return;
    }
    setIsLoading(true);
    try {
      const localTransactions = await sqliteGetTransactions();

      // Clear all user's cloud transactions first to ensure local is the source of truth for backup
      await supabaseApi.clearUserTransactions();

      if (localTransactions && localTransactions.length > 0) {
        // Supabase expects ISO strings for dates
        const transactionsToUpload = localTransactions.map(
          ({ id, ...rest }) => ({
            ...rest,
            date: new Date(rest.date).toISOString(),
          })
        );
        await supabaseApi.addTransactions(transactionsToUpload);
        toast.success("¡Copia de seguridad en la nube actualizada!");
      } else {
        toast.info("No hay datos locales para sincronizar con la nube.");
      }
    } catch (error) {
      console.error("Error al sincronizar datos con la nube:", error);
      toast.error("Error al subir copia de seguridad a la nube.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const downloadBackupFromCloud = useCallback(async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para descargar de la nube.");
      return;
    }
    setIsLoading(true);
    try {
      const cloudTransactions = await supabaseApi.getTransactions();
      await sqliteClearAllTransactions(); // Clear local data before restoring
      if (cloudTransactions && cloudTransactions.length > 0) {
        for (const tx of cloudTransactions) {
          // Add to SQLite, potentially generating new local IDs.
          await sqliteAddTransaction({ ...tx, id: crypto.randomUUID() });
        }
        toast.success(
          "¡Copia de seguridad descargada y restaurada localmente!"
        );
      } else {
        toast.info("No hay copia de seguridad en la nube para descargar.");
      }
      await loadTransactionsFromSqlite(); // Refresh UI from local
    } catch (error) {
      console.error("Error al descargar copia de seguridad de la nube:", error);
      toast.error("Error al descargar copia de seguridad.");
    } finally {
      setIsLoading(false);
    }
  }, [user, loadTransactionsFromSqlite]);

  // --- Central Sync/Fetch Logic (on user state change) ---
  const handleUserAuthStateChange = useCallback(async () => {
    if (authLoading) {
      console.log("handleUserAuthStateChange: authLoading es true, regresando.");
      return;
    }

    console.log("handleUserAuthStateChange: Iniciando. Usuario actual:", user?.email, "Usuario previo:", prevUser.current?.email);
    const justLoggedIn = !prevUser.current && user;
    const justLoggedOut = prevUser.current && !user;

    try {
      setIsLoading(true);

      // Handle Online to Offline sync (on logout)
      if (justLoggedOut && prevUser.current) {
        console.log("handleUserAuthStateChange: Detectado cierre de sesión.");
        toast.info(
          "Detectado cierre de sesión. Descargando datos de la nube para uso offline..."
        );
        const cloudTransactions = await supabaseApi.getTransactions();
        console.log("handleUserAuthStateChange: Transacciones de la nube al cerrar sesión:", cloudTransactions?.length || 0);

        if (cloudTransactions && cloudTransactions.length > 0) {
          await sqliteClearAllTransactions();
          console.log("handleUserAuthStateChange: Datos locales limpiados antes de guardar offline.");
          for (const tx of cloudTransactions) {
            await sqliteAddTransaction({ ...tx, id: crypto.randomUUID() });
          }
          console.log("handleUserAuthStateChange: Datos de la nube guardados localmente para uso offline.");
          toast.success(
            "¡Datos de la nube guardados localmente para uso offline!"
          );
        } else {
          await sqliteClearAllTransactions();
          console.log("handleUserAuthStateChange: No hay transacciones en la nube, datos locales limpiados.");
          toast.info(
            "No hay transacciones en la nube para guardar localmente al cerrar sesión."
          );
        }
      }

      // Handle Offline to Online sync (on login)
      if (justLoggedIn) {
        console.log("handleUserAuthStateChange: Detectado inicio de sesión.");
        toast.info("Detectado inicio de sesión. Verificando datos locales...");
        const localTransactions = await sqliteGetTransactions();
        console.log("handleUserAuthStateChange: Transacciones locales al iniciar sesión:", localTransactions?.length || 0);

        if (localTransactions && localTransactions.length > 0) {
          console.log("handleUserAuthStateChange: Datos locales encontrados.");
          toast.info(
            "Datos locales encontrados. Subiéndolos a la nube como copia de seguridad..."
          );
          await supabaseApi.clearUserTransactions();
          console.log("handleUserAuthStateChange: Transacciones de la nube limpiadas antes de subir datos locales.");
          const transactionsToUpload = localTransactions.map(
            ({ id, ...rest }) => ({
              ...rest,
              date: new Date(rest.date).toISOString(),
            })
          );
          await supabaseApi.addTransactions(transactionsToUpload);
          console.log("handleUserAuthStateChange: Datos locales subidos a la nube.");
          toast.success("¡Datos locales subidos a la nube!");
        } else {
          console.log("handleUserAuthStateChange: No hay datos locales.");
          toast.info(
            "No hay datos locales. Buscando copia de seguridad en la nube..."
          );
          await downloadBackupFromCloud();
          console.log("handleUserAuthStateChange: downloadBackupFromCloud() ejecutado.");
        }
      }

      // Finally, always load from SQLite
      await loadTransactionsFromSqlite();
      console.log("handleUserAuthStateChange: Datos cargados desde SQLite para actualizar la UI.");
    } catch (error) {
      console.error("Error en la gestión de estado de autenticación:", error);
      toast.error(
        `Error al procesar la sincronización: ${(error as Error).message}`
      );
    } finally {
      setIsLoading(false);
      console.log("handleUserAuthStateChange: Finalizado. isLoading ajustado a false.");
    }
  }, [user, authLoading, loadTransactionsFromSqlite, downloadBackupFromCloud, prevUser]);

  useEffect(() => {
    handleUserAuthStateChange();
    prevUser.current = user;
  }, [handleUserAuthStateChange, user]);

  // --- Data Modification Functions (Always Local-First) ---

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    setIsLoading(true);
    try {
      await initializeDatabase();
      const newSqliteTransaction = { ...transaction, id: crypto.randomUUID() };
      await sqliteAddTransaction(newSqliteTransaction);
      await loadTransactionsFromSqlite();
      toast.success("Transacción agregada localmente.");
      if (user) {
        toast.info("Transacción agregada. Sincronizando con la nube...");
        await syncToCloud();
      }
    } catch (error) {
      console.error("Error al agregar transacción:", error);
      toast.error("Error al agregar transacción.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTransaction = useCallback(
    async (id: string) => {
      setIsLoading(true);
      try {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        await initializeDatabase();
        await sqliteDeleteTransaction(id);
        toast.success("Transacción eliminada localmente.");
        if (user) {
          toast.info("Transacción eliminada. Sincronizando con la nube...");
          await syncToCloud();
        }
      } catch (error) {
        console.error("Error al eliminar transacción:", error);
        await loadTransactionsFromSqlite(); // Revert UI
        toast.error("Error al eliminar transacción.");
      } finally {
        setIsLoading(false);
      }
    },
    [loadTransactionsFromSqlite, user, syncToCloud]
  );

  const clearAllFinanceData = useCallback(async () => {
    setIsLoading(true);
    try {
      await initializeDatabase();
      await sqliteClearAllTransactions();
      setTransactions([]);
      toast.success("Todos los datos financieros locales han sido borrados.");
    } catch (error) {
      console.error("Error al borrar datos:", error);
      toast.error("Error al borrar todos los datos financieros.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const exportFinanceData = useCallback(async (): Promise<
    string | undefined
  > => {
    setIsLoading(true);
    try {
      await initializeDatabase();
      const jsonData = await sqliteExportTransactionsToJson();
      toast.success("Datos exportados exitosamente.");
      return jsonData;
    } catch (error) {
      console.error("Error al exportar datos:", error);
      toast.error("Error al exportar datos financieros.");
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const importFinanceData = useCallback(
    async (jsonData: string) => {
      setIsLoading(true);
      try {
        await initializeDatabase();
        await sqliteImportTransactionsFromJson(jsonData);
        await loadTransactionsFromSqlite();
        toast.success("Datos importados exitosamente.");
      } catch (error) {
        console.error("Error al importar datos:", error);
        toast.error("Error al importar datos financieros.");
      } finally {
        setIsLoading(false);
      }
    },
    [loadTransactionsFromSqlite]
  );

  const summary = useMemo<FinanceSummary>(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpenses;

    // Calculate savingsRate, handling division by zero
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpenses,
      balance,
      savingsRate,
    };
  }, [transactions]);

  return {
    transactions,
    isLoading,
    summary,
    addTransaction,
    deleteTransaction,
    clearAllFinanceData,
    exportFinanceData,
    importFinanceData,
    syncToCloud,
    downloadBackupFromCloud,
  };
}
