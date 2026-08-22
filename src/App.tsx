import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { TripProvider, useTrip } from './context/TripContext.tsx';

import { Navbar } from './components/layout/Navbar.tsx';
import { MobileNav } from './components/layout/MobileNav.tsx';
import { DemoBanner } from './components/layout/DemoBanner.tsx';

import { AICopilotModal } from './components/common/AICopilotModal.tsx';
import { TripRescueModal } from './components/common/TripRescueModal.tsx';
import { PhotoToTripModal } from './components/common/PhotoToTripModal.tsx';
import { AgentModeModal } from './components/common/AgentModeModal.tsx';
import { NotificationsModal } from './components/common/NotificationsModal.tsx';

import { LandingPage } from './pages/LandingPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { CreateTripPage } from './pages/CreateTripPage.tsx';
import { TripDetailsPage } from './pages/TripDetailsPage.tsx';
import { MyTripsPage } from './pages/MyTripsPage.tsx';
import { ItineraryBuilderPage } from './pages/ItineraryBuilderPage.tsx';
import { SharedTripPage } from './pages/SharedTripPage.tsx';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage.tsx';
import { DiscoverPage } from './pages/DiscoverPage.tsx';
import { TravelDNAPage } from './pages/TravelDNAPage.tsx';
import { GroupTripPage } from './pages/GroupTripPage.tsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.tsx';
import { AuthPage } from './pages/AuthPage.tsx';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('auth');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { user } = useAuth();
  const { setIsCopilotOpen } = useTrip();

  // Keyboard shortcuts (Cmd/Ctrl + K for AI Copilot)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCopilotOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsCopilotOpen]);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage onNavigate={setActiveTab} />;
      case 'dashboard':
        return <DashboardPage onNavigate={setActiveTab} />;
      case 'my-trips':
        return <MyTripsPage onNavigate={setActiveTab} />;
      case 'planner':
        return <TripDetailsPage onNavigate={setActiveTab} />;
      case 'builder':
        return <ItineraryBuilderPage onNavigate={setActiveTab} />;
      case 'create-trip':
        return <CreateTripPage onNavigate={setActiveTab} />;
      case 'discover':
        return <DiscoverPage onNavigate={setActiveTab} />;
      case 'shared-trip':
        return <SharedTripPage onNavigate={setActiveTab} />;
      case 'profile':
      case 'settings':
        return <ProfileSettingsPage onNavigate={setActiveTab} />;
      case 'travel-dna':
        return <TravelDNAPage />;
      case 'group':
      case 'group-trip':
        return <GroupTripPage />;
      case 'admin':
        return <AdminDashboardPage />;
      case 'auth':
        return <AuthPage onNavigate={setActiveTab} onSuccess={(targetTab?: string) => setActiveTab(targetTab || 'create-trip')} />;
      default:
        return <DashboardPage onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Interactive Hackathon Demo Script Guide at top */}
      <DemoBanner onNavigate={setActiveTab} />

      {/* Main Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-24 md:pb-12">
        {renderActivePage()}
      </main>

      {/* Bottom Navigation for Mobile */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Global AI Modals & Dialogs */}
      <AICopilotModal />
      <TripRescueModal />
      <PhotoToTripModal />
      <AgentModeModal />
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigate={setActiveTab}
      />

    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TripProvider>
          <AppContent />
        </TripProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
