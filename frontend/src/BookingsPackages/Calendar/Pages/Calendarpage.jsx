import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { mock } from "../../Shared/lib/mock"; // we can reuse the mock.calendarRange

const STATUS_COLOR = {
  Pending:   "bg-blue-100 text-blue-800 border border-blue-200",
  Confirmed: "bg-green-100 text-green-800 border border-green-200",
  Completed: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  Cancelled: "bg-gray-200 text-gray-700 border border-gray-300",
};

export default function CalendarPage() {
  const nav = useNavigate();
  const [cursor, setCursor] = useState(dayjs()); // current month

  const startOfMonth = useMemo(()=> cursor.startOf("month"), [cursor]);
  const endOfMonth = useMemo(()=> cursor.endOf("month"), [cursor]);

  // Build a 6x7 grid (weeks x days)
  const startGrid = startOfMonth.startOf("week"); // Sunday-start; use .startOf('isoWeek') if you prefer Monday-start
  const days = [...Array(42)].map((_,i)=> startGrid.add(i, "day"));

  // Get events in range
  const events = useMemo(()=>{
    const list = mock.calendarRange(startOfMonth.toISOString(), endOfMonth.toISOString());
    const byDay = {};
    list.forEach(ev => {
      const key = dayjs(ev.start).format("YYYY-MM-DD");
      byDay[key] = byDay[key] || [];
      byDay[key].push(ev);
    });
    return byDay;
  }, [startOfMonth, endOfMonth, cursor]); // refresh when month changes

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl font-bold">Calendar</h2>
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary" onClick={()=>setCursor(c=>c.subtract(1,"month"))}>← Prev</button>
          <div className="font-semibold w-40 text-center">{cursor.format("MMMM YYYY")}</div>
          <button className="btn btn-secondary" onClick={()=>setCursor(c=>c.add(1,"month"))}>Next →</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-[1px] bg-border text-sm">
        {/* Weekday headings */}
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
          <div key={d} className="bg-surface p-2 font-semibold">{d}</div>
        ))}
        {/* Day cells */}
        {days.map(d=>{
          const key = d.format("YYYY-MM-DD");
          const isOtherMonth = d.month() !== cursor.month();
          const dayEvents = events[key] || [];
          return (
            <div key={key} className={`bg-white min-h-[110px] p-2 ${isOtherMonth ? "opacity-40" : ""}`}>
              <div className="text-xs text-muted">{d.date()}</div>
              <div className="space-y-1 mt-1">
                {dayEvents.map(ev=>(
                  <button key={ev.id}
                    className={`w-full text-left px-2 py-1 rounded ${STATUS_COLOR[ev.status]}`}
                    onClick={()=>nav(`/bookings/${ev.id}`)}>
                    <div className="truncate">{ev.title}</div>
                    <div className="text-xs">{dayjs(ev.start).format("HH:mm")}</div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}