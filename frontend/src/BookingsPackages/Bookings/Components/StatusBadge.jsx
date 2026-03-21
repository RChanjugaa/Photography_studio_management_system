export default function StatusBadge({ status }) {
  const cls = {
    Pending:   "badge badge-pending",
    Confirmed: "badge badge-confirmed",
    Completed: "badge badge-completed",
    Cancelled: "badge badge-cancelled",
  }[status] || "badge";
  return <span className={cls}>{status}</span>;
}