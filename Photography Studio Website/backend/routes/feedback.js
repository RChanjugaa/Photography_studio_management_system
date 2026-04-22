const express = require('express');
const { getPool } = require('../db');

const router = express.Router();

// Helper to get pool instance
const getDBPool = () => getPool();

// Get all feedback
router.get('/', async (req, res) => {
  try {
    const connection = await getDBPool().getConnection();
    const [feedback] = await connection.execute(`
      SELECT f.*, c.first_name, c.last_name, c.email, b.booking_number
      FROM feedback f
      LEFT JOIN clients c ON f.client_id = c.id
      LEFT JOIN bookings b ON f.booking_id = b.id
      ORDER BY f.created_at DESC
    `);
    connection.release();

    res.json({
      success: true,
      data: feedback,
      total: feedback.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get feedback by booking ID
router.get('/booking/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const connection = await getDBPool().getConnection();
    const [feedback] = await connection.execute(
      `SELECT f.*, c.first_name, c.last_name, c.email
       FROM feedback f
       LEFT JOIN clients c ON f.client_id = c.id
       WHERE f.booking_id = ?
       ORDER BY f.created_at DESC`,
      [bookingId]
    );
    connection.release();

    res.json({
      success: true,
      data: feedback,
      total: feedback.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single feedback
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getDBPool().getConnection();
    const [rows] = await connection.execute(
      `SELECT f.*, c.first_name, c.last_name, c.email
       FROM feedback f
       LEFT JOIN clients c ON f.client_id = c.id
       WHERE f.id = ?`,
      [id]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create feedback
router.post('/', async (req, res) => {
  try {
    const { bookingId, clientId, rating, comment } = req.body;

    if (!bookingId || !clientId || !rating) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: bookingId, clientId, rating' 
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating must be between 1 and 5' 
      });
    }

    const connection = await getDBPool().getConnection();
    const [result] = await connection.execute(
      `INSERT INTO feedback (booking_id, client_id, rating, comment)
       VALUES (?, ?, ?, ?)`,
      [bookingId, clientId, rating, comment || null]
    );
    connection.release();

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        id: result.insertId,
        bookingId,
        clientId,
        rating,
        comment
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update feedback
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const connection = await getDBPool().getConnection();
    await connection.execute(
      `UPDATE feedback SET rating = ?, comment = ? WHERE id = ?`,
      [rating, comment, id]
    );
    connection.release();

    res.json({
      success: true,
      message: 'Feedback updated successfully',
      data: { id }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete feedback
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getDBPool().getConnection();
    const [result] = await connection.execute(
      `DELETE FROM feedback WHERE id = ?`,
      [id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
