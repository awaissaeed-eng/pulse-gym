export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-wrap fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="modal-inner"
        style={{
          background: '#1A1A1A',
          border: '1px solid #2A2A2A',
          borderRadius: 12,
          padding: '32px',
          maxWidth: 500,
          width: '90%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-heading text-xl font-bold text-white mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
}