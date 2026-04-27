const express = require('express');
const { getPool } = require('../db');

const router = express.Router();

// ===============================
// ✅ CREATE FOLLOW-UP
// ===============================
router.post('/', async (req, res) => {
  try {
    const { client_id, note, followup_date, priority } = req.body;

    if (!client_id || !note || !followup_date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const connection = await getPool().getConnection();

    const [result] = await connection.execute(
      `INSERT INTO client_followups 
       (client_id, note, followup_date, priority) 
       VALUES (?, ?, ?, ?)`,
      [client_id, note, followup_date, priority || 'medium']
    );

    connection.release();

    res.json({
      success: true,
      message: 'Follow-up created successfully',
      data: { id: result.insertId }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ===============================
// ✅ GET ALL FOLLOW-UPS
// ===============================
router.get('/', async (req, res) => {
  try {
    const connection = await getPool().getConnection();

    const [rows] = await connection.execute(`
      SELECT f.*, c.first_name, c.last_name
      FROM client_followups f
      LEFT JOIN clients c ON f.client_id = c.id
      ORDER BY f.followup_date ASC
    `);

    connection.release();

    res.json({
      success: true,
      data: rows
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ===============================
// ✅ UPDATE FOLLOW-UP
// ===============================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { note, followup_date, priority, status } = req.body;

    const connection = await getPool().getConnection();

    await connection.execute(
      `UPDATE client_followups 
       SET note=?, followup_date=?, priority=?, status=? 
       WHERE id=?`,
      [note, followup_date, priority, status, id]
    );

    connection.release();

    res.json({
      success: true,
      message: 'Follow-up updated successfully'
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ===============================
// ✅ DELETE FOLLOW-UP
// ===============================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await getPool().getConnection();

    await connection.execute(
      `DELETE FROM client_followups WHERE id=?`,
      [id]
    );

    connection.release();

    res.json({
      success: true,
      message: 'Follow-up deleted successfully'
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ===============================
// 🔥 SMART FEATURE: TODAY ALERTS
// ===============================
router.get('/today', async (req, res) => {
  try {
    const connection = await getPool().getConnection();

    const [rows] = await connection.execute(`
      SELECT f.*, c.first_name, c.last_name
      FROM client_followups f
      LEFT JOIN clients c ON f.client_id = c.id
      WHERE DATE(f.followup_date) <= CURDATE()
      AND f.status = 'pending'
      ORDER BY f.followup_date ASC
    `);

    connection.release();

    res.json({
      success: true,
      count: rows.length,
      data: rows
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;