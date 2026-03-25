const express = require('express');
const { getPool } = require('../db');

// Helper to get pool instance
const getDBPool = () => getPool();

const router = express.Router();

// Get all clients
router.get('/', async (req, res) => {
  try {
    const connection = await getDBPool().getConnection();
    const [clients] = await connection.execute(`
      SELECT id, first_name, last_name, email, phone, status, 
             registration_date, last_login, total_bookings, total_spent, 
             email_verified FROM clients ORDER BY registration_date DESC
    `);
    connection.release();

    res.json({
      success: true,
      data: clients,
      total: clients.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single client
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getDBPool().getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM clients WHERE id = ?',
      [id]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create client (Admin)
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, status } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const connection = await getDBPool().getConnection();
    const [result] = await connection.execute(
      `INSERT INTO clients (first_name, last_name, email, phone, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [firstName, lastName, email, phone, status || 'pending']
    );
    connection.release();

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: { id: result.insertId }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update client
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, status } = req.body;

    const connection = await getDBPool().getConnection();
    await connection.execute(
      `UPDATE clients SET first_name = ?, last_name = ?, email = ?, phone = ?, status = ? 
       WHERE id = ?`,
      [firstName, lastName, email, phone, status, id]
    );
    connection.release();

    res.json({
      success: true,
      message: 'Client updated successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete client
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getDBPool().getConnection();
    await connection.execute('DELETE FROM clients WHERE id = ?', [id]);
    connection.release();

    res.json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get client statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const connection = await getDBPool().getConnection();
    const [stats] = await connection.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN email_verified = true THEN 1 ELSE 0 END) as verified,
        SUM(total_spent) as total_revenue
      FROM clients
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
