export default function Badge({ status, children }) {
  const colors = {
    active: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e' },
    expired: { bg: 'rgba(229, 35, 45, 0.1)', text: '#E5232D' },
    pending: { bg: 'rgba(229, 35, 45, 0.1)', text: '#E5232D' },
    paid: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e' },
  };

  const color = colors[status];

  return (
    <span
      className="inline-block px-2 py-1 text-xs font-semibold rounded"
      style={{ background: color.bg, color: color.text, borderRadius: 4 }}
    >
      {children}
    </span>
  );
}