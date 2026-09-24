import { useAuth } from '../context/useAuth';

const navItems = [
  { label: 'Dashboard', page: 'dashboard' },
  { label: 'Members', page: 'members' },
  { label: 'Plans', page: 'plans' },
  { label: 'Fees & Payments', page: 'fees' },
];

export default function AppLayout({ currentPage, onNavigate, onLogout, children }) {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#111111' }}>
      {/* Sidebar */}
      <div
        style={{
          width: 280,
          background: '#1A1A1A',
          borderRight: '1px solid #2A2A2A',
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
        className="hide-sm"
      >
        {/* Logo */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 mb-2">
            <div style={{ width: 28, height: 28, background: '#E5232D', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <span className="font-heading text-sm font-bold text-white uppercase">PULSE GYM</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1">
          {navItems.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              style={{
                width: '100%',
                padding: '12px 16px',
                marginBottom: 8,
                background: currentPage === page ? '#222' : 'transparent',
                border: currentPage === page ? '1px solid #E5232D' : '1px solid transparent',
                borderRadius: 8,
                color: currentPage === page ? '#E5232D' : '#888',
                textAlign: 'left',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* User & Logout */}
        <div style={{ borderTop: '1px solid #2A2A2A', paddingTop: 16 }}>
          <p className="text-xs" style={{ color: '#555' }}>{user?.email}</p>
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              marginTop: 12,
              padding: '10px',
              background: '#1A1A1A',
              border: '1px solid #2A2A2A',
              borderRadius: 6,
              color: '#888',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Mobile nav */}
        <div
          className="hide-on-desktop"
          style={{
            padding: '16px',
            background: '#1A1A1A',
            borderBottom: '1px solid #2A2A2A',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span className="font-heading font-bold text-white text-sm">PULSE GYM</span>
          <select
            value={currentPage}
            onChange={(e) => onNavigate(e.target.value)}
            style={{
              background: '#111',
              border: '1px solid #2A2A2A',
              borderRadius: 6,
              color: '#fff',
              padding: '8px 12px',
              fontSize: 12,
            }}
          >
            {navItems.map(({ label, page }) => (
              <option key={page} value={page}>{label}</option>
            ))}
          </select>
        </div>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}