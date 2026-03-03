import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Stepper from "../Components/Stepper";
import FormField from "../../Shared/components/FormField";
import useToast from "../../Shared/components/Toast";
import { createBooking, conflictCheck } from "../api";
import { getPackages, searchClients, createClient } from "../../Packages/api";

const steps = ["Client", "Package", "Date/Time", "Summary"];

const todayISO = () => new Date().toISOString().slice(0,10);

export default function NewBooking() {
  const nav = useNavigate();
  const { toast, ToastEl } = useToast();

  // Step state
  const [active, setActive] = useState(0);

  // Client
  const [clientQuery, setClientQuery] = useState("");
  const [clientResults, setClientResults] = useState([]);
  const [client, setClient] = useState({ id:"", name:"", email:"", phone:"" });

  // Package
  const [packages, setPackages] = useState([]);
  const [selectedPkgId, setSelectedPkgId] = useState("");

  // Date/time
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState("10:00");
  const [conflict, setConflict] = useState("");

  // Notes
  const [notes, setNotes] = useState("");

  const selectedPkg = useMemo(() => packages.find(p => p.id === selectedPkgId), [packages, selectedPkgId]);

  // Load packages on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      const pkgs = await getPackages();
      if (!mounted) return;
      setPackages(pkgs || []);
      if (!selectedPkgId && pkgs && pkgs.length) setSelectedPkgId(pkgs[0].id);
    })();
    return () => { mounted = false; };
  }, []);

  // Handlers
  const doSearch = async () => setClientResults(await searchClients(clientQuery));

  const chooseClient = (c) => {
    setClient(c);
    setClientResults([]);
    setClientQuery(c.name);
  };

  const quickCreateClient = async () => {
    if (!client.name?.trim()) { toast("Enter client name"); return; }
    const res = await createClient(client);
    setClient(res);
    toast("Client created");
  };

  const checkConflict = async () => {
    if (!date || !time || !selectedPkg) return;
    const startISO = new Date(`${date}T${time}:00`).toISOString();
    const endISO = new Date(new Date(startISO).getTime() + selectedPkg.durationHours*3600*1000).toISOString();
    const c = await conflictCheck({ start: startISO, end: endISO });
    setConflict(c.conflict ? `Conflicts with: ${c.conflictingIds.join(", ")}` : "");
  };

  const next = async () => {
    // basic validation per step
    if (active === 0) {
      if (!client.id && !client.name) { toast("Select or create a client"); return; }
    }
    if (active === 2) {
      await checkConflict();
      if (conflict) { toast("Resolve conflicts before continuing"); return; }
    }
    setActive(i => Math.min(i+1, steps.length-1));
  };
  const back = () => setActive(i => Math.max(i-1, 0));

  const onSubmit = async () => {
    const startISO = new Date(`${date}T${time}:00`).toISOString();
    const row = await createBooking({
      clientId: client.id || "TEMP",
      clientName: client.name,
      packageId: selectedPkgId,
      scheduledStart: startISO,
      notes
    });
    toast("Booking created");
    setTimeout(()=> nav(`/bookings/${row.id}`), 400);
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-2">Create Booking</h2>
      <Stepper steps={steps} activeIndex={active} />

      {/* Step 1 - Client */}
      {active===0 && (
        <div className="card p-4 space-y-3">
          <div className="grid md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <FormField label="Search existing client" help="Search by name / email / phone">
                <div className="flex gap-2">
                  <input className="input flex-1" value={clientQuery} onChange={e=>setClientQuery(e.target.value)} placeholder="e.g., Asha, +94 77..." />
                  <button className="btn btn-secondary" onClick={doSearch}>Search</button>
                </div>
              </FormField>
              {!!clientResults.length && (
                <div className="card p-2 space-y-1 mt-2">
                  {clientResults.map(c=>(
                    <button key={c.id} className="w-full text-left hover:bg-surface p-2 rounded" onClick={()=>chooseClient(c)}>
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-sm text-muted">{c.email} · {c.phone}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-1">
              <div className="font-semibold mb-1">Quick create client</div>
              <div className="space-y-2">
                <input className="input" placeholder="Full name" value={client.name} onChange={e=>setClient({...client, name:e.target.value})}/>
                <input className="input" placeholder="Email" value={client.email} onChange={e=>setClient({...client, email:e.target.value})}/>
                <input className="input" placeholder="Phone" value={client.phone} onChange={e=>setClient({...client, phone:e.target.value})}/>
                <button className="btn btn-secondary w-full" onClick={quickCreateClient}>Create</button>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button className="btn btn-primary" onClick={next}>Next</button>
          </div>
        </div>
      )}

      {/* Step 2 - Package */}
      {active===1 && (
        <div className="card p-4 space-y-3">
          <div className="grid md:grid-cols-3 gap-2">
            {packages.filter(p=>p.active).map(p=>(
              <label key={p.id} className={`card p-3 cursor-pointer ${p.id===selectedPkgId ? "outline outline-2 outline-primary" : ""}`}>
                <input type="radio" name="pkg" className="hidden" value={p.id} checked={p.id===selectedPkgId} onChange={()=>setSelectedPkgId(p.id)} />
                <div className="text-sm text-muted">{p.type}</div>
                <div className="font-bold">{p.title}</div>
                <div className="text-sm">{p.durationHours} hrs · LKR {p.basePrice.toLocaleString("en-LK")}</div>
                <div className="text-sm text-muted">{p.description}</div>
              </label>
            ))}
          </div>
          <div className="flex justify-between">
            <button className="btn btn-secondary" onClick={back}>Back</button>
            <button className="btn btn-primary" onClick={next}>Next</button>
          </div>
        </div>
      )}

      {/* Step 3 - Date/Time */}
      {active===2 && (
        <div className="card p-4 space-y-3">
          <div className="grid md:grid-cols-3 gap-3">
            <FormField label="Date">
              <input type="date" className="input" min={todayISO()} value={date} onChange={e=>setDate(e.target.value)} />
            </FormField>
            <FormField label="Time">
              <input type="time" className="input" value={time} onChange={e=>setTime(e.target.value)} />
            </FormField>
            <FormField label="Notes (optional)">
              <input className="input" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Any internal notes" />
            </FormField>
          </div>
          {!!conflict && <div className="error">{conflict}</div>}
          <div className="flex justify-between">
            <button className="btn btn-secondary" onClick={back}>Back</button>
            <button className="btn btn-primary" onClick={async ()=>{ await checkConflict(); if (!conflict) next(); }}>Next</button>
          </div>
        </div>
      )}

      {/* Step 4 - Summary */}
      {active===3 && (
        <div className="card p-4 space-y-2">
          <div><strong>Client:</strong> {client.name}</div>
          <div><strong>Package:</strong> {selectedPkg?.title} ({selectedPkg?.durationHours} hrs)</div>
          <div><strong>Date/Time:</strong> {date} {time}</div>
          {notes && <div><strong>Notes:</strong> {notes}</div>}
          <div className="flex justify-between mt-3">
            <button className="btn btn-secondary" onClick={back}>Back</button>
            <button className="btn btn-primary" onClick={onSubmit}>Create Booking</button>
          </div>
        </div>
      )}

      {ToastEl}
    </section>
  );
}