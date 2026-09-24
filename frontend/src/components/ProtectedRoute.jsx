import { useAuth } from '../context/useAuth';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: '#111111' }}>
        <p style={{ color: '#888' }}>Loading...</p>
      </div>
    );
  }

  if (!isLoggedIn) return null;

  return children;
}