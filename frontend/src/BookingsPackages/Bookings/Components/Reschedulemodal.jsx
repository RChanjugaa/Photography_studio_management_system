import { useState } from "react";
import Modal from "../../Shared/components/Modal";
import FormField from "../../Shared/components/FormField";

const todayISO = () => new Date().toISOString().slice(0,10);

export default function RescheduleModal({ open, onClose, onConfirm, initial }) {
  const [date, setDate] = useState(initial?.date || todayISO());
  const [time, setTime] = useState(initial?.time || "10:00");

  return (
    <Modal open={open} onClose={onClose} title="Reschedule booking" footer={
      <div className="flex justify-end gap-2">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={()=>onConfirm({ date, time })}>Confirm</button>
      </div>
    }>
      <div className="grid md:grid-cols-2 gap-3">
        <FormField label="Date">
          <input type="date" className="input" min={todayISO()} value={date} onChange={e=>setDate(e.target.value)} />
        </FormField>
        <FormField label="Time">
          <input type="time" className="input" value={time} onChange={e=>setTime(e.target.value)} />
        </FormField>
      </div>
    </Modal>
  );
}