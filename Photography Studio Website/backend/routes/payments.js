const express = require('express');
const { getPool } = require('../db');

// Helper to get pool instance
const getDBPool = () => getPool();

const router = express.Router();

// Generate invoice number
const generateInvoiceNumber = () => {
  return 'INV' + Date.now() + Math.floor(Math.random() * 1000);
};

// Get all payments
router.get('/', async (req, res) => {
  try {
    const connection = await getDBPool().getConnection();
    const [payments] = await connection.execute(`
      SELECT p.*, b.booking_number, c.first_name, c.last_name, c.email 
      FROM payments p
      LEFT JOIN bookings b ON p.booking_id = b.id
      LEFT JOIN clients c ON p.client_id = c.id
      ORDER BY p.created_at DESC
    `);
    connection.release();

    res.json({
      success: true,
      data: payments,
      total: payments.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single payment
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getDBPool().getConnection();
    const [rows] = await connection.execute(
      `SELECT p.*, b.booking_number, c.first_name, c.last_name 
       FROM payments p
       LEFT JOIN bookings b ON p.booking_id = b.id
       LEFT JOIN clients c ON p.client_id = c.id
       WHERE p.id = ?`,
      [id]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create payment
router.post('/', async (req, res) => {
  try {
    const {
      bookingId, clientId, amount, paymentMethod, dueDate, notes
    } = req.body;

    if (!bookingId || !clientId || !amount || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const invoiceNumber = generateInvoiceNumber();
    const connection = await getDBPool().getConnection();
    
    const [result] = await connection.execute(
      `INSERT INTO payments (
        invoice_number, booking_id, client_id, amount, payment_method, 
        due_date, notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        invoiceNumber, bookingId, clientId, amount, paymentMethod,
        dueDate || null, notes || null, 'pending'
      ]
    );
    connection.release();

    res.status(201).json({
      success: true,
      message: 'Payment record created successfully',
      data: {
        id: result.insertId,
        invoiceNumber: invoiceNumber
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update payment
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod, dueDate, notes } = req.body;

    const connection = await getDBPool().getConnection();
    await connection.execute(
      `UPDATE payments SET amount = ?, payment_method = ?, due_date = ?, notes = ?
       WHERE id = ?`,
      [amount, paymentMethod, dueDate, notes, id]
    );
    connection.release();

    res.json({
      success: true,
      message: 'Payment updated successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Mark payment as completed
router.patch('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await getDBPool().getConnection();
    
    // Get payment details
    const [paymentRows] = await connection.execute(
      'SELECT booking_id, amount FROM payments WHERE id = ?',
      [id]
    );

    if (paymentRows.length === 0) {
      connection.release();
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    const payment = paymentRows[0];

    // Update payment status
    await connection.execute(
      'UPDATE payments SET status = ?, payment_date = NOW() WHERE id = ?',
      ['completed', id]
    );

    // Update booking advance paid
    await connection.execute(
      `UPDATE bookings SET advance_paid = advance_paid + ?, 
       remaining_amount = amount - (advance_paid + ?)
       WHERE id = ?`,
      [payment.amount, payment.amount, payment.booking_id]
    );

    connection.release();

    res.json({
      success: true,
      message: 'Payment marked as completed'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete payment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getDBPool().getConnection();
    await connection.execute('DELETE FROM payments WHERE id = ?', [id]);
    connection.release();

    res.json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get payment statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const connection = await getDBPool().getConnection();
    const [stats] = await connection.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
        SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_collected,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as total_pending
      FROM payments
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

// Get payments by client
router.get('/client/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const connection = await getDBPool().getConnection();
    const [payments] = await connection.execute(
      `SELECT * FROM payments WHERE client_id = ? ORDER BY created_at DESC`,
      [clientId]
    );
    connection.release();

    res.json({
      success: true,
      data: payments
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
