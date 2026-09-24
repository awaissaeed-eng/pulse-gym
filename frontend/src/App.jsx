import { useState } from 'react';
import { useAuth } from './context/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MembersPage from './pages/MembersPage';
import PlansPage from './pages/PlansPage';
import FeesPage from './pages/FeesPage';

export default function App() {
  const { isLoggedIn, logout, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: '#111111' }}>
        <p style={{ color: '#888' }}>Loading...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'members':
        return <MembersPage />;
      case 'plans':
        return <PlansPage />;
      case 'fees':
        return <FeesPage />;
      default:
        return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <ProtectedRoute>
      <AppLayout
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={logout}
      >
        {renderPage()}
      </AppLayout>
    </ProtectedRoute>
  );
}