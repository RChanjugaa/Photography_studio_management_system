const express = require('express');
const router = express.Router();

// ===============================
// 🚫 PAYMENTS MODULE DISABLED
// ===============================

// GET all payments
router.get('/', (req, res) => {
  res.status(500).json({
    success: false,
    message: 'Payments module is offline (no database connection)'
  });
});

// GET single payment
router.get('/:id', (req, res) => {
  res.status(500).json({
    success: false,
    message: 'Payments module is offline'
  });
});

// CREATE payment
router.post('/', (req, res) => {
  res.status(500).json({
    success: false,
    message: 'Server not connected. Payment not saved.'
  });
});

// UPDATE payment
router.put('/:id', (req, res) => {
  res.status(500).json({
    success: false,
    message: 'Update disabled. Payments module offline.'
  });
});

// COMPLETE payment
router.patch('/:id/complete', (req, res) => {
  res.status(500).json({
    success: false,
    message: 'Payment processing disabled.'
  });
});

// DELETE payment
router.delete('/:id', (req, res) => {
  res.status(500).json({
    success: false,
    message: 'Delete disabled. No database connection.'
  });
});

// STATS
router.get('/stats/overview', (req, res) => {
  res.status(500).json({
    success: false,
    message: 'Statistics unavailable. Payments module offline.'
  });
});

// CLIENT PAYMENTS
router.get('/client/:clientId', (req, res) => {
  res.status(500).json({
    success: false,
    message: 'Payments module offline'
  });
});

module.exports = router;