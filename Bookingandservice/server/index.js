const express = require("express");
const cors = require("cors");
const { run, get, all, initDB, generateId, mapPackage, mapBooking } = require("./db");

const app = express();
const PORT = 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const ALLOWED_TRANSITIONS = {
  Pending:   ["Confirmed", "Cancelled"],
  Confirmed: ["Completed", "Cancelled"],
  Completed: [],
  Cancelled: [],
};

// ── PACKAGES ──────────────────────────────────────────────────────────────────

// GET all packages
app.get("/api/packages", async (req, res) => {
  try {
    const rows = await all("SELECT * FROM packages ORDER BY created_at DESC");
    res.json(rows.map(mapPackage));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET one package
app.get("/api/packages/:id", async (req, res) => {
  try {
    const row = await get("SELECT * FROM packages WHERE id = ?", [req.params.id]);
    if (!row) return res.status(404).json({ error: "Package not found" });
    res.json(mapPackage(row));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST create package
app.post("/api/packages", async (req, res) => {
  try {
    const { type, title, basePrice, durationHours, description, active } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: "Title is required" });
    if (!type) return res.status(400).json({ error: "Type is required" });
    if (!basePrice || basePrice < 0) return res.status(400).json({ error: "Valid base price is required" });
    if (!durationHours || durationHours <= 0) return res.status(400).json({ error: "Valid duration is required" });

    const id = generateId("PKG");
    await run(
      `INSERT INTO packages (id, type, title, base_price, duration_hours, description, active)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, type, title.trim(), parseFloat(basePrice), parseFloat(durationHours), description || "", active !== false ? 1 : 0]
    );
    const created = await get("SELECT * FROM packages WHERE id = ?", [id]);
    res.status(201).json(mapPackage(created));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update package
app.put("/api/packages/:id", async (req, res) => {
  try {
    const existing = await get("SELECT * FROM packages WHERE id = ?", [req.params.id]);
    if (!existing) return res.status(404).json({ error: "Package not found" });

    const { type, title, basePrice, durationHours, description, active } = req.body;
    await run(
      `UPDATE packages SET type=?, title=?, base_price=?, duration_hours=?, description=?, active=?, updated_at=datetime('now') WHERE id=?`,
      [
        type || existing.type,
        title?.trim() || existing.title,
        basePrice !== undefined ? parseFloat(basePrice) : existing.base_price,
        durationHours !== undefined ? parseFloat(durationHours) : existing.duration_hours,
        description !== undefined ? description : existing.description,
        active !== undefined ? (active ? 1 : 0) : existing.active,
        req.params.id,
      ]
    );
    const updated = await get("SELECT * FROM packages WHERE id = ?", [req.params.id]);
    res.json(mapPackage(updated));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE package
app.delete("/api/packages/:id", async (req, res) => {
  try {
    const existing = await get("SELECT * FROM packages WHERE id = ?", [req.params.id]);
    if (!existing) return res.status(404).json({ error: "Package not found" });
    await run("DELETE FROM packages WHERE id = ?", [req.params.id]);
    res.json({ message: "Package deleted", id: req.params.id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── BOOKINGS ──────────────────────────────────────────────────────────────────

// GET all bookings with filters
app.get("/api/bookings", async (req, res) => {
  try {
    const { status = "", type = "", dateFrom = "", dateTo = "", search = "" } = req.query;
    let sql = `
      SELECT b.*, p.title as package_title, p.type as package_type, p.base_price, p.duration_hours
      FROM bookings b LEFT JOIN packages p ON b.package_id = p.id
      WHERE 1=1
    `;
    const params = [];
    if (status)   { sql += " AND b.status = ?";              params.push(status); }
    if (type)     { sql += " AND p.type = ?";                params.push(type); }
    if (dateFrom) { sql += " AND date(b.scheduled_start) >= ?"; params.push(dateFrom); }
    if (dateTo)   { sql += " AND date(b.scheduled_start) <= ?"; params.push(dateTo); }
    if (search)   { sql += " AND (LOWER(b.client_name) LIKE ? OR LOWER(b.id) LIKE ?)"; params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`); }
    sql += " ORDER BY b.created_at DESC";
    const rows = await all(sql, params);
    res.json(rows.map(mapBooking));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET one booking + audit log
app.get("/api/bookings/:id", async (req, res) => {
  try {
    const row = await get(
      `SELECT b.*, p.title as package_title, p.type as package_type, p.base_price, p.duration_hours
       FROM bookings b LEFT JOIN packages p ON b.package_id = p.id WHERE b.id = ?`,
      [req.params.id]
    );
    if (!row) return res.status(404).json({ error: "Booking not found" });
    const audit = await all("SELECT * FROM audit_log WHERE booking_id = ? ORDER BY created_at DESC LIMIT 10", [req.params.id]);
    res.json({ ...mapBooking(row), auditLog: audit });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST create booking
app.post("/api/bookings", async (req, res) => {
  try {
    const { clientId, clientName, clientEmail, clientPhone, packageId, scheduledStart, notes, assignedPhotographerId } = req.body;
    if (!clientName?.trim()) return res.status(400).json({ error: "Client name is required" });
    if (!packageId) return res.status(400).json({ error: "Package is required" });
    if (!scheduledStart) return res.status(400).json({ error: "Start time is required" });

    const pkg = await get("SELECT * FROM packages WHERE id = ?", [packageId]);
    if (!pkg) return res.status(400).json({ error: "Package not found" });

    const start = new Date(scheduledStart);
    const end = new Date(start.getTime() + pkg.duration_hours * 3600000);

    // Conflict check
    const conflict = await get(
      `SELECT id FROM bookings WHERE status != 'Cancelled' AND scheduled_start < ? AND scheduled_end > ? LIMIT 1`,
      [end.toISOString(), start.toISOString()]
    );
    if (conflict) return res.status(409).json({ error: "Time slot conflict detected", conflictingId: conflict.id });

    const id = generateId("BK");
    await run(
      `INSERT INTO bookings (id, client_id, client_name, client_email, client_phone, package_id, scheduled_start, scheduled_end, status, notes, assigned_photographer_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?)`,
      [id, clientId || generateId("CL"), clientName.trim(), clientEmail || "", clientPhone || "", packageId, start.toISOString(), end.toISOString(), notes || "", assignedPhotographerId || ""]
    );
    await run("INSERT INTO audit_log (booking_id, action, old_value, new_value) VALUES (?, 'CREATED', null, 'Pending')", [id]);

    const created = await get(
      `SELECT b.*, p.title as package_title, p.type as package_type, p.base_price, p.duration_hours
       FROM bookings b LEFT JOIN packages p ON b.package_id = p.id WHERE b.id = ?`, [id]
    );
    res.status(201).json(mapBooking(created));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update booking details
app.put("/api/bookings/:id", async (req, res) => {
  try {
    const existing = await get("SELECT * FROM bookings WHERE id = ?", [req.params.id]);
    if (!existing) return res.status(404).json({ error: "Booking not found" });

    const { clientName, clientEmail, clientPhone, packageId, scheduledStart, scheduledEnd, notes, assignedPhotographerId } = req.body;
    await run(
      `UPDATE bookings SET client_name=?, client_email=?, client_phone=?, package_id=?, scheduled_start=?, scheduled_end=?, notes=?, assigned_photographer_id=?, updated_at=datetime('now') WHERE id=?`,
      [
        clientName?.trim() || existing.client_name,
        clientEmail !== undefined ? clientEmail : existing.client_email,
        clientPhone !== undefined ? clientPhone : existing.client_phone,
        packageId || existing.package_id,
        scheduledStart || existing.scheduled_start,
        scheduledEnd || existing.scheduled_end,
        notes !== undefined ? notes : existing.notes,
        assignedPhotographerId !== undefined ? assignedPhotographerId : existing.assigned_photographer_id,
        req.params.id,
      ]
    );
    await run("INSERT INTO audit_log (booking_id, action, old_value, new_value) VALUES (?, 'UPDATED', null, 'details updated')", [req.params.id]);
    const updated = await get(
      `SELECT b.*, p.title as package_title, p.type as package_type, p.base_price, p.duration_hours
       FROM bookings b LEFT JOIN packages p ON b.package_id = p.id WHERE b.id = ?`, [req.params.id]
    );
    res.json(mapBooking(updated));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update status
app.put("/api/bookings/:id/status", async (req, res) => {
  try {
    const existing = await get("SELECT * FROM bookings WHERE id = ?", [req.params.id]);
    if (!existing) return res.status(404).json({ error: "Booking not found" });

    const { status } = req.body;
    const allowed = ALLOWED_TRANSITIONS[existing.status] || [];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `Invalid transition: ${existing.status} → ${status}`, allowedTransitions: allowed });
    }
    await run("UPDATE bookings SET status=?, updated_at=datetime('now') WHERE id=?", [status, req.params.id]);
    await run("INSERT INTO audit_log (booking_id, action, old_value, new_value) VALUES (?, 'STATUS_CHANGE', ?, ?)", [req.params.id, existing.status, status]);

    const updated = await get(
      `SELECT b.*, p.title as package_title, p.type as package_type, p.base_price, p.duration_hours
       FROM bookings b LEFT JOIN packages p ON b.package_id = p.id WHERE b.id = ?`, [req.params.id]
    );
    res.json(mapBooking(updated));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT reschedule
app.put("/api/bookings/:id/reschedule", async (req, res) => {
  try {
    const existing = await get("SELECT * FROM bookings WHERE id = ?", [req.params.id]);
    if (!existing) return res.status(404).json({ error: "Booking not found" });
    if (existing.status === "Completed" || existing.status === "Cancelled") {
      return res.status(400).json({ error: "Cannot reschedule a Completed or Cancelled booking" });
    }
    const { scheduledStart } = req.body;
    if (!scheduledStart) return res.status(400).json({ error: "New start time is required" });

    const pkg = await get("SELECT * FROM packages WHERE id = ?", [existing.package_id]);
    const start = new Date(scheduledStart);
    const end = new Date(start.getTime() + pkg.duration_hours * 3600000);

    const conflict = await get(
      `SELECT id FROM bookings WHERE id != ? AND status != 'Cancelled' AND scheduled_start < ? AND scheduled_end > ? LIMIT 1`,
      [req.params.id, end.toISOString(), start.toISOString()]
    );
    if (conflict) return res.status(409).json({ error: "Time slot conflict detected", conflictingId: conflict.id });

    await run("UPDATE bookings SET scheduled_start=?, scheduled_end=?, updated_at=datetime('now') WHERE id=?", [start.toISOString(), end.toISOString(), req.params.id]);
    await run("INSERT INTO audit_log (booking_id, action, old_value, new_value) VALUES (?, 'RESCHEDULED', ?, ?)", [req.params.id, existing.scheduled_start, start.toISOString()]);

    const updated = await get(
      `SELECT b.*, p.title as package_title, p.type as package_type, p.base_price, p.duration_hours
       FROM bookings b LEFT JOIN packages p ON b.package_id = p.id WHERE b.id = ?`, [req.params.id]
    );
    res.json(mapBooking(updated));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE booking
app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const existing = await get("SELECT * FROM bookings WHERE id = ?", [req.params.id]);
    if (!existing) return res.status(404).json({ error: "Booking not found" });
    await run("DELETE FROM bookings WHERE id = ?", [req.params.id]);
    res.json({ message: "Booking deleted", id: req.params.id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST conflict check
app.post("/api/bookings/conflict-check", async (req, res) => {
  try {
    const { start, end, excludeId = "" } = req.body;
    if (!start || !end) return res.status(400).json({ error: "start and end required" });
    let sql = `SELECT id FROM bookings WHERE status != 'Cancelled' AND scheduled_start < ? AND scheduled_end > ?`;
    const params = [end, start];
    if (excludeId) { sql += " AND id != ?"; params.push(excludeId); }
    sql += " LIMIT 1";
    const conflict = await get(sql, params);
    res.json({ conflict: !!conflict, conflictingId: conflict?.id || null });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET calendar
app.get("/api/calendar", async (req, res) => {
  try {
    const rows = await all(
      `SELECT b.*, p.title as package_title, p.type as package_type, p.base_price, p.duration_hours
       FROM bookings b LEFT JOIN packages p ON b.package_id = p.id ORDER BY b.scheduled_start ASC`
    );
    res.json(rows.map(mapBooking));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

// ── START ─────────────────────────────────────────────────────────────────────
initDB().then(() => {
  app.listen(PORT, () => {
    console.log("\n✅ ShootPro API running at http://localhost:" + PORT);
    console.log("   Frontend:  http://localhost:5173\n");
  });
}).catch(err => {
  console.error("DB init failed:", err);
  process.exit(1);
});
