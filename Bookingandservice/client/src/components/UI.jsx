import { useEffect } from "react";
import { STATUS_CHIP, STATUS_DOT, IC } from "../constants";

export function Chip({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_CHIP[status] || "bg-stone-100 text-stone-500"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status] || "bg-stone-400"}`} />
      {status}
    </span>
  );
}

export function Field({ label, children }) {
  return (
    <div className="mb-4">
      <label className="block text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export function Modal({ open, onClose, title, subtitle, children, footer, wide }) {
  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] ${wide ? "w-[620px]" : "w-[480px]"} max-w-full animate-fadeUp`}>
        <div className="flex items-start justify-between p-6 pb-0">
          <div>
            <h2 className="font-display text-xl font-medium text-stone-800 tracking-tight">{title}</h2>
            {subtitle && <p className="text-sm text-stone-400 mt-1">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors text-sm ml-4 flex-shrink-0">✕</button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">{children}</div>
        {footer && <div className="flex justify-end gap-2 p-4 border-t border-stone-100">{footer}</div>}
      </div>
    </div>
  );
}

export function Empty({ icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-2xl">{icon}</div>
      <p className="font-semibold text-stone-700 mb-1">{title}</p>
      <p className="text-sm text-stone-400 mb-5">{desc}</p>
      {action}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-2 border-stone-200 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );
}

export function Toasts({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-medium text-white pointer-events-auto animate-fadeUp ${t.type === "error" ? "bg-red-600" : "bg-stone-800"}`}>
          <span className={t.type === "error" ? "text-red-300" : "text-emerald-400"}>{t.type === "error" ? "✕" : "✓"}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
