export default function PackageCard({ item, onEdit }) {
  return (
    <div className="card p-4 space-y-1">
      <div className="text-sm text-muted">{item.type}</div>
      <div className="text-lg font-bold">{item.title}</div>
      <div className="text-sm">{item.durationHours} hrs · LKR {item.basePrice.toLocaleString("en-LK")}</div>
      {item.description && <div className="text-sm text-muted">{item.description}</div>}
      <div className="text-sm">{item.active ? "Active" : "Inactive"}</div>
      <div className="pt-2">
        <button className="btn btn-secondary" onClick={()=>onEdit(item)}>Edit</button>
      </div>
    </div>
  );
}