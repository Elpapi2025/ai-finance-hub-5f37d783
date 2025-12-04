import { MonthlyChart } from '@/components/finance/MonthlyChart';
import { ExpenseChart } from '@/components/finance/ExpenseChart';
import { FinanceSummary } from '@/types/finance';
import { TrendingUp, TrendingDown, Target, Calendar } from 'lucide-react';

interface ReportsViewProps {
  summary: FinanceSummary;
  expensesByCategory: { name: string; value: number }[];
}

export function ReportsView({ summary, expensesByCategory }: ReportsViewProps) {
  const insights = [
    {
      icon: TrendingUp,
      title: 'Mayor Ingreso',
      value: 'Salario',
      detail: '$3,500 este mes',
      color: 'text-income',
    },
    {
      icon: TrendingDown,
      title: 'Mayor Gasto',
      value: 'Alimentación',
      detail: '$150 este mes',
      color: 'text-expense',
    },
    {
      icon: Target,
      title: 'Meta de Ahorro',
      value: `${summary.savingsRate.toFixed(0)}%`,
      detail: 'del objetivo del 20%',
      color: 'text-primary',
    },
    {
      icon: Calendar,
      title: 'Promedio Diario',
      value: `$${Math.round(summary.totalExpenses / 30)}`,
      detail: 'en gastos',
      color: 'text-warning',
    },
  ];

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Reportes</h1>
        <p className="text-muted-foreground mt-1">
          Análisis detallado de tus finanzas
        </p>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div
              key={index}
              className="glass rounded-2xl p-4 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Icon className={`w-5 h-5 ${insight.color} mb-2`} />
              <p className="text-xs text-muted-foreground">{insight.title}</p>
              <p className={`text-xl font-bold ${insight.color}`}>{insight.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{insight.detail}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <MonthlyChart />
        <ExpenseChart data={expensesByCategory} />
      </div>

      {/* Summary Card */}
      <div className="glass rounded-2xl p-6 animate-slide-up">
        <h3 className="text-lg font-semibold mb-4">Resumen del Período</h3>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-income/10 rounded-xl">
            <p className="text-sm text-muted-foreground">Total Ingresos</p>
            <p className="text-2xl font-bold text-income">
              ${summary.totalIncome.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-4 bg-expense/10 rounded-xl">
            <p className="text-sm text-muted-foreground">Total Gastos</p>
            <p className="text-2xl font-bold text-expense">
              ${summary.totalExpenses.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-4 bg-primary/10 rounded-xl">
            <p className="text-sm text-muted-foreground">Ahorro Neto</p>
            <p className="text-2xl font-bold text-primary">
              ${(summary.totalIncome - summary.totalExpenses).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
