const express = require('express');
const { getPool } = require('../db');
const router = express.Router();

// Get all packages
router.get('/', async (req, res) => {
  try {
    const connection = await getPool().getConnection();
    const [packages] = await connection.execute(
      'SELECT * FROM packages ORDER BY created_at DESC'
    );
    connection.release();
    res.json({ success: true, data: packages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get active packages only (for client view + booking)
router.get('/active', async (req, res) => {
  try {
    const connection = await getPool().getConnection();
    const [packages] = await connection.execute(
      'SELECT * FROM packages WHERE active = true ORDER BY type, base_price'
    );
    connection.release();
    res.json({ success: true, data: packages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create package
router.post('/', async (req, res) => {
  try {
    const { title, type, description, basePrice, durationHours, features } = req.body;
    if (!title || !type || !basePrice) {
      return res.status(400).json({ success: false, message: 'Title, type and price required' });
    }
    const connection = await getPool().getConnection();
    const [result] = await connection.execute(
      `INSERT INTO packages (title, type, description, base_price, duration_hours, features)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, type, description || null, basePrice, durationHours || null, JSON.stringify(features || [])]
    );
    connection.release();
    res.status(201).json({ success: true, message: 'Package created', data: { id: result.insertId } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update package
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, description, basePrice, durationHours, active } = req.body;
    const connection = await getPool().getConnection();
    await connection.execute(
      `UPDATE packages SET title=?, type=?, description=?, base_price=?, duration_hours=?, active=? WHERE id=?`,
      [title, type, description, basePrice, durationHours, active, id]
    );
    connection.release();
    res.json({ success: true, message: 'Package updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete package
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getPool().getConnection();
    await connection.execute('DELETE FROM packages WHERE id = ?', [id]);
    connection.release();
    res.json({ success: true, message: 'Package deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;