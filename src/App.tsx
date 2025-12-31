import React, { Component, useState } from "react"; // Add useState
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
// import Index from "./pages/Index"; // Removed Index import
import NotFound from "./pages/NotFound";
import { useFinance } from "./hooks/useFinance";
// import { DebugConsole } from "./components/DebugConsole"; // REMOVED DebugConsole import

// Layout components
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { AddTransactionModal } from '@/components/finance/AddTransactionModal';
import { cn } from '@/lib/utils'; // Import cn
import { Transaction } from '@/types/finance'; // Import Transaction type for onAdd prop

// Import all view components
import { DashboardView } from "./components/views/DashboardView";
import { TransactionsView } from "./components/views/TransactionsView";
import { ReportsView } from "./components/views/ReportsView";
import { AIAssistantView } from "./components/views/AIAssistantView";
import { DataManagementView } from "./components/views/DataManagementView";
import { FinanceContextType } from "./types/finance"; // Import FinanceContextType

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar
  const [isModalOpen, setIsModalOpen] = useState(false); // State for AddTransactionModal

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
  const financeContext: FinanceContextType = React.useMemo(() => ({
    transactions,
    summary,
    addTransaction,
    deleteTransaction,
    expensesByCategory,
    isLoading,
    clearAllFinanceData,
    exportFinanceData,
    importFinanceData,
  }), [transactions, summary, addTransaction, deleteTransaction, expensesByCategory, isLoading, clearAllFinanceData, exportFinanceData, importFinanceData]);

  console.log("MainLayout: financeContext before passing to Outlet:", financeContext); // Debug log

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleViewChange = () => { // Simplified to just close sidebar/mobile nav
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <Header
        onMenuToggle={handleMenuToggle}
        isMenuOpen={isSidebarOpen}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onViewChange={handleViewChange}
      />

      <main
        className={cn(
          'relative min-h-[calc(100vh-4rem)] pt-6 px-4 lg:px-8',
          'lg:ml-64 transition-all duration-300'
        )}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet context={financeContext} /> {/* Renders the matched child route component */}
        </div>
      </main>

      <MobileNav
        currentView={currentPath} // Pass currentPath for MobileNav
        onViewChange={handleViewChange} // Close mobile nav on click
        onAddClick={() => setIsModalOpen(true)}
      />

      <AddTransactionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addTransaction} // Pass addTransaction directly from MainLayout
      />
    </div>
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
