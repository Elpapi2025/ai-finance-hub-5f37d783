import { TrendingUp, TrendingDown, Wallet, PiggyBank, Plus } from 'lucide-react';
import { StatCard } from '@/components/finance/StatCard';
import { TransactionList } from '@/components/finance/TransactionList';
import { ExpenseChart } from '@/components/finance/ExpenseChart';
import { MonthlyChart } from '@/components/finance/MonthlyChart';
import { AITips } from '@/components/finance/AITips';
import { Button } from '@/components/ui/button';
import { FinanceSummary, Transaction } from '@/types/finance';

interface DashboardViewProps {
  summary: FinanceSummary;
  transactions: Transaction[];
  expensesByCategory: { name: string; value: number }[];
  onDeleteTransaction: (id: string) => void;
  onAddClick: () => void;
}

export function DashboardView({
  summary,
  transactions,
  expensesByCategory,
  onDeleteTransaction,
  onAddClick,
}: DashboardViewProps) {
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
        <Button onClick={onAddClick} className="hidden lg:flex">
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
          trend={{ value: 12, positive: true }}
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
          trend={{ value: 5, positive: true }}
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
          onDelete={onDeleteTransaction}
        />
        <AITips summary={summary} />
      </div>
    </div>
  );
}
