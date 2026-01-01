import { useState, useEffect } from 'react';
import App from './App';
import { OnboardingView } from './components/views/OnboardingView';
import { useAuthContext } from './contexts/AuthContext';

const ONBOARDING_KEY = 'hasCompletedOnboarding';

export function AppWrapper() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuthContext();

  useEffect(() => {
    if (authLoading) return; // Wait until we know if user is logged in or not

    try {
      // If user is logged in, they have already completed onboarding
      if (user) {
        setShowOnboarding(false);
        setIsLoading(false);
        return;
      }
      
      const hasCompleted = localStorage.getItem(ONBOARDING_KEY);
      if (hasCompleted === 'true') {
        setShowOnboarding(false);
      } else {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error("Could not read from localStorage", error);
      setShowOnboarding(true); // Default to showing onboarding if localStorage is unavailable
    } finally {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  const handleOnboardingComplete = () => {
    try {
      localStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (error) {
      console.error("Could not write to localStorage", error);
    }
    setShowOnboarding(false);
  };

  if (isLoading || authLoading) {
    // You can return a global loading spinner here
    // For now, returning null to avoid flash of content
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="w-12 h-12 rounded-full animate-spin border-4 border-solid border-primary border-t-transparent"></div>
        </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingView onComplete={handleOnboardingComplete} />;
  }

  return <App />;
}
