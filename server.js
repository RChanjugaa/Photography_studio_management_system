// Studio Ambiance - Event Management Backend
// Developer: S. Vaheesh
// File: server.js

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ─── DB Connection ────────────────────────────────────────────────────────────
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',        // ungada MySQL password itha vei
  database: 'studio_ambiance',
  port: 3307,
});

db.connect((err) => {
  if (err) {
    console.error('DB connection failed:', err.message);
    return;
  }
  console.log('MySQL connected!');
});

// ─── ROUTES ──────────────────────────────────────────────────────────────────

// ✅ CRUD 1: CREATE Event (POST)
app.post('/api/events', (req, res) => {
  const { user_id, event_name, event_type, event_date, location, notes } = req.body;

  if (!event_name || !event_type || !event_date) {
    return res.status(400).json({ status: 'error', message: 'Required fields missing' });
  }

  const sql = `
    INSERT INTO events (user_id, event_name, event_type, event_date, location, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [user_id || 1, event_name, event_type, event_date, location || 'Negombo, Sri Lanka', notes || ''];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ status: 'error', message: err.message });
    res.status(201).json({
      status: 'success',
      message: 'Event created successfully!',
      data: { event_id: result.insertId },
    });
  });
});

// ✅ CRUD 2: READ All Events (GET)
app.get('/api/events', (req, res) => {
  const sql = `SELECT * FROM events ORDER BY created_at DESC`;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ status: 'error', message: err.message });
    res.json({
      status: 'success',
      data: results,
    });
  });
});

// READ Single Event by ID (GET)
app.get('/api/events/:id', (req, res) => {
  const sql = `SELECT * FROM events WHERE event_id = ?`;

  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ status: 'error', message: err.message });
    if (results.length === 0) return res.status(404).json({ status: 'error', message: 'Event not found' });
    res.json({ status: 'success', data: results[0] });
  });
});

// UPDATE Event Status (PUT)
app.put('/api/events/:id/status', (req, res) => {
  const { status } = req.body;
  const sql = `UPDATE events SET status = ? WHERE event_id = ?`;

  db.query(sql, [status, req.params.id], (err) => {
    if (err) return res.status(500).json({ status: 'error', message: err.message });
    res.json({ status: 'success', message: 'Status updated!' });
  });
});

// ASSIGN Photographer (PUT)
app.put('/api/events/:id/photographer', (req, res) => {
  const { photographer } = req.body;
  const sql = `UPDATE events SET photographer = ? WHERE event_id = ?`;

  db.query(sql, [photographer, req.params.id], (err) => {
    if (err) return res.status(500).json({ status: 'error', message: err.message });
    res.json({ status: 'success', message: 'Photographer assigned!' });
  });
});

// DELETE Event (DELETE)
app.delete('/api/events/:id', (req, res) => {
  const sql = `DELETE FROM events WHERE event_id = ?`;

  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ status: 'error', message: err.message });
    res.json({ status: 'success', message: 'Event deleted!' });
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
