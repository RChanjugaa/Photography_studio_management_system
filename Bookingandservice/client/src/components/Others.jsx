import { useState, useEffect } from "react";
import { CAL_EVT, STATUS_DOT, STATUS_TRANSITIONS, fmtDate, fmtTime, fmtPrice } from "../constants";
import { Chip, Spinner } from "./UI";
import { api } from "../api";

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
export function Sidebar({ tab, setTab }) {
  const main  = [{ k:"list", l:"Bookings", i:"📅" }, { k:"calendar", l:"Calendar", i:"🗓" }, { k:"packages", l:"Packages", i:"📦" }];
  const other = [{ l:"Clients (Anchuga)", i:"👥" }, { l:"Gallery (Vaheesh)", i:"🖼" }, { l:"Payments (Abisheka)", i:"💳" }, { l:"Staff (Thiviyanath)", i:"👤" }];
  return (
    <aside className="w-56 bg-white border-r border-stone-200 flex flex-col fixed top-0 left-0 bottom-0 z-30">
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-stone-100">
        <div className="w-8 h-8 bg-stone-800 rounded-lg flex items-center justify-center text-white text-sm">📷</div>
        <span className="font-display font-medium text-stone-800">Shoot<span className="text-blue-600">Pro</span></span>
      </div>
      <div className="flex-1 px-3 pt-4 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-2 mb-2">Bookings</p>
        {main.map(n => (
          <button key={n.k} onClick={() => setTab(n.k)} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-colors text-left ${tab === n.k ? "bg-blue-50 text-blue-700" : "text-stone-500 hover:bg-stone-100 hover:text-stone-700"}`}>
            <span>{n.i}</span>{n.l}
          </button>
        ))}
        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-2 mb-2 mt-5">Other Modules</p>
        {other.map(n => <div key={n.l} className="flex items-center gap-2.5 px-3 py-2 text-xs text-stone-400 mb-0.5"><span>{n.i}</span>{n.l}</div>)}
      </div>
      <div className="px-4 py-3 border-t border-stone-100 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-600">CJ</div>
        <div><div className="text-xs font-semibold text-stone-700">Chanjugaa R.</div><div className="text-[10px] text-stone-400">Studio Admin</div></div>
      </div>
    </aside>
  );
}

// ── CALENDAR TAB ──────────────────────────────────────────────────────────────
export function CalendarTab({ onView, refreshKey }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [cur, setCur]           = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [peek, setPeek]         = useState(null);

  useEffect(() => {
    api.calendar.getAll().then(setBookings).catch(console.error).finally(() => setLoading(false));
  }, [refreshKey]);

  const today = new Date();
  const y = cur.getFullYear(), m = cur.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const dim = new Date(y, m+1, 0).getDate();
  const prevD = new Date(y, m, 0).getDate();
  const cells = [];
  for (let i = firstDay-1; i >= 0; i--) cells.push({ day: prevD-i, other: true });
  for (let d = 1; d <= dim; d++) cells.push({ day: d, other: false, isToday: new Date(y,m,d).toDateString() === today.toDateString() });
  const rem = 42 - cells.length;
  for (let d = 1; d <= rem; d++) cells.push({ day: d, other: true });

  const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <button onClick={() => setCur(new Date(y,m-1,1))} className="px-3 py-1.5 border border-stone-200 rounded-lg text-stone-500 hover:bg-stone-50 text-sm">‹</button>
          <h2 className="font-display text-lg font-medium text-stone-800 min-w-[190px] text-center">{cur.toLocaleDateString("en-US",{month:"long",year:"numeric"})}</h2>
          <button onClick={() => setCur(new Date(y,m+1,1))} className="px-3 py-1.5 border border-stone-200 rounded-lg text-stone-500 hover:bg-stone-50 text-sm">›</button>
          <button onClick={() => { const d=new Date(); d.setDate(1); setCur(d); }} className="px-3 py-1.5 text-sm text-stone-400 hover:text-stone-600">Today</button>
        </div>
        <div className="flex items-center gap-3 text-xs text-stone-400">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"/>Pending</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"/>Confirmed</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-stone-400"/>Cancelled</span>
        </div>
      </div>

      {loading ? <Spinner/> : (
        <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-7 border-b border-stone-200 bg-stone-50">
            {DAYS.map(d => <div key={d} className="py-2.5 text-center text-[11px] font-bold uppercase tracking-widest text-stone-400">{d}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((cell, idx) => {
              const ds = !cell.other ? `${y}-${String(m+1).padStart(2,"0")}-${String(cell.day).padStart(2,"0")}` : null;
              const dayBks = ds ? bookings.filter(b => b.scheduledStart?.substring(0,10) === ds) : [];
              return (
                <div key={idx} className={`border-r border-b border-stone-100 min-h-[90px] p-1.5 ${cell.other ? "bg-stone-50/70" : "hover:bg-stone-50/80"} ${idx%7===6 ? "border-r-0" : ""}`}>
                  <span className={`inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full mb-1 ${cell.isToday ? "bg-stone-800 text-white" : cell.other ? "text-stone-300" : "text-stone-500"}`}>{cell.day}</span>
                  {dayBks.slice(0,3).map(b => (
                    <div key={b.id} onClick={() => setPeek(peek?.id === b.id ? null : b)} className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium mb-0.5 cursor-pointer hover:opacity-75 ${CAL_EVT[b.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[b.status]}`}/>
                      <span className="truncate">{b.packageType}</span>
                    </div>
                  ))}
                  {dayBks.length > 3 && <div className="text-[10px] text-stone-400 px-1">+{dayBks.length-3}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {peek && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-stone-200 rounded-xl shadow-2xl p-4 z-40 w-72 animate-fadeUp">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2"><span className="font-bold text-stone-800 text-sm">{peek.id.substring(0,10)}</span><Chip status={peek.status}/></div>
            <button onClick={() => setPeek(null)} className="text-stone-400 hover:text-stone-600 text-xs">✕</button>
          </div>
          <p className="text-xs text-stone-500 mb-0.5">👤 {peek.clientName}</p>
          <p className="text-xs text-stone-500 mb-0.5">📦 {peek.packageTitle}</p>
          <p className="text-xs text-stone-500 mb-3">🕐 {fmtTime(peek.scheduledStart)} – {fmtTime(peek.scheduledEnd)}</p>
          <button onClick={() => { onView(peek.id); setPeek(null); }} className="w-full py-1.5 bg-stone-800 text-white text-xs font-medium rounded-lg hover:bg-stone-700">Open Booking →</button>
        </div>
      )}
    </div>
  );
}

// ── BOOKING DETAIL ────────────────────────────────────────────────────────────
export function BookingDetail({ bookingId, onBack, onStatusChange, onReschedule, onCancel }) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) return;
    setLoading(true);
    api.bookings.getById(bookingId).then(setBooking).catch(console.error).finally(() => setLoading(false));
  }, [bookingId]);

  if (loading) return <Spinner/>;
  if (!booking) return <div className="text-stone-400 text-sm p-4">Booking not found.</div>;

  const trans = STATUS_TRANSITIONS[booking.status] || [];
  const canAct = booking.status !== "Completed" && booking.status !== "Cancelled";

  const SC = ({ title, children, action }) => (
    <div className="bg-white border border-stone-200 rounded-xl shadow-sm mb-4 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-stone-100">
        <span className="text-[11px] font-bold uppercase tracking-widest text-stone-400">{title}</span>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );

  const IR = ({ items }) => (
    <div className="grid grid-cols-2 gap-4 mb-4 last:mb-0">
      {items.map(([l, v]) => <div key={l}><div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">{l}</div><div className="text-sm font-medium text-stone-700">{v || "—"}</div></div>)}
    </div>
  );

  return (
    <div>
      <div className="bg-white border border-stone-200 rounded-xl shadow-sm mb-4 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-sm text-stone-400 hover:text-stone-600">← Back</button>
            <span className="font-bold text-stone-800 text-lg">{booking.id.substring(0,12)}…</span>
            <Chip status={booking.status}/>
          </div>
          {canAct && (
            <div className="flex items-center gap-2">
              <button onClick={() => onReschedule(booking.id)} className="px-3 py-1.5 border border-stone-200 text-stone-600 text-sm rounded-lg hover:bg-stone-50">Reschedule</button>
              <button onClick={() => onCancel(booking.id)} className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 text-sm rounded-lg hover:bg-red-100">Cancel</button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4">
        <div>
          <SC title="Client Information">
            <IR items={[["Client Name", booking.clientName], ["Client ID", booking.clientId]]}/>
            <IR items={[["Email", booking.clientEmail || "—"], ["Phone", booking.clientPhone || "—"]]}/>
          </SC>
          <SC title="Package & Pricing">
            <IR items={[["Package", booking.packageTitle], ["Type", booking.packageType]]}/>
            <IR items={[["Base Price", fmtPrice(booking.basePrice)], ["Duration", `${booking.durationHours} hours`]]}/>
          </SC>
          <SC title="Schedule" action={canAct && <button onClick={() => onReschedule(booking.id)} className="text-xs font-medium text-blue-600 hover:text-blue-800">Reschedule</button>}>
            <IR items={[["Start", `${fmtDate(booking.scheduledStart)} ${fmtTime(booking.scheduledStart)}`], ["End", `${fmtDate(booking.scheduledEnd)} ${fmtTime(booking.scheduledEnd)}`]]}/>
          </SC>
          <SC title="Internal Notes">
            <p className="text-sm text-stone-600 leading-relaxed">{booking.notes || "No notes added."}</p>
          </SC>
        </div>
        <div>
          <SC title="Status & Actions">
            <div className="mb-4"><Chip status={booking.status}/></div>
            {trans.length > 0 ? (
              <div className="flex flex-col gap-2">
                {trans.map(n => (
                  <button key={n} onClick={() => onStatusChange(booking.id, n, setBooking)}
                    className={`w-full py-2 text-sm font-medium rounded-lg transition-colors ${n === "Cancelled" ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                    → {n}
                  </button>
                ))}
              </div>
            ) : <p className="text-xs text-stone-400">No further transitions available.</p>}
          </SC>
          <SC title="Photographer">
            <div className="text-sm font-medium text-stone-700">{booking.assignedPhotographerId || "Not assigned"}</div>
            <div className="text-xs text-stone-400 mt-1">Assigned via Admin module</div>
          </SC>
          {booking.auditLog?.length > 0 && (
            <SC title="Activity Log">
              <div className="space-y-2">
                {booking.auditLog.map((log, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className={`w-2 h-2 rounded-full mt-0.5 flex-shrink-0 ${STATUS_DOT[log.new_value] || "bg-stone-400"}`}/>
                    <div>
                      <span className="font-medium text-stone-700">{log.action}</span>
                      {log.old_value && log.new_value && log.old_value !== log.new_value && (
                        <span className="text-stone-400"> · {log.old_value} → {log.new_value}</span>
                      )}
                      <div className="text-stone-400">{new Date(log.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </SC>
          )}
        </div>
      </div>
    </div>
  );
}
