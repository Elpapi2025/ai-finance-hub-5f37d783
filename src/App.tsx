import React, { Component } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useFinance } from "./hooks/useFinance";
import { DebugConsole } from "./components/DebugConsole"; // Import DebugConsole

// Import all view components
import { DashboardView } from "./components/views/DashboardView";
import { TransactionsView } from "./components/views/TransactionsView";
import { ReportsView } from "./components/views/ReportsView";
import { AIAssistantView } from "./components/views/AIAssistantView";
import { DataManagementView } from "./components/views/DataManagementView";

const queryClient = new QueryClient();

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: 'salmon', color: 'white', fontFamily: 'monospace' }}>
          <h1>Something went wrong.</h1>
          <p>{this.state.error?.toString()}</p>
          <p>Check console for more details.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

const MainLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  // Get all necessary finance data here
  const {
    transactions,
    summary,
    addTransaction,
    deleteTransaction,
    expensesByCategory,
    isLoading,
    clearAllFinanceData,
    exportFinanceData,
    importFinanceData,
  } = useFinance();

  // Create a context object to pass finance data down to nested routes
  const financeContext = {
    transactions,
    summary,
    addTransaction,
    deleteTransaction,
    expensesByCategory,
    isLoading,
    clearAllFinanceData,
    exportFinanceData,
    importFinanceData,
  };

  console.log("MainLayout: financeContext before passing to Outlet:", financeContext); // Debug log

  return (
    <Index currentPath={currentPath} onAddTransaction={addTransaction}> {/* Pass addTransaction to Index again */}
      {/* Use Outlet context to pass finance data to nested route elements */}
      <Outlet context={financeContext} />
    </Index>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<DashboardView />} />
              <Route path="transactions" element={<TransactionsView />} />
              <Route path="reports" element={<ReportsView />} />
              <Route path="goals" element={
                <div className="glass rounded-2xl p-8 text-center">
                  <h2 className="text-2xl font-bold mb-2">Metas Financieras</h2>
                  <p className="text-muted-foreground">Próximamente: Establece y rastrea tus metas de ahorro</p>
                </div>
              } />
              <Route path="ai" element={<AIAssistantView />} />
              <Route path="data-management" element={<DataManagementView />} />
              <Route path="settings" element={
                <div className="glass rounded-2xl p-8 text-center">
                  <h2 className="text-2xl font-bold mb-2">Ajustes</h2>
                  <p className="text-muted-foreground">Próximamente: Personaliza tu experiencia</p>
                </div>
              } />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
      <DebugConsole /> {/* Integrate DebugConsole here */}
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
