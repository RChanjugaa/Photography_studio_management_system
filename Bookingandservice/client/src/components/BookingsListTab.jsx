import { useState, useEffect, useCallback } from "react";
import { STATUS, PKG_TYPES, IC, fmtDate, fmtTime } from "../constants";
import { Chip, Empty, Spinner } from "./UI";
import { api } from "../api";

export default function BookingsListTab({ onView, onOpenCreate, onCancel, onReschedule, refreshKey }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]     = useState("");
  const [fStatus, setFStatus]   = useState("");
  const [fType, setFType]       = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo]     = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.bookings.getAll({ status: fStatus, type: fType, dateFrom, dateTo, search });
      setBookings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [fStatus, fType, dateFrom, dateTo, search, refreshKey]);

  useEffect(() => {
    const t = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load]);

  const clearFilters = () => { setSearch(""); setFStatus(""); setFType(""); setDateFrom(""); setDateTo(""); };
  const hasFilters = search || fStatus || fType || dateFrom || dateTo;

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5 mb-5">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm pointer-events-none">🔍</span>
          <input className={IC + " pl-8"} placeholder="Search client or booking ID…" value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <select className={IC} style={{width:140}} value={fStatus} onChange={e => setFStatus(e.target.value)}>
          <option value="">All Status</option>
          {Object.values(STATUS).map(s => <option key={s}>{s}</option>)}
        </select>
        <select className={IC} style={{width:130}} value={fType} onChange={e => setFType(e.target.value)}>
          <option value="">All Types</option>
          {PKG_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <input className={IC} type="date" style={{width:148}} value={dateFrom} onChange={e => setDateFrom(e.target.value)}/>
        <input className={IC} type="date" style={{width:148}} value={dateTo} onChange={e => setDateTo(e.target.value)}/>
        {hasFilters && <button onClick={clearFilters} className="text-sm text-stone-400 hover:text-stone-600 px-2 transition-colors">Clear</button>}
      </div>

      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? <Spinner/> : bookings.length === 0 ? (
          <Empty icon="📅" title="No bookings found"
            desc={hasFilters ? "Try adjusting your filters." : "Create your first booking to get started."}
            action={!hasFilters ? <button onClick={onOpenCreate} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">+ Create Booking</button> : null}/>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  {["Booking ID","Client","Package","Date / Time","Photographer","Status","Actions"].map(h =>
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-stone-400 whitespace-nowrap">{h}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => {
                  const canAct = b.status !== "Completed" && b.status !== "Cancelled";
                  return (
                    <tr key={b.id} onClick={() => onView(b.id)} className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors last:border-b-0">
                      <td className="px-4 py-3.5 font-bold text-stone-800 tracking-tight whitespace-nowrap">{b.id.split("-")[1]}</td>
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-stone-700">{b.clientName}</div>
                        <div className="text-xs text-stone-400">{b.clientId}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-xs text-stone-400">{b.packageType}</div>
                        <div className="font-medium text-stone-700">{b.packageTitle}</div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="text-stone-700">{fmtDate(b.scheduledStart)}</div>
                        <div className="text-xs text-stone-400">{fmtTime(b.scheduledStart)}</div>
                      </td>
                      <td className="px-4 py-3.5 text-stone-500 text-xs">{b.assignedPhotographerId || "—"}</td>
                      <td className="px-4 py-3.5"><Chip status={b.status}/></td>
                      <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <button onClick={() => onView(b.id)} title="View" className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors text-sm">👁</button>
                          <button onClick={() => onReschedule(b.id)} disabled={!canAct} title="Reschedule" className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed">🔄</button>
                          <button onClick={() => onCancel(b.id)} disabled={!canAct} title="Cancel" className="p-1.5 rounded-lg text-red-300 hover:bg-red-50 hover:text-red-600 transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed">✕</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
