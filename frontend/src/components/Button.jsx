export default function Button({ variant = 'primary', size = 'md', loading, disabled, children, ...props }) {
  const isDisabled = disabled || loading;

  const baseStyle = {
    border: 'none',
    borderRadius: 8,
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    fontFamily: 'Sora, sans-serif',
    transition: 'all 0.15s ease',
    fontSize: size === 'sm' ? 12 : size === 'lg' ? 14 : 13,
    padding: size === 'sm' ? '8px 12px' : size === 'lg' ? '16px 20px' : '12px 16px',
  };

  const variantStyle = variant === 'primary'
    ? { background: isDisabled ? '#7a0f14' : '#E5232D', color: '#fff' }
    : variant === 'secondary'
    ? { background: '#1A1A1A', color: '#fff', border: '1px solid #2A2A2A' }
    : { background: '#7a0f14', color: '#fff' };

  return (
    <button
      {...props}
      disabled={isDisabled}
      style={{ ...baseStyle, ...variantStyle }}
      className={variant === 'primary' && !isDisabled ? 'red-glow-sm' : ''}
    >
      {loading ? 'Loading…' : children}
    </button>
  );
}