import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../core/hooks/useAuth';
import { useUIStore } from '../core/store/ui.store';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { Toast } from '../components/layout/PageWrapper';
import { Compass } from 'lucide-react';

// Lazy-loaded Feature Screens
const AuthPage = lazy(() => import('../features/auth/AuthPage'));
const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage'));
const CreateTripPage = lazy(() => import('../features/trips/CreateTripPage'));
const MyTripsPage = lazy(() => import('../features/trips/MyTripsPage'));
const ItineraryBuilderPage = lazy(() => import('../features/itinerary/ItineraryBuilderPage'));
const ItineraryViewPage = lazy(() => import('../features/itinerary/ItineraryViewPage'));
const CitySearchPage = lazy(() => import('../features/cities/CitySearchPage'));
const ActivitySearchPage = lazy(() => import('../features/activities/ActivitySearchPage'));
const BudgetBreakdownPage = lazy(() => import('../features/budget/BudgetBreakdownPage'));
const CalendarTimelinePage = lazy(() => import('../features/calendar/CalendarTimelinePage'));
const PublicShareViewPage = lazy(() => import('../features/share/PublicShareViewPage'));
const ProfilePage = lazy(() => import('../features/profile/ProfilePage'));
const AdminDashboardPage = lazy(() => import('../features/admin/AdminDashboardPage'));

function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--paper)' }}>
      <div style={{ textAlign: 'center' }}>
        <Compass size={40} className="route-dash-animated" style={{ color: 'var(--traverse)', margin: '0 auto 12px' }} />
        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink-muted)' }}>Loading GlobeTrotter...</span>
      </div>
    </div>
  );
}

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
}

// Admin Route Guard
function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function AppRouter() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { isSidebarOpen, toggleSidebar, toast, hideToast } = useUIStore();

  const isPublicShare = location.pathname.startsWith('/share/');
  const isAuthPage = location.pathname.startsWith('/auth');

  const showAppShell = !isPublicShare && !isAuthPage && user;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      {!isPublicShare && (
        <Navbar
          user={user}
          onNavigate={(path) => navigate(path)}
          onLogout={logout}
          onToggleSidebar={toggleSidebar}
          currentPath={location.pathname}
        />
      )}

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        {showAppShell && (
          <Sidebar
            isOpen={isSidebarOpen}
            currentPath={location.pathname}
            onNavigate={(path) => navigate(path)}
            isAdmin={isAdmin}
          />
        )}

        {/* Routes Viewport */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Unauthenticated Share View */}
              <Route path="/share/:slug" element={<PublicShareViewPage />} />

              {/* Auth Routes */}
              <Route path="/auth/login" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
              <Route path="/auth/register" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trips/new"
                element={
                  <ProtectedRoute>
                    <CreateTripPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trips"
                element={
                  <ProtectedRoute>
                    <MyTripsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trips/:id/build"
                element={
                  <ProtectedRoute>
                    <ItineraryBuilderPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trips/:id/view"
                element={
                  <ProtectedRoute>
                    <ItineraryViewPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trips/:id/cities"
                element={
                  <ProtectedRoute>
                    <CitySearchPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trips/:id/stops/:stopId/activities"
                element={
                  <ProtectedRoute>
                    <ActivitySearchPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trips/:id/budget"
                element={
                  <ProtectedRoute>
                    <BudgetBreakdownPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trips/:id/calendar"
                element={
                  <ProtectedRoute>
                    <CalendarTimelinePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Dashboard */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                }
              />

              {/* Root Fallback */}
              <Route path="/" element={<Navigate to={user ? "/dashboard" : "/auth/login"} replace />} />
              <Route path="*" element={<Navigate to={user ? "/dashboard" : "/auth/login"} replace />} />
            </Routes>
          </Suspense>
        </div>
      </div>

      {/* Global Toast */}
      <Toast toast={toast} onDismiss={hideToast} />
    </div>
  );
}
