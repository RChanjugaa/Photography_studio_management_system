// Studio Ambiance - Event Management Page
// Developer: S. Vaheesh
// File: src/pages/EventManagement.jsx

import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const CATEGORIES = [
  { type: "Wedding",      color: "#FCE4EC", text: "#880E4F", icon: "💍", desc: "Weddings & Engagements" },
  { type: "Birthday",     color: "#EDE7F6", text: "#4527A0", icon: "🎂", desc: "Birthday Celebrations" },
  { type: "Corporate",    color: "#E3F2FD", text: "#0D47A1", icon: "🏢", desc: "Corporate Events" },
  { type: "Cultural Event", color: "#FBE9E7", text: "#BF360C", icon: "🎊", desc: "Cultural Occasions" },
  { type: "Other Events", color: "#E8F5E9", text: "#1B5E20", icon: "📸", desc: "All Other Events" },
];

const STATUS_COLORS = {
  Upcoming:  { bg: "#EDE7F6", text: "#4527A0" },
  Scheduled: { bg: "#E3F2FD", text: "#0D47A1" },
  Ongoing:   { bg: "#FFF9C4", text: "#F57F17" },
  Completed: { bg: "#E8F5E9", text: "#1B5E20" },
  Cancelled: { bg: "#FFEBEE", text: "#B71C1C" },
};

const PHOTOGRAPHERS = ["Abisheka P.", "Anchuga S.", "Abishek R.", "Thiviyanath M.", "Chanjugaa R.", "Vaheesh S."];

