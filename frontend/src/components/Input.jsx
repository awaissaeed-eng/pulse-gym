export default function Input({ label, error, ...props }) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#888' }}>
          {label}
        </label>
      )}
      <input
        {...props}
        style={{
          width: '100%',
          background: '#111',
          border: error ? '1px solid #E5232D' : '1px solid #2A2A2A',
          borderRadius: 8,
          padding: '12px 16px',
          color: '#fff',
          fontSize: 14,
          transition: 'border-color 0.15s',
          ...props.style,
        }}
      />
      {error && <p className="text-xs mt-1" style={{ color: '#E5232D' }}>{error}</p>}
    </div>
  );
}