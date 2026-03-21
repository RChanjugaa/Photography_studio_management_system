import { useState, useCallback } from "react";
import { api } from "./api";
import { Toasts } from "./components/UI";
import { Sidebar, CalendarTab, BookingDetail } from "./components/Others";
import BookingsListTab from "./components/BookingsListTab";
import PackagesTab from "./components/PackagesTab";
import { CreateBookingModal, RescheduleModal, CancelModal } from "./components/Modals";

export default function App() {
  const [tab, setTab]         = useState("list");
  const [detailId, setDetailId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [toasts, setToasts]   = useState([]);

  // Modal states
  const [showCreate, setShowCreate] = useState(false);
  const [reschedId, setReschedId]   = useState(null);
  const [cancelId, setCancelId]     = useState(null);

  const toast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);

  const refresh = () => setRefreshKey(k => k + 1);

  const switchTab = (t) => { setTab(t); if (t !== "detail") setDetailId(null); };
  const openView  = (id) => { setDetailId(id); setTab("detail"); };

  // Status change from detail view
  const handleStatusChange = async (id, next, setBooking) => {
    try {
      const updated = await api.bookings.updateStatus(id, next);
      setBooking(b => ({ ...b, ...updated }));
      toast(`${id.substring(0,8)}… → ${next}`);
      refresh();
    } catch (e) {
      toast(e.message, "error");
    }
  };

  const TAB_LABELS = {
    list: "Bookings / List",
    calendar: "Bookings / Calendar",
    packages: "Bookings / Packages",
    detail: "Bookings / Detail",
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      <Sidebar tab={tab === "detail" ? "list" : tab} setTab={switchTab}/>

      <div className="ml-56 flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white border-b border-stone-200 h-14 flex items-center justify-between px-7">
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <span>Studio CMS</span><span>›</span>
            <span className="text-stone-700 font-semibold">{TAB_LABELS[tab]}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => toast("Export coming soon")} className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-200 text-stone-600 text-xs rounded-lg hover:bg-stone-50 transition-colors">
              ↓ Export CSV
            </button>
            <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 text-white text-xs font-medium rounded-lg hover:bg-stone-700 transition-all hover:-translate-y-px hover:shadow-md">
              + Create Booking
            </button>
          </div>
        </header>

        {/* Page */}
        <main className="p-7 w-full max-w-[1200px]">
          <div className="mb-6">
            <h1 className="font-display text-3xl font-medium text-stone-800 tracking-tight">Bookings & Services</h1>
            <p className="text-stone-400 text-sm mt-1">Manage studio bookings, packages and calendar availability</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-0.5 border-b border-stone-200 mb-6">
            {[
              { k: "list",     l: "List" },
              { k: "calendar", l: "Calendar" },
              { k: "packages", l: "Packages" },
              ...(detailId ? [{ k: "detail", l: "Detail" }] : []),
            ].map(t => (
              <button key={t.k} onClick={() => switchTab(t.k)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === t.k ? "border-stone-800 text-stone-800" : "border-transparent text-stone-400 hover:text-stone-600"}`}>
                {t.l}
              </button>
            ))}
          </div>

          {tab === "list" && (
            <BookingsListTab
              refreshKey={refreshKey}
              onView={openView}
              onOpenCreate={() => setShowCreate(true)}
              onCancel={id => setCancelId(id)}
              onReschedule={id => setReschedId(id)}
            />
          )}

          {tab === "calendar" && (
            <CalendarTab onView={openView} refreshKey={refreshKey}/>
          )}

          {tab === "packages" && (
            <PackagesTab toast={toast}/>
          )}

          {tab === "detail" && (
            <BookingDetail
              bookingId={detailId}
              onBack={() => switchTab("list")}
              onStatusChange={handleStatusChange}
              onReschedule={id => setReschedId(id)}
              onCancel={id => setCancelId(id)}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <CreateBookingModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={(bk) => { toast(`Booking created ✓`); refresh(); }}
      />
      <RescheduleModal
        open={!!reschedId}
        onClose={() => setReschedId(null)}
        bookingId={reschedId}
        onRescheduled={() => { toast("Rescheduled ✓"); refresh(); if (tab === "detail") openView(detailId); }}
      />
      <CancelModal
        open={!!cancelId}
        onClose={() => setCancelId(null)}
        bookingId={cancelId}
        onCancelled={() => { toast("Booking cancelled"); refresh(); if (tab === "detail") openView(detailId); }}
      />

      <Toasts toasts={toasts}/>
    </div>
  );
}
