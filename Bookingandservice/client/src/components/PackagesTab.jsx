import { useState, useEffect } from "react";
import { PKG_TYPES, TYPE_TOP, TYPE_BADGE, IC } from "../constants";
import { Empty, Modal, Field, Spinner } from "./UI";
import { api } from "../api";

function PkgModal({ open, onClose, onSaved, editing }) {
  const blank = { title:"", type:"Wedding", basePrice:"", durationHours:"", description:"", active:true };
  const [f, setF] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => { setF(editing ? { ...editing } : blank); setErr(""); }, [editing, open]);
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setErr("");
    if (!f.title?.trim()) { setErr("Title is required"); return; }
    if (!f.basePrice || f.basePrice <= 0) { setErr("Valid price is required"); return; }
    if (!f.durationHours || f.durationHours <= 0) { setErr("Valid duration is required"); return; }
    setSaving(true);
    try {
      const payload = { type: f.type, title: f.title.trim(), basePrice: parseFloat(f.basePrice), durationHours: parseFloat(f.durationHours), description: f.description, active: f.active };
      const result = editing ? await api.packages.update(editing.id, payload) : await api.packages.create(payload);
      onSaved(result, !!editing);
      onClose();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={editing ? "Edit Package" : "New Package"} subtitle="Define service package details"
      footer={<>
        <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors">Cancel</button>
        <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm rounded-lg bg-stone-800 text-white hover:bg-stone-700 transition-colors font-medium disabled:opacity-50">
          {saving ? "Saving…" : "Save Package"}
        </button>
      </>}>
      {err && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{err}</p>}
      <Field label="Title"><input className={IC} value={f.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Wedding Gold"/></Field>
      <Field label="Type">
        <select className={IC} value={f.type} onChange={e => set("type", e.target.value)}>
          {PKG_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Base Price (LKR)"><input className={IC} type="number" value={f.basePrice} onChange={e => set("basePrice", e.target.value)} placeholder="125000"/></Field>
        <Field label="Duration (hrs)"><input className={IC} type="number" value={f.durationHours} onChange={e => set("durationHours", e.target.value)} placeholder="6"/></Field>
      </div>
      <Field label="Description / Inclusions">
        <textarea className={IC + " resize-none"} rows={3} value={f.description} onChange={e => set("description", e.target.value)} placeholder="Coverage details, inclusions…"/>
      </Field>
      <Field label="Active">
        <div className="flex items-center gap-3">
          <button onClick={() => set("active", !f.active)} className={`w-10 h-5 rounded-full relative transition-colors ${f.active ? "bg-teal-500" : "bg-stone-200"}`}>
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${f.active ? "left-5" : "left-0.5"}`}/>
          </button>
          <span className="text-sm text-stone-600">{f.active ? "Visible in booking form" : "Hidden from bookings"}</span>
        </div>
      </Field>
    </Modal>
  );
}

export default function PackagesTab({ toast }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const loadPackages = async () => {
    setLoading(true);
    try { setPackages(await api.packages.getAll()); }
    catch (e) { toast(e.message, "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadPackages(); }, []);

  const handleSaved = (pkg, isEdit) => {
    if (isEdit) {
      setPackages(ps => ps.map(p => p.id === pkg.id ? pkg : p));
      toast("Package updated ✓");
    } else {
      setPackages(ps => [pkg, ...ps]);
      toast("Package created ✓");
    }
  };

  const handleToggle = async (id) => {
    const pkg = packages.find(p => p.id === id);
    try {
      const updated = await api.packages.update(id, { ...pkg, active: !pkg.active });
      setPackages(ps => ps.map(p => p.id === id ? updated : p));
      toast(pkg.active ? "Package archived" : "Package activated");
    } catch (e) { toast(e.message, "error"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this package? This cannot be undone.")) return;
    try {
      await api.packages.delete(id);
      setPackages(ps => ps.filter(p => p.id !== id));
      toast("Package deleted");
    } catch (e) { toast(e.message, "error"); }
  };

  if (loading) return <Spinner/>;

  return (
    <div>
      <div className="flex justify-end mb-5">
        <button onClick={() => { setEditing(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-all hover:-translate-y-px hover:shadow-md">
          + New Package
        </button>
      </div>

      {packages.length === 0
        ? <Empty icon="📦" title="No packages yet" desc="Create your first service package to use in bookings."
            action={<button onClick={() => { setEditing(null); setShowModal(true); }} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">Create Package</button>}/>
        : <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {packages.map(p => (
              <div key={p.id} className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className={`h-1 bg-gradient-to-r ${TYPE_TOP[p.type] || "from-stone-300 to-stone-200"}`}/>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${TYPE_BADGE[p.type]}`}>{p.type}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.active ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-stone-100 text-stone-400 border border-stone-200"}`}>
                      {p.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-medium text-stone-800 mb-1 tracking-tight">{p.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed mb-4 line-clamp-2">{p.description || "No description."}</p>
                  <div className="flex gap-4 py-3 border-t border-b border-stone-100 mb-4">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-0.5">Price</div>
                      <div className="font-bold text-stone-800">LKR {Number(p.basePrice || 0).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-0.5">Duration</div>
                      <div className="font-bold text-stone-800">{p.durationHours}h</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-0.5">ID</div>
                      <div className="text-xs font-mono text-stone-500">{p.id.split("-")[1]}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(p); setShowModal(true); }} className="flex-1 py-1.5 text-sm border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 transition-colors">Edit</button>
                    <button onClick={() => handleToggle(p.id)} className={`py-1.5 px-3 text-sm rounded-lg transition-colors ${p.active ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100" : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"}`}>
                      {p.active ? "Archive" : "Activate"}
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="py-1.5 px-3 text-sm rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
      }

      <PkgModal open={showModal} onClose={() => { setShowModal(false); setEditing(null); }} onSaved={handleSaved} editing={editing}/>
    </div>
  );
}
