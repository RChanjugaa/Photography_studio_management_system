import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { getBooking, rescheduleBooking, setBookingStatus, updateBooking } from "../api";
import { getPackages } from "../../Packages/api";
import StatusBadge from "../Components/StatusBadge";
import RescheduleModal from "../Components/Reschedulemodal";
import useToast from "../../Shared/components/Toast";

export default function BookingDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { toast, ToastEl } = useToast();

  const [data, setData] = useState(null);
  const [pkgs] = useState(getPackages());
  const [openRes, setOpenRes] = useState(false);

  useEffect(()=> {
    let mounted = true;
    (async () => {
      try {
        const d = await getBooking(id);
        if (!mounted) return;
        setData(d);
      } catch {
        if (mounted) nav("/bookings");
      }
    })();
    return () => { mounted = false; };
  }, [id, nav]);

  if (!data) return <div className="card p-4">Loading…</div>;

  const doStatus = async (status) => {
    // Allowed transitions: Pending→Confirmed→Completed; Pending/Confirmed→Cancelled
    const allowed = {
      Pending: ["Confirmed","Cancelled"],
      Confirmed: ["Completed","Cancelled"],
      Completed: [],
      Cancelled: [],
    };
    if (!allowed[data.status].includes(status)) { toast("Transition not allowed"); return; }
    const updated = await setBookingStatus(data.id, status);
    setData(updated);
    toast(`Status → ${status}`);
  };

  const changePackage = async (packageId) => {
    const updated = await updateBooking(data.id, { packageId, packageTitle: pkgs.find(p=>p.id===packageId)?.title || data.packageTitle });
    setData(updated);
    toast("Package updated");
  };

  const confirmReschedule = async ({ date, time }) => {
    const startISO = new Date(`${date}T${time}:00`).toISOString();
    const updated = await rescheduleBooking(data.id, startISO);
    setData(updated);
    setOpenRes(false);
    toast("Rescheduled");
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Booking {data.id}</h2>
        <div className="flex items-center gap-2">
          <StatusBadge status={data.status} />
          {data.status==="Pending" && <button className="btn btn-primary" onClick={()=>doStatus("Confirmed")}>Confirm</button>}
          {data.status==="Confirmed" && <button className="btn btn-primary" onClick={()=>doStatus("Completed")}>Mark Completed</button>}
          {(data.status==="Pending" || data.status==="Confirmed") && <button className="btn btn-secondary" onClick={()=>doStatus("Cancelled")}>Cancel</button>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {/* Client */}
        <div className="card p-4 space-y-1">
          <div className="font-bold text-lg">Client</div>
          <div>{data.clientName}</div>
        </div>

        {/* Package */}
        <div className="card p-4 space-y-2">
          <div className="font-bold text-lg">Package</div>
          <div className="text-sm text-muted">Current: {data.packageTitle}</div>
          <select className="input" value={data.packageId} onChange={e=>changePackage(e.target.value)}>
            {pkgs.map(p=> <option key={p.id} value={p.id}>{p.title} · {p.durationHours} hrs</option>)}
          </select>
        </div>

        {/* Schedule */}
        <div className="card p-4 space-y-2">
          <div className="font-bold text-lg">Schedule</div>
          <div>{dayjs(data.scheduledStart).format("YYYY-MM-DD HH:mm")} → {dayjs(data.scheduledEnd).format("HH:mm")}</div>
          <button className="btn btn-secondary" onClick={()=>setOpenRes(true)}>Reschedule</button>
        </div>

        {/* Notes */}
        <div className="card p-4 space-y-2">
          <div className="font-bold text-lg">Notes</div>
          <textarea className="input" rows={4} value={data.notes} onChange={async e=>{
            const updated = await updateBooking(data.id, { notes: e.target.value });
            setData(updated);
          }} />
        </div>
      </div>

      <RescheduleModal
        open={openRes}
        onClose={()=>setOpenRes(false)}
        onConfirm={confirmReschedule}
        initial={{ date: dayjs(data.scheduledStart).format("YYYY-MM-DD"), time: dayjs(data.scheduledStart).format("HH:mm") }}
      />
      {ToastEl}
    </section>
  );
}