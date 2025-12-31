import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import Index from "./pages/Index"; // Index will now be a layout component
import NotFound from "./pages/NotFound";
import { useFinance } from "./hooks/useFinance"; // Import useFinance

// Import all view components
import { DashboardView } from "./components/views/DashboardView";
import { TransactionsView } from "./components/views/TransactionsView";
import { ReportsView } from "./components/views/ReportsView";
import { AIAssistantView } from "./components/views/AIAssistantView";
import { DataManagementView } from "./components/views/DataManagementView";

const queryClient = new QueryClient();

// Layout component to manage main app structure (Header, Sidebar, Main content via Outlet)
const MainLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { addTransaction } = useFinance(); // Call useFinance here

  return (
    <Index currentPath={currentPath} onAddTransaction={addTransaction}> {/* Pass addTransaction to Index */}
      <Outlet /> {/* Renders the matched child route component */}
    </Index>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}> {/* Use MainLayout as the base for all views */}
            <Route index element={<DashboardView />} /> {/* Default view for / */}
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
