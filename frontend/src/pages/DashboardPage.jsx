import { useEffect, useState } from 'react';
import api from '../libraries/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Badge from '../components/Badge';

export default function DashboardPage({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div style={{ padding: '32px', color: '#E5232D' }}>{error}</div>;
  if (!stats) return null;

  const fmt = (n) => `$${n.toLocaleString()}`;

  const statCards = [
    { label: 'Total Members', value: stats.totalMembers, icon: '👥', delta: '+3 this week' },
    { label: 'Active Members', value: stats.activeMembers, icon: '✓', delta: `${Math.round(stats.activeMembers / stats.totalMembers * 100)}% active` },
    { label: 'Pending Fees', value: fmt(stats.pendingFees), icon: '$', delta: '3 overdue', deltaRed: true },
    { label: 'Total Revenue', value: fmt(stats.monthlyRevenue), icon: '📈', delta: '+12% vs last month' },
  ];

  return (
    <div className="page-pad" style={{ padding: '32px 24px', maxWidth: 1200 }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-tight text-white mb-1">Overview</h1>
        <p className="text-sm" style={{ color: '#666' }}>September 2026 · Pulse Gym HQ</p>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid mb-8">
        {statCards.map(({ label, value, icon, delta, deltaRed }) => (
          <div
            key={label}
            style={{
              background: '#1A1A1A',
              border: '1px solid #222',
              borderRadius: 10,
              padding: '22px 24px',
              position: 'relative',
              overflow: 'hidden',
            }}
            className="card-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#555' }}>{label}</p>
              <div style={{ fontSize: 20 }}>{icon}</div>
            </div>
            <p className="font-heading text-3xl font-bold text-white mb-2">{value}</p>
            <p className="text-xs" style={{ color: deltaRed ? '#E5232D' : '#555' }}>{delta}</p>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #E5232D 0%, transparent 100%)', opacity: 0.3 }} />
          </div>
        ))}
      </div>

      {/* Recent Members */}
      <div style={{ background: '#1A1A1A', border: '1px solid #222', borderRadius: 10 }} className="card-shadow">
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid #1E1E1E' }}>
          <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-white">Recently Joined</h2>
          <button
            onClick={() => onNavigate('members')}
            style={{ background: '#E5232D', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
          >
            View All
          </button>
        </div>
        <div className="divide-y" style={{ borderColor: '#1E1E1E' }}>
          {stats.recentMembers.map((member) => (
            <div key={member._id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white text-sm">{member.name}</p>
                <p className="text-xs" style={{ color: '#666' }}>{member.phone}</p>
              </div>
              <Badge status={member.computedStatus || 'active'}>
                {member.computedStatus === 'active' ? 'Active' : 'Expired'}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}