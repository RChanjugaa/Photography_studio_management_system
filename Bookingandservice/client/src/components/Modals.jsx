import { useState, useEffect, useCallback } from "react";
import { IC, TIME_SLOTS, fmtPrice } from "../constants";
import { Modal, Field, Chip } from "./UI";
import { api } from "../api";

// ── CREATE BOOKING MODAL ──────────────────────────────────────────────────────
export function CreateBookingModal({ open, onClose, onCreated }) {
  const [step, setStep]         = useState(1);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [packages, setPackages] = useState([]);
  const [selPkg, setSelPkg]     = useState(null);
  const [date, setDate]         = useState("");
  const [time, setTime]         = useState("");
  const [notes, setNotes]       = useState("");
  const [conflict, setConflict] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr]           = useState("");
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (open) {
      setStep(1); setClientName(""); setClientEmail(""); setClientPhone("");
      setSelPkg(null); setDate(""); setTime(""); setNotes("");
      setConflict(false); setErr("");
      api.packages.getAll().then(ps => setPackages(ps.filter(p => p.active))).catch(console.error);
    }
  }, [open]);

  const checkConflict = useCallback(async (d, t, pkgId) => {
    if (!d || !t || !pkgId) return;
    try {
      const pkg = packages.find(p => p.id === pkgId);
      const start = new Date(`${d}T${t}`);
      const end = new Date(start.getTime() + (pkg?.durationHours || 1) * 3600000);
      const { conflict } = await api.bookings.conflictCheck({ start: start.toISOString(), end: end.toISOString() });
      setConflict(conflict);
    } catch { setConflict(false); }
  }, [packages]);

  useEffect(() => { checkConflict(date, time, selPkg); }, [date, time, selPkg, checkConflict]);

  const pkg = packages.find(p => p.id === selPkg);
  const STEPS = ["Client", "Package", "Date & Time", "Summary"];

  const handleSubmit = async () => {
    setErr(""); setSubmitting(true);
    try {
      const created = await api.bookings.create({
        clientName: clientName.trim(),
        clientEmail, clientPhone,
        packageId: selPkg,
        scheduledStart: `${date}T${time}`,
        notes,
      });
      onCreated(created);
      onClose();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Booking" subtitle="Complete all steps to confirm" wide>
      {/* Stepper */}
      <div className="flex items-center mb-6 -mt-2">
        {STEPS.map((s, i) => {
          const n = i+1, done = n < step, active = n === step;
          return (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${done ? "bg-stone-800 text-white" : active ? "bg-blue-600 text-white ring-4 ring-blue-100" : "bg-stone-100 text-stone-400"}`}>{done ? "✓" : n}</div>
                <span className={`text-xs font-semibold hidden sm:block ${active ? "text-stone-800" : "text-stone-400"}`}>{s}</span>
              </div>
              {i < STEPS.length-1 && <div className={`flex-1 h-px mx-2 ${done ? "bg-stone-400" : "bg-stone-200"}`}/>}
            </div>
          );
        })}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div>
          <Field label="Client Name *"><input className={IC} value={clientName} onChange={e => setClientName(e.target.value)} placeholder="e.g. Nithya Shankar"/></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email"><input className={IC} type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="client@email.com"/></Field>
            <Field label="Phone"><input className={IC} value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="+94 77 123 4567"/></Field>
          </div>
          <div className="flex justify-end mt-6 pt-4 border-t border-stone-100">
            <button onClick={() => setStep(2)} disabled={!clientName.trim()} className="px-5 py-2 bg-stone-800 text-white text-sm rounded-lg hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed">Next → Package</button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div>
          {packages.length === 0
            ? <p className="text-sm text-stone-400 py-6 text-center">No active packages. Add packages in the Packages tab first.</p>
            : <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {packages.map(p => (
                  <div key={p.id} onClick={() => setSelPkg(p.id)} className={`border-2 rounded-xl p-3.5 cursor-pointer transition-all ${selPkg === p.id ? "border-blue-500 bg-blue-50" : "border-stone-200 hover:border-blue-300 hover:bg-blue-50/50"}`}>
                    <div className="font-semibold text-stone-800 text-sm mb-1">{p.title}</div>
                    <div className="text-xs text-stone-400">{p.type} · {p.durationHours}h · LKR {Number(p.basePrice||0).toLocaleString()}</div>
                  </div>
                ))}
              </div>
          }
          <div className="flex justify-between mt-6 pt-4 border-t border-stone-100">
            <button onClick={() => setStep(1)} className="px-4 py-2 border border-stone-200 text-stone-600 text-sm rounded-lg hover:bg-stone-50">← Back</button>
            <button onClick={() => setStep(3)} disabled={!selPkg} className="px-5 py-2 bg-stone-800 text-white text-sm rounded-lg hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed">Next → Date & Time</button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div>
          <Field label="Date *"><input className={IC} type="date" value={date} min={today} onChange={e => setDate(e.target.value)}/></Field>
          <Field label="Start Time *">
            <select className={IC} value={time} onChange={e => setTime(e.target.value)}>
              <option value="">Select time slot</option>
              {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          {conflict && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mt-2">
              ⚠ Time slot conflict detected. Please choose a different time.
            </div>
          )}
          <div className="flex justify-between mt-6 pt-4 border-t border-stone-100">
            <button onClick={() => setStep(2)} className="px-4 py-2 border border-stone-200 text-stone-600 text-sm rounded-lg hover:bg-stone-50">← Back</button>
            <button onClick={() => setStep(4)} disabled={!date || !time || conflict} className="px-5 py-2 bg-stone-800 text-white text-sm rounded-lg hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed">Next → Summary</button>
          </div>
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <div>
          <Field label="Internal Notes">
            <textarea className={IC + " resize-none"} rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any special instructions…"/>
          </Field>
          <Field label="Summary">
            <div className="bg-stone-50 border border-stone-200 rounded-xl overflow-hidden">
              {[["Client", clientName], ["Package", pkg?.title||"—"], ["Type", pkg?.type||"—"], ["Date", date||"—"], ["Start", time||"—"], ["Duration", pkg?`${pkg.durationHours} hrs`:"—"], ["Base Price", pkg?fmtPrice(pkg.basePrice):"—"]].map(([k,v],i) => (
                <div key={k} className={`flex justify-between items-center px-4 py-2.5 text-sm ${i<6?"border-b border-stone-100":""}`}>
                  <span className="text-stone-400">{k}</span>
                  <span className={`font-semibold text-stone-700 ${k==="Base Price"?"text-stone-800 text-base":""}`}>{v}</span>
                </div>
              ))}
            </div>
          </Field>
          {err && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-2">{err}</p>}
          <div className="flex justify-between mt-4 pt-4 border-t border-stone-100">
            <button onClick={() => setStep(3)} className="px-4 py-2 border border-stone-200 text-stone-600 text-sm rounded-lg hover:bg-stone-50">← Back</button>
            <button onClick={handleSubmit} disabled={submitting} className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {submitting ? "Creating…" : "✓ Confirm Booking"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ── RESCHEDULE MODAL ──────────────────────────────────────────────────────────
export function RescheduleModal({ open, onClose, bookingId, onRescheduled }) {
  const [date, setDate]         = useState("");
  const [time, setTime]         = useState("09:00");
  const [conflict, setConflict] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [err, setErr]           = useState("");
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => { setDate(""); setTime("09:00"); setConflict(false); setErr(""); }, [open]);

  const checkConflict = async (d, t) => {
    if (!d || !t || !bookingId) return;
    try {
      const { conflict } = await api.bookings.conflictCheck({ start: `${d}T${t}`, end: `${d}T${t}`, excludeId: bookingId });
      setConflict(conflict);
    } catch { setConflict(false); }
  };

  useEffect(() => { checkConflict(date, time); }, [date, time]);

  const handleConfirm = async () => {
    setErr(""); setSaving(true);
    try {
      const updated = await api.bookings.reschedule(bookingId, `${date}T${time}`);
      onRescheduled(updated);
      onClose();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Reschedule Booking" subtitle={`Booking ${bookingId?.substring(0,12) || ""}…`}
      footer={<>
        <button onClick={onClose} className="px-4 py-2 text-sm border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50">Cancel</button>
        <button onClick={handleConfirm} disabled={!date || conflict || saving} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40">
          {saving ? "Saving…" : "Confirm Reschedule"}
        </button>
      </>}>
      <Field label="New Date"><input className={IC} type="date" value={date} min={today} onChange={e => setDate(e.target.value)}/></Field>
      <Field label="New Start Time">
        <select className={IC} value={time} onChange={e => setTime(e.target.value)}>
          {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </Field>
      {conflict && <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">⚠ Conflict detected for this slot.</div>}
      {err && <div className="text-red-600 text-sm mt-2">{err}</div>}
    </Modal>
  );
}

// ── CANCEL MODAL ──────────────────────────────────────────────────────────────
export function CancelModal({ open, onClose, bookingId, onCancelled }) {
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    setSaving(true);
    try {
      const updated = await api.bookings.updateStatus(bookingId, "Cancelled");
      onCancelled(updated);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Cancel Booking" subtitle="This action cannot be undone easily."
      footer={<>
        <button onClick={onClose} className="px-4 py-2 text-sm border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50">Keep Booking</button>
        <button onClick={handleConfirm} disabled={saving} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
          {saving ? "Cancelling…" : "Yes, Cancel It"}
        </button>
      </>}>
      <p className="text-sm text-stone-600 leading-relaxed">
        Are you sure you want to cancel booking <strong className="text-stone-800">{bookingId?.substring(0,12)}…</strong>?
        Status will be set to <Chip status="Cancelled"/>.
      </p>
    </Modal>
  );
}
