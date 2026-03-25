const express = require('express');
const { getPool } = require('../db');

// Helper to get pool instance
const getDBPool = () => getPool();

const router = express.Router();

// Generate booking number
const generateBookingNumber = () => {
  return 'BK' + Date.now() + Math.floor(Math.random() * 1000);
};

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const connection = await getDBPool().getConnection();
    const [bookings] = await connection.execute(`
      SELECT b.*, c.first_name, c.last_name, c.email 
      FROM bookings b
      LEFT JOIN clients c ON b.client_id = c.id
      ORDER BY b.booking_date DESC
    `);
    connection.release();

    res.json({
      success: true,
      data: bookings,
      total: bookings.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single booking
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getDBPool().getConnection();
    const [rows] = await connection.execute(
      `SELECT b.*, c.first_name, c.last_name, c.email 
       FROM bookings b
       LEFT JOIN clients c ON b.client_id = c.id
       WHERE b.id = ?`,
      [id]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create booking
router.post('/', async (req, res) => {
  try {
    const {
      clientId, eventId, serviceType, bookingDate, eventDate, 
      eventTime, duration, location, amount, notes, assignedEmployees
    } = req.body;

    if (!clientId || !serviceType || !eventDate || !amount) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const bookingNumber = generateBookingNumber();
    const connection = await getDBPool().getConnection();
    
    const [result] = await connection.execute(
      `INSERT INTO bookings (
        booking_number, client_id, event_id, service_type, booking_date, 
        event_date, event_time, duration_hours, location, amount, notes, assigned_employees
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bookingNumber, clientId, eventId || null, serviceType, 
        bookingDate || new Date().toISOString().split('T')[0],
        eventDate, eventTime || null, duration || null, location || null, 
        amount, notes || null, JSON.stringify(assignedEmployees || [])
      ]
    );

    // Update client total bookings and spent
    await connection.execute(
      `UPDATE clients SET total_bookings = total_bookings + 1, total_spent = total_spent + ? 
       WHERE id = ?`,
      [amount, clientId]
    );

    connection.release();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        id: result.insertId,
        bookingNumber: bookingNumber
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update booking
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      serviceType, eventDate, eventTime, location, amount, status, notes
    } = req.body;

    const connection = await getDBPool().getConnection();
    await connection.execute(
      `UPDATE bookings SET service_type = ?, event_date = ?, event_time = ?, 
       location = ?, amount = ?, status = ?, notes = ? WHERE id = ?`,
      [serviceType, eventDate, eventTime, location, amount, status, notes, id]
    );
    connection.release();

    res.json({
      success: true,
      message: 'Booking updated successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update booking status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status required' });
    }

    const connection = await getDBPool().getConnection();
    await connection.execute(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, id]
    );
    connection.release();

    res.json({
      success: true,
      message: 'Booking status updated successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getDBPool().getConnection();
    await connection.execute('DELETE FROM bookings WHERE id = ?', [id]);
    connection.release();

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get bookings statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const connection = await getDBPool().getConnection();
    const [stats] = await connection.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(amount) as total_revenue,
        AVG(amount) as avg_booking_value
      FROM bookings
    `);
    connection.release();

    res.json({
      success: true,
      data: stats[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
