const express = require('express');
const { getPool } = require('../db');

// Helper to get pool instance
const getDBPool = () => getPool();

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const connection = await getDBPool().getConnection();
    const [events] = await connection.execute(`
      SELECT e.*, c.first_name, c.last_name, c.email 
      FROM events e
      LEFT JOIN clients c ON e.client_id = c.id
      ORDER BY e.event_date DESC
    `);
    connection.release();

    // Parse JSON fields
    const parsedEvents = events.map(event => ({
      ...event,
      assigned_employees: event.assigned_employees ? JSON.parse(event.assigned_employees) : []
    }));

    res.json({
      success: true,
      data: parsedEvents,
      total: parsedEvents.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getDBPool().getConnection();
    const [rows] = await connection.execute(
      `SELECT e.*, c.first_name, c.last_name, c.email 
       FROM events e
       LEFT JOIN clients c ON e.client_id = c.id
       WHERE e.id = ?`,
      [id]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const event = rows[0];
    event.assigned_employees = event.assigned_employees ? JSON.parse(event.assigned_employees) : [];

    res.json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create event
router.post('/', async (req, res) => {
  try {
    const {
      eventType, eventName, description, eventDate, eventTime,
      location, clientId, assignedEmployees, budget
    } = req.body;

    if (!eventType || !eventName || !eventDate) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const connection = await getDBPool().getConnection();
    const [result] = await connection.execute(
      `INSERT INTO events (
        event_type, event_name, description, event_date, event_time,
        location, client_id, assigned_employees, budget
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        eventType, eventName, description || null, eventDate, eventTime || null,
        location || null, clientId || null, JSON.stringify(assignedEmployees || []),
        budget || null
      ]
    );
    connection.release();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { id: result.insertId }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      eventType, eventName, description, eventDate, eventTime,
      location, status, assignedEmployees, budget
    } = req.body;

    const connection = await getDBPool().getConnection();
    await connection.execute(
      `UPDATE events SET 
        event_type = ?, event_name = ?, description = ?, event_date = ?,
        event_time = ?, location = ?, status = ?, assigned_employees = ?, budget = ?
       WHERE id = ?`,
      [
        eventType, eventName, description, eventDate, eventTime,
        location, status, JSON.stringify(assignedEmployees || []), budget, id
      ]
    );
    connection.release();

    res.json({
      success: true,
      message: 'Event updated successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update event status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status required' });
    }

    const connection = await getDBPool().getConnection();
    await connection.execute(
      'UPDATE events SET status = ? WHERE id = ?',
      [status, id]
    );
    connection.release();

    res.json({
      success: true,
      message: 'Event status updated successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getDBPool().getConnection();
    await connection.execute('DELETE FROM events WHERE id = ?', [id]);
    connection.release();

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get events by type
router.get('/type/:eventType', async (req, res) => {
  try {
    const { eventType } = req.params;
    const connection = await getDBPool().getConnection();
    const [events] = await connection.execute(
      'SELECT * FROM events WHERE event_type = ? ORDER BY event_date DESC',
      [eventType]
    );
    connection.release();

    res.json({
      success: true,
      data: events
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
