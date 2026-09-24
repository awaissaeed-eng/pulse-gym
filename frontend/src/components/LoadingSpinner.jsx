export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <div
        style={{
          width: 24,
          height: 24,
          border: '2px solid #2A2A2A',
          borderTop: '2px solid #E5232D',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}