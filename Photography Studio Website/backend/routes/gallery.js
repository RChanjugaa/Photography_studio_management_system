const express = require('express');
const { getPool } = require('../db');

const router = express.Router();

// Helper to get pool instance
const getDBPool = () => getPool();

// Get all gallery items
router.get('/', async (req, res) => {
  try {
    const connection = await getDBPool().getConnection();
    const [gallery] = await connection.execute(`
      SELECT g.*, b.booking_number, c.first_name, c.last_name
      FROM gallery g
      LEFT JOIN bookings b ON g.booking_id = b.id
      LEFT JOIN clients c ON b.client_id = c.id
      ORDER BY g.created_at DESC
    `);
    connection.release();

    res.json({
      success: true,
      data: gallery,
      total: gallery.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get gallery by booking ID
router.get('/booking/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const connection = await getDBPool().getConnection();
    const [gallery] = await connection.execute(
      `SELECT * FROM gallery WHERE booking_id = ? ORDER BY created_at DESC`,
      [bookingId]
    );
    connection.release();

    res.json({
      success: true,
      data: gallery,
      total: gallery.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single gallery item
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getDBPool().getConnection();
    const [rows] = await connection.execute(
      `SELECT g.*, b.booking_number, c.first_name, c.last_name
       FROM gallery g
       LEFT JOIN bookings b ON g.booking_id = b.id
       LEFT JOIN clients c ON b.client_id = c.id
       WHERE g.id = ?`,
      [id]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create gallery item (upload image)
router.post('/', async (req, res) => {
  try {
    const { bookingId, imageUrl, imageType = 'photo' } = req.body;

    if (!bookingId || !imageUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: bookingId, imageUrl' 
      });
    }

    const connection = await getDBPool().getConnection();
    const [result] = await connection.execute(
      `INSERT INTO gallery (booking_id, image_url, image_type)
       VALUES (?, ?, ?)`,
      [bookingId, imageUrl, imageType]
    );
    connection.release();

    res.status(201).json({
      success: true,
      message: 'Photo added to gallery successfully',
      data: {
        id: result.insertId,
        bookingId,
        imageUrl,
        imageType
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Bulk upload gallery items
router.post('/bulk/upload', async (req, res) => {
  try {
    const { bookingId, images } = req.body;

    if (!bookingId || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: bookingId, images (array)' 
      });
    }

    const connection = await getDBPool().getConnection();
    const uploadedIds = [];

    for (const image of images) {
      const [result] = await connection.execute(
        `INSERT INTO gallery (booking_id, image_url, image_type)
         VALUES (?, ?, ?)`,
        [bookingId, image.imageUrl, image.imageType || 'photo']
      );
      uploadedIds.push(result.insertId);
    }

    connection.release();

    res.status(201).json({
      success: true,
      message: `${uploadedIds.length} photos added to gallery successfully`,
      data: {
        bookingId,
        uploadedIds,
        count: uploadedIds.length
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update gallery item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl, imageType } = req.body;

    const connection = await getDBPool().getConnection();
    await connection.execute(
      `UPDATE gallery SET image_url = ?, image_type = ? WHERE id = ?`,
      [imageUrl, imageType, id]
    );
    connection.release();

    res.json({
      success: true,
      message: 'Gallery item updated successfully',
      data: { id }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete gallery item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getDBPool().getConnection();
    const [result] = await connection.execute(
      `DELETE FROM gallery WHERE id = ?`,
      [id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    res.json({
      success: true,
      message: 'Gallery item deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
