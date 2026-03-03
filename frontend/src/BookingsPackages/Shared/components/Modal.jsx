export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-10 card w-[min(640px,92vw)] p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold">{title}</h3>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
        <div className="space-y-3">{children}</div>
        {footer && <div className="mt-3 pt-3 border-t border-border">{footer}</div>}
      </div>
    </div>
  );
}