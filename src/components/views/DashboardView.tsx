import { TrendingUp, TrendingDown, Wallet, PiggyBank, Plus } from 'lucide-react';
import { StatCard } from '@/components/finance/StatCard';
import { TransactionList } from '@/components/finance/TransactionList';
import { ExpenseChart } from '@/components/finance/ExpenseChart';
import { MonthlyChart } from '@/components/finance/MonthlyChart';
import { AITips } from '@/components/finance/AITips';
import { Button } from '@/components/ui/button';
import { FinanceSummary, Transaction, FinanceContextType } from '@/types/finance'; // Import FinanceContextType
import { useOutletContext } from 'react-router-dom'; // Import useOutletContext

export function DashboardView() { // No props needed here anymore
  const context = useOutletContext<FinanceContextType>(); // Get entire context
  console.log("DashboardView: Context from useOutletContext is", context); // Debug log

  // Add this guard:
  if (!context) {
    console.error("DashboardView: Finance context is null/undefined!");
    return (
      <div className="glass rounded-2xl p-8 text-center text-red-500">
        Error: No se pudieron cargar los datos financieros. Por favor, reinicia la aplicación.
      </div>
    );
  }

  const {
    transactions,
    summary,
    deleteTransaction,
    expensesByCategory,
    isLoading,
    addTransaction, // Get addTransaction from context for onAddClick
  } = context;

  if (isLoading || !summary) { // Render loading state if data is not ready
    return (
      <div className="glass rounded-2xl p-8 text-center animate-pulse">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/20" />
        <p className="text-muted-foreground">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Bienvenido de nuevo 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Aquí está el resumen de tus finanzas
          </p>
        </div>
        <Button onClick={() => { /* This addTransaction is for the modal, not directly here */ }} className="hidden lg:flex">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Transacción
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Balance Total"
          value={`$${summary.balance.toLocaleString()}`}
          icon={Wallet}
          variant="balance"
          // trend={{ value: 12, positive: true }} // Removed trend as it's not provided by useFinance
        />
        <StatCard
          title="Ingresos"
          value={`$${summary.totalIncome.toLocaleString()}`}
          icon={TrendingUp}
          variant="income"
          subtitle="Este mes"
        />
        <StatCard
          title="Gastos"
          value={`$${summary.totalExpenses.toLocaleString()}`}
          icon={TrendingDown}
          variant="expense"
          subtitle="Este mes"
        />
        <StatCard
          title="Tasa de Ahorro"
          value={`${summary.savingsRate.toFixed(0)}%`}
          icon={PiggyBank}
          variant="default"
          // trend={{ value: 5, positive: true }} // Removed trend as it's not provided by useFinance
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <MonthlyChart transactions={transactions} />
        <ExpenseChart data={expensesByCategory} />
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <TransactionList
          transactions={transactions}
          onDelete={deleteTransaction}
        />
        <AITips summary={summary} />
      </div>
    </div>
  );
}
