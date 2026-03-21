const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const DB_PATH = path.join(__dirname, "shootpro.db");
const db = new sqlite3.Database(DB_PATH);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row || null);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

async function initDB() {
  await run(`PRAGMA foreign_keys = ON`);
  await run(`
    CREATE TABLE IF NOT EXISTS packages (
      id             TEXT PRIMARY KEY,
      type           TEXT NOT NULL,
      title          TEXT NOT NULL,
      base_price     REAL NOT NULL,
      duration_hours REAL NOT NULL,
      description    TEXT DEFAULT '',
      active         INTEGER NOT NULL DEFAULT 1,
      created_at     TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  await run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id                       TEXT PRIMARY KEY,
      client_id                TEXT NOT NULL,
      client_name              TEXT NOT NULL,
      client_email             TEXT DEFAULT '',
      client_phone             TEXT DEFAULT '',
      package_id               TEXT NOT NULL,
      scheduled_start          TEXT NOT NULL,
      scheduled_end            TEXT NOT NULL,
      status                   TEXT NOT NULL DEFAULT 'Pending',
      notes                    TEXT DEFAULT '',
      assigned_photographer_id TEXT DEFAULT '',
      created_at               TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at               TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  await run(`
    CREATE TABLE IF NOT EXISTS audit_log (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id  TEXT NOT NULL,
      action      TEXT NOT NULL,
      old_value   TEXT,
      new_value   TEXT,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  console.log("Database ready:", DB_PATH);
}

function generateId(prefix) {
  return prefix + "-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
}

function mapPackage(row) {
  if (!row) return null;
  return {
    id: row.id, type: row.type, title: row.title,
    basePrice: row.base_price, durationHours: row.duration_hours,
    description: row.description, active: row.active === 1,
    createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

function mapBooking(row) {
  if (!row) return null;
  return {
    id: row.id, clientId: row.client_id, clientName: row.client_name,
    clientEmail: row.client_email, clientPhone: row.client_phone,
    packageId: row.package_id, packageTitle: row.package_title || null,
    packageType: row.package_type || null, basePrice: row.base_price || null,
    durationHours: row.duration_hours || null,
    scheduledStart: row.scheduled_start, scheduledEnd: row.scheduled_end,
    status: row.status, notes: row.notes,
    assignedPhotographerId: row.assigned_photographer_id,
    createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

module.exports = { db, run, get, all, initDB, generateId, mapPackage, mapBooking };
