import { useState } from "react";
import { createPackage, getPackages, updatePackage } from "./api";
import PackageForm from "./PackageForm";
import PackageCard from "./components/PackageCard";
import Modal from "./shared/components/Modal";
import useToast from "./shared/components/Toast";

export default function PackageList() {
  const { toast, ToastEl } = useToast();
  const [items, setItems] = useState(getPackages());
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openNew = () => { setEditing(null); setOpen(true); };
  const openEdit = (item) => { setEditing(item); setOpen(true); };

  const refresh = () => setItems(getPackages());

  const onSave = async (form) => {
    if (editing) await updatePackage(editing.id, form); else await createPackage(form);
    setOpen(false); refresh(); toast("Saved");
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl font-bold">Packages</h2>
        <button className="btn btn-primary" onClick={openNew}>+ New Package</button>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {items.map(item => <PackageCard key={item.id} item={item} onEdit={openEdit} />)}
      </div>

      <Modal open={open} onClose={()=>setOpen(false)} title={editing ? "Edit Package" : "New Package"}
        footer={null}>
        <PackageForm
          initial={editing || undefined}
          onSubmit={onSave}
          onCancel={()=>setOpen(false)}
        />
      </Modal>

      {ToastEl}
    </section>
  );
}