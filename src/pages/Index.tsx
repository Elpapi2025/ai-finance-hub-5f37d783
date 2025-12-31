import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { DashboardView } from '@/components/views/DashboardView';
import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { AddTransactionModal } from '@/components/finance/AddTransactionModal';
import { useFinance } from '@/hooks/useFinance';
import { cn } from '@/lib/utils';
import { Outlet } from 'react-router-dom'; // Import Outlet

interface IndexProps {
  currentPath: string; // To allow MobileNav to still know the current route
}

const Index = ({ currentPath }: IndexProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addTransaction } = useFinance(); // Only need addTransaction here

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
        onViewChange={() => setIsSidebarOpen(false)} // Close sidebar on nav item click
      />

      <main
        className={cn(
          'relative min-h-[calc(100vh-4rem)] pt-6 px-4 lg:px-8',
          'lg:ml-64 transition-all duration-300'
        )}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet /> {/* This is where nested routes will render */}
        </div>
      </main>

      <MobileNav
        currentView={currentPath} // Pass currentPath for MobileNav
        onViewChange={() => setIsSidebarOpen(false)} // Close sidebar on nav item click
        onAddClick={() => setIsModalOpen(true)}
      />

      <AddTransactionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addTransaction}
      />
    </div>
  );
};

export default Index;
import { ReportsView } from '@/components/views/ReportsView';
import { AIAssistantView } from '@/components/views/AIAssistantView';
import { AddTransactionModal } from '@/components/finance/AddTransactionModal';
import { useFinance } from '@/hooks/useFinance';
import { cn } from '@/lib/utils';

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    transactions,
    summary,
    addTransaction,
    deleteTransaction,
    expensesByCategory,
    isLoading,
  } = useFinance();

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
  };

  const renderView = () => {
    if (isLoading) {
      return (
        <div className="glass rounded-2xl p-8 text-center animate-pulse">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/20" />
          <p className="text-muted-foreground">Cargando datos...</p>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            summary={summary}
            transactions={transactions}
            expensesByCategory={expensesByCategory}
            onDeleteTransaction={deleteTransaction}
            onAddClick={() => setIsModalOpen(true)}
          />
        );
      case 'transactions':
        return (
          <TransactionsView
            transactions={transactions}
            onDelete={deleteTransaction}
          />
        );
      case 'reports':
        return (
          <ReportsView
            summary={summary}
            expensesByCategory={expensesByCategory}
            transactions={transactions}
          />
        );
      case 'ai':
        return <AIAssistantView summary={summary} />;
      case 'goals':
        return (
          <div className="glass rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Metas Financieras</h2>
            <p className="text-muted-foreground">Próximamente: Establece y rastrea tus metas de ahorro</p>
          </div>
        );
      case 'settings':
        return (
          <div className="glass rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Ajustes</h2>
            <p className="text-muted-foreground">Próximamente: Personaliza tu experiencia</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <Header
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isMenuOpen={isSidebarOpen}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        currentView={currentView}
        onViewChange={handleViewChange}
      />

      <main
        className={cn(
          'relative min-h-[calc(100vh-4rem)] pt-6 px-4 lg:px-8',
          'lg:ml-64 transition-all duration-300'
        )}
      >
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>

      <MobileNav
        currentView={currentView}
        onViewChange={handleViewChange}
        onAddClick={() => setIsModalOpen(true)}
      />

      <AddTransactionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addTransaction}
      />
    </div>
  );
};

export default Index;
