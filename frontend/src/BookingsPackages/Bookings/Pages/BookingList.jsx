// src/features/bookings/BookingList.jsx
// rebuild trigger
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import StatusBadge from "../Components/StatusBadge";
import { getBookings } from "../api";

export default function BookingList() {
  console.log('BookingList render');

  // Keep URL in sync so filters can be shared/bookmarked
  const [searchParams, setSearchParams] = useSearchParams();

  // UI state (initialize from URL if present)
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [from, setFrom] = useState(searchParams.get("from") || "");
  const [to, setTo] = useState(searchParams.get("to") || "");

  const params = useMemo(() => ({ q, status, from, to }), [q, status, from, to]);

  const [data, setData] = useState(null);      // list of bookings
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async (p = params) => {
    try {
      setLoading(true);
      setErr("");
      const rows = await getBookings(p);
      setData(rows);
    } catch (e) {
      setErr(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  // On mount and whenever URL params change (initial restore)
  useEffect(() => {
    const init = {
      q: searchParams.get("q") || "",
      status: searchParams.get("status") || "",
      from: searchParams.get("from") || "",
      to: searchParams.get("to") || "",
    };
    // If URL had values different from current local state, sync and fetch
    if (init.q !== q) setQ(init.q);
    if (init.status !== status) setStatus(init.status);
    if (init.from !== from) setFrom(init.from);
    if (init.to !== to) setTo(init.to);
    // Fetch with the URL-backed params
    load(init);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only on first render

  // Apply button → update URL + reload
  const applyFilters = () => {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (status) next.set("status", status);
    if (from) next.set("from", from);
    if (to) next.set("to", to);
    setSearchParams(next);
    load({ q, status, from, to });
  };

  // Clear filters quickly
  const clearFilters = () => {
    setQ("");
    setStatus("");
    setFrom("");
    setTo("");
    setSearchParams(new URLSearchParams());
    load({});
  };

  // Derived values (counts by status for small overview)
  const counts = useMemo(() => {
    const result = { Pending: 0, Confirmed: 0, Completed: 0, Cancelled: 0, total: 0 };
    if (!data) return result;
    data.forEach(b => {
      result.total += 1;
      if (result[b.status] !== undefined) result[b.status] += 1;
    });
    return result;
  }, [data]);

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl font-bold">Bookings</h2>
        <Link to="/bookings/new" className="btn btn-primary">+ Create Booking</Link>
      </div>

      {/* Filters */}
      <div className="card p-3 mb-3" role="region" aria-label="Filters">
        <div className="grid md:grid-cols-5 gap-2">
          <input
            className="input md:col-span-2"
            placeholder="Search name / phone / booking ID"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <select className="input" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All status</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
          <input className="input" type="date" value={from} onChange={e => setFrom(e.target.value)} max={to || undefined} />
          <input className="input" type="date" value={to} onChange={e => setTo(e.target.value)} min={from || undefined} />
        </div>
        <div className="mt-2 flex items-center justify-end gap-2">
          <button className="btn btn-secondary" onClick={clearFilters}>Clear</button>
          <button className="btn btn-primary" onClick={applyFilters}>Apply</button>
        </div>
      </div>

      {/* Summary chips (optional) */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="badge">Total: {counts.total}</span>
        <span className="badge badge-pending">Pending: {counts.Pending}</span>
        <span className="badge badge-confirmed">Confirmed: {counts.Confirmed}</span>
        <span className="badge badge-completed">Completed: {counts.Completed}</span>
        <span className="badge badge-cancelled">Cancelled: {counts.Cancelled}</span>
      </div>

      {/* Table / loading / empty / error */}
      <div className="card overflow-x-auto">
        {loading && <div className="p-4">Loading…</div>}
        {!loading && err && <div className="p-4 text-red-600">{err}</div>}
        {!loading && !err && (!data || data.length === 0) && (
          <div className="p-4">No bookings found. Create your first booking.</div>
        )}

        {!loading && !err && data && data.length > 0 && (
          <table className="w-full text-left">
            <thead className="border-b border-border bg-surface">
              <tr className="[&>th]:py-2 [&>th]:px-2">
                <th>Booking ID</th>
                <th>Client</th>
                <th>Package</th>
                <th>Date/Time</th>
                <th>Status</th>
                <th aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              {data.map(b => (
                <tr key={b.id} className="border-b border-border [&>td]:py-2 [&>td]:px-2">
                  <td className="font-mono">{b.id}</td>
                  <td>{b.clientName}</td>
                  <td>{b.packageTitle}</td>
                  <td>{dayjs(b.scheduledStart).format("YYYY-MM-DD HH:mm")}</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td>
                    <Link to={`/bookings/${b.id}`} className="text-primary hover:underline">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
