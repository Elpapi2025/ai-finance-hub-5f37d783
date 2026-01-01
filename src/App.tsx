import React, { Component, useState, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { useFinance } from "./hooks/useFinance";

// Layout components
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { AddTransactionModal } from '@/components/finance/AddTransactionModal';
import { cn } from '@/lib/utils';
import { FinanceContextType } from "./types/finance";

const queryClient = new QueryClient();

// Lazy-loaded view components
const DashboardView = lazy(() => import("./components/views/DashboardView").then(module => ({ default: module.DashboardView })));
const TransactionsView = lazy(() => import("./components/views/TransactionsView").then(module => ({ default: module.TransactionsView })));
const ReportsView = lazy(() => import("./components/views/ReportsView").then(module => ({ default: module.ReportsView })));
const AIAssistantView = lazy(() => import("./components/views/AIAssistantView").then(module => ({ default: module.AIAssistantView })));
const DataManagementView = lazy(() => import("./components/views/DataManagementView").then(module => ({ default: module.DataManagementView })));
const LoginView = lazy(() => import("./components/views/LoginView").then(module => ({ default: module.LoginView })));


// Error Boundary Component
class ErrorBoundary extends Component<React.PropsWithChildren<{}>> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '8px', margin: '20px' }}>
          <h1>Algo salió mal.</h1>
          <p>Por favor, intenta refrescar la página.</p>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

const MainLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const financeHook = useFinance();

  const financeContext: FinanceContextType = React.useMemo(() => ({
    ...financeHook,
    openModal: () => setIsModalOpen(true),
  }), [financeHook]);

  const handleViewChange = () => {
    // No-op, sidebar is no longer toggled
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <Header />

      <Sidebar
        onViewChange={handleViewChange}
      />

      <main
        className={cn(
          'relative min-h-[calc(100vh-4rem)] pt-6 px-4 lg:px-8',
          'lg:ml-64 transition-all duration-300'
        )}
      >
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={
            <div className="glass rounded-2xl p-8 text-center animate-pulse">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/20" />
              <p className="text-muted-foreground">Cargando vista...</p>
            </div>
          }>
            <Outlet context={financeContext} />
          </Suspense>
        </div>
      </main>

      <MobileNav
        currentView={currentPath}
        onViewChange={handleViewChange}
        onAddClick={() => setIsModalOpen(true)}
      />

      <AddTransactionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={financeHook.addTransaction}
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
            <Route path="/login" element={<LoginView />} />
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