const ghostBtn = { padding: "6px 14px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", color: "#444", fontSize: 13, cursor: "pointer", fontFamily: "inherit" };
const primaryBtn = { padding: "8px 18px", borderRadius: 8, border: "none", background: "#7B1FA2", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" };
const inputStyle = { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" };

function Badge({ status }) {
  const c = STATUS_COLORS[status] || { bg: "#F5F5F5", text: "#555" };
  return <span style={{ background: c.bg, color: c.text, padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{status}</span>;
}

export default function EventManagement() {
  const [events, setEvents]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [filterType, setFilterType]   = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [drawerTab, setDrawerTab]     = useState("details");
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast]             = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [newEvent, setNewEvent]       = useState({ event_name: "", event_type: "Wedding", event_date: "", location: "", notes: "" });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  // CRUD 2: READ - Get all events from backend
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/events`);
      setEvents(res.data.data);
    } catch (err) {
      showToast("Error fetching events!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  // CRUD 1: CREATE - Add new event to backend
  const handleCreate = async () => {
    if (!newEvent.event_name || !newEvent.event_date) { showToast("Fill required fields!"); return; }
    try {
      setSubmitting(true);
      await axios.post(`${API}/events`, { ...newEvent, user_id: 1 });
      showToast("Event created!");
      setShowAddModal(false);
      setNewEvent({ event_name: "", event_type: "Wedding", event_date: "", location: "", notes: "" });
      fetchEvents();
    } catch { showToast("Error creating event!"); }
    finally { setSubmitting(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/events/${id}/status`, { status });
      setSelectedEvent(p => ({ ...p, status }));
      setEvents(p => p.map(e => e.event_id === id ? { ...e, status } : e));
      showToast("Status updated!");
    } catch { showToast("Error!"); }
  };

  const assignPhotographer = async (id, photographer) => {
    try {
      await axios.put(`${API}/events/${id}/photographer`, { photographer });
      setSelectedEvent(p => ({ ...p, photographer }));
      setEvents(p => p.map(e => e.event_id === id ? { ...e, photographer } : e));
      showToast("Photographer assigned!");
    } catch { showToast("Error!"); }
  };

  const deleteEvent = async (id) => {
    try {
      await axios.delete(`${API}/events/${id}`);
      setEvents(p => p.filter(e => e.event_id !== id));
      if (selectedEvent?.event_id === id) setSelectedEvent(null);
      showToast("Event deleted!");
    } catch { showToast("Error!"); }
  };

  const filtered = events.filter(e => {
    const mt = filterType === "All" || e.event_type === filterType;
    const ms = e.event_name?.toLowerCase().includes(search.toLowerCase()) || e.event_id?.toString().includes(search);
    return mt && ms;
  });

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#FAFAFA", minHeight: "100vh", padding: "32px 28px" }}>
      {toast && <div style={{ position: "fixed", bottom: 24, right: 24, background: "#1B1B1B", color: "#fff", padding: "10px 20px", borderRadius: 10, fontSize: 13, zIndex: 9999 }}>{toast}</div>}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1A1A1A", margin: 0 }}>Event Management</h1>
          <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Studio Ambiance · S. Vaheesh</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={primaryBtn}>+ Add New Event</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 28 }}>
        {CATEGORIES.map(cat => (
          <div key={cat.type} onClick={() => setFilterType(filterType === cat.type ? "All" : cat.type)}
            style={{ background: filterType === cat.type ? cat.color : "#fff", border: filterType === cat.type ? `2px solid ${cat.text}33` : "1px solid #EEE", borderRadius: 12, padding: "14px 16px", cursor: "pointer", transition: "all 0.2s" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{cat.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: cat.text }}>{cat.type}</div>
            <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{cat.desc}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: cat.text, marginTop: 6 }}>{events.filter(e => e.event_type === cat.type).length}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events..." style={{ ...inputStyle, maxWidth: 340 }} />
        <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ ...inputStyle, maxWidth: 180 }}>
          <option value="All">All Types</option>
          {CATEGORIES.map(c => <option key={c.type}>{c.type}</option>)}
        </select>
        <span style={{ fontSize: 13, color: "#888", alignSelf: "center" }}>{filtered.length} events</span>
      </div>

      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EEE", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        {loading ? <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>Loading events...</div> : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#FAFAFA", borderBottom: "1px solid #EEE" }}>
                {["ID", "Event Name", "Type", "Date", "Photographer", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#666" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", padding: 32, color: "#aaa" }}>No events found</td></tr>}
              {filtered.map(ev => {
                const cat = CATEGORIES.find(c => c.type === ev.event_type);
                return (
                  <tr key={ev.event_id} style={{ borderBottom: "1px solid #F5F5F5" }}>
                    <td style={{ padding: "12px 16px", color: "#888", fontFamily: "monospace", fontSize: 12 }}>#{ev.event_id}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 600 }}>{ev.event_name}</td>
                    <td style={{ padding: "12px 16px" }}><span style={{ background: cat?.color, color: cat?.text, padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600 }}>{cat?.icon} {ev.event_type}</span></td>
                    <td style={{ padding: "12px 16px", color: "#555" }}>{ev.event_date?.split("T")[0]}</td>
                    <td style={{ padding: "12px 16px", color: ev.photographer ? "#333" : "#bbb" }}>{ev.photographer || "Unassigned"}</td>
                    <td style={{ padding: "12px 16px" }}><Badge status={ev.status} /></td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => { setSelectedEvent(ev); setDrawerTab("details"); }} style={{ ...ghostBtn, fontSize: 12, padding: "4px 10px" }}>View</button>
                        <button onClick={() => deleteEvent(ev.event_id)} style={{ ...ghostBtn, fontSize: 12, padding: "4px 10px", color: "#c62828", borderColor: "#ffcdd2" }}>Del</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {selectedEvent && (
        <div style={{ position: "fixed", top: 0, right: 0, width: 460, height: "100vh", background: "#fff", boxShadow: "-4px 0 32px rgba(0,0,0,0.1)", zIndex: 200, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #EEE", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#fff" }}>
            <div><div style={{ fontSize: 11, color: "#888" }}>#{selectedEvent.event_id}</div><div style={{ fontSize: 17, fontWeight: 700 }}>{selectedEvent.event_name}</div></div>
            <button onClick={() => setSelectedEvent(null)} style={{ ...ghostBtn, fontSize: 18, padding: "2px 10px" }}>×</button>
          </div>
          <div style={{ display: "flex", borderBottom: "1px solid #EEE", paddingLeft: 24 }}>
            {["details", "assign", "status"].map(tab => (
              <button key={tab} onClick={() => setDrawerTab(tab)} style={{ padding: "10px 16px", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: drawerTab === tab ? 700 : 400, color: drawerTab === tab ? "#7B1FA2" : "#888", borderBottom: drawerTab === tab ? "2px solid #7B1FA2" : "2px solid transparent", textTransform: "capitalize", fontFamily: "inherit" }}>{tab}</button>
            ))}
          </div>
          <div style={{ padding: 24, flex: 1 }}>
            {drawerTab === "details" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[["Event Type", selectedEvent.event_type], ["Event Date", selectedEvent.event_date?.split("T")[0]], ["Location", selectedEvent.location || "Negombo, Sri Lanka"], ["Photographer", selectedEvent.photographer || "Not assigned"], ["Notes", selectedEvent.notes]].map(([label, val]) => (
                  <div key={label}><div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{label}</div><div style={{ fontSize: 14, color: "#1A1A1A" }}>{val || "-"}</div></div>
                ))}
                <div><div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>Status</div><Badge status={selectedEvent.status} /></div>
              </div>
            )}
            {drawerTab === "assign" && (
              <div>
                <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>Select a photographer.</p>
                {PHOTOGRAPHERS.map(ph => (
                  <div key={ph} onClick={() => assignPhotographer(selectedEvent.event_id, ph)} style={{ padding: "12px 16px", border: selectedEvent.photographer === ph ? "2px solid #7B1FA2" : "1px solid #EEE", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, background: selectedEvent.photographer === ph ? "#F3E5F5" : "#fff", marginBottom: 8, transition: "all 0.15s" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#EDE7F6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#7B1FA2", fontSize: 13 }}>{ph.split(" ").map(n => n[0]).join("")}</div>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{ph}</span>
                    {selectedEvent.photographer === ph && <span style={{ marginLeft: "auto", color: "#7B1FA2", fontWeight: 700 }}>✓</span>}
                  </div>
                ))}
              </div>
            )}
            {drawerTab === "status" && (
              <div>
                <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>Update event status.</p>
                <div style={{ marginBottom: 16 }}><Badge status={selectedEvent.status} /></div>
                {Object.keys(STATUS_COLORS).map(s => {
                  const c = STATUS_COLORS[s];
                  return (
                    <div key={s} onClick={() => updateStatus(selectedEvent.event_id, s)} style={{ padding: "12px 16px", borderRadius: 10, cursor: "pointer", marginBottom: 8, background: selectedEvent.status === s ? c.bg : "#fff", border: selectedEvent.status === s ? `2px solid ${c.text}44` : "1px solid #EEE", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.15s" }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: c.text }}>{s}</span>
                      {selectedEvent.status === s && <span style={{ color: c.text, fontWeight: 700 }}>✓</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 440, boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Add New Event</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div><label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Event Name *</label><input value={newEvent.event_name} onChange={e => setNewEvent(p => ({ ...p, event_name: e.target.value }))} placeholder="e.g. Silva Wedding" style={inputStyle} /></div>
              <div><label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Event Type *</label><select value={newEvent.event_type} onChange={e => setNewEvent(p => ({ ...p, event_type: e.target.value }))} style={inputStyle}>{CATEGORIES.map(c => <option key={c.type}>{c.type}</option>)}</select></div>
              <div><label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Event Date *</label><input type="date" value={newEvent.event_date} onChange={e => setNewEvent(p => ({ ...p, event_date: e.target.value }))} style={inputStyle} /></div>
              <div><label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Location</label><input value={newEvent.location} onChange={e => setNewEvent(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Negombo Beach" style={inputStyle} /></div>
              <div><label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Notes</label><textarea value={newEvent.notes} onChange={e => setNewEvent(p => ({ ...p, notes: e.target.value }))} rows={3} style={{ ...inputStyle, resize: "vertical" }} /></div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
              <button onClick={() => setShowAddModal(false)} style={ghostBtn}>Cancel</button>
              <button onClick={handleCreate} disabled={submitting} style={{ ...primaryBtn, opacity: submitting ? 0.7 : 1 }}>{submitting ? "Creating..." : "Create Event"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
