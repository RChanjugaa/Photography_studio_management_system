import { useState } from "react";
import FormField from "./shared/components/FormField";

export default function PackageForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || {
    title: "", type: "Wedding", durationHours: 1, basePrice: 0, description: "", active: true
  });

  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <FormField label="Title">
          <input className="input" value={form.title} onChange={e=>setForm({ ...form, title: e.target.value })}/>
        </FormField>
        <FormField label="Type">
          <select className="input" value={form.type} onChange={e=>setForm({ ...form, type: e.target.value })}>
            <option>Wedding</option><option>Event</option><option>Studio</option><option>Outdoor</option>
          </select>
        </FormField>
        <FormField label="Duration (hours)">
          <input type="number" min={1} className="input" value={form.durationHours} onChange={e=>setForm({ ...form, durationHours: Number(e.target.value) })}/>
        </FormField>
        <FormField label="Base Price (LKR)">
          <input type="number" min={0} className="input" value={form.basePrice} onChange={e=>setForm({ ...form, basePrice: Number(e.target.value) })}/>
        </FormField>
        <div className="md:col-span-2">
          <FormField label="Description (optional)">
            <textarea className="input" rows={3} value={form.description} onChange={e=>setForm({ ...form, description: e.target.value })}/>
          </FormField>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.active} onChange={e=>setForm({ ...form, active: e.target.checked })}/>
          <span className="text-sm">Active</span>
        </label>
        <div className="flex gap-2">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>onSubmit(form)}>Save</button>
        </div>
      </div>
    </div>
  );
}
``