import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { useAuthContext } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// Lazy-loaded view components
const LoginView = lazy(() => import("./components/views/LoginView").then(module => ({ default: module.LoginView })));
const MinimalView = lazy(() => import("./components/views/MinimalView").then(module => ({ default: module.MinimalView })));

// A simple guard to protect routes that require authentication
const AuthGuard = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Loading session...</h1>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div style={{ padding: '20px' }}><h1>Loading View...</h1></div>}>
          <Routes>
            <Route path="/login" element={<LoginView />} />
            
            <Route element={<AuthGuard />}>
              <Route path="/" element={<MinimalView />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
