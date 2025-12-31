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