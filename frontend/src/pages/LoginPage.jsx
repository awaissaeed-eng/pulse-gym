import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import Button from '../components/Button';
import Input from '../components/Input';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@pulsegym.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#0D0D0D' }}>
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(ellipse 80% 50% at 50% -10%, rgba(229,35,45,0.07) 0%, transparent 70%)`,
      }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'rgba(229,35,45,0.15)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
      }} />

      <div className="relative z-10 w-full max-w-md px-6 fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-2">
            <div style={{ width: 36, height: 36, background: '#E5232D', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <span className="font-heading text-xl font-bold tracking-widest text-white uppercase">Pulse Gym</span>
          </div>
          <p className="text-sm tracking-widest uppercase" style={{ color: '#555' }}>Management Console</p>
        </div>

        {/* Card */}
        <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: '40px' }} className="card-shadow">
          <h1 className="font-heading text-2xl font-bold uppercase tracking-tight text-white mb-1">Sign In</h1>
          <p className="text-sm mb-8" style={{ color: '#666' }}>Access your admin dashboard</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@pulsegym.com"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {error && <p className="text-xs" style={{ color: '#E5232D' }}>{error}</p>}

            <Button variant="primary" size="md" loading={loading}>
              {loading ? 'Authenticating…' : 'Log In'}
            </Button>
          </form>

          <div className="mt-6 pt-6" style={{ borderTop: '1px solid #222' }}>
            <p className="text-xs text-center" style={{ color: '#444' }}>
              Authorized personnel only · Pulse Gym © 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}