const express = require('express');
const { getPool } = require('../db');

// Helper to get pool instance
const getDBPool = () => getPool();

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    const connection = await getDBPool().getConnection();

    // Get various statistics
    const [clientStats] = await connection.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active
      FROM clients
    `);

    const [bookingStats] = await connection.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(amount) as total_value
      FROM bookings
    `);

    const [employeeStats] = await connection.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active
      FROM employees
    `);

    const [eventStats] = await connection.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
      FROM events
    `);

    const [paymentStats] = await connection.execute(`
      SELECT 
        SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_revenue,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_payments
      FROM payments
    `);

    connection.release();

    res.json({
      success: true,
      data: {
        clients: clientStats[0],
        bookings: bookingStats[0],
        employees: employeeStats[0],
        events: eventStats[0],
        payments: paymentStats[0]
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get recent activity
router.get('/activity/recent', async (req, res) => {
  try {
    const connection = await getDBPool().getConnection();

    const [recentBookings] = await connection.execute(`
      SELECT 'booking' as type, booking_number as title, created_at as timestamp 
      FROM bookings ORDER BY created_at DESC LIMIT 5
    `);

    const [recentPayments] = await connection.execute(`
      SELECT 'payment' as type, invoice_number as title, created_at as timestamp 
      FROM payments ORDER BY created_at DESC LIMIT 5
    `);

    const [recentEvents] = await connection.execute(`
      SELECT 'event' as type, event_name as title, created_at as timestamp 
      FROM events ORDER BY created_at DESC LIMIT 5
    `);

    connection.release();

    const allActivity = [...recentBookings, ...recentPayments, ...recentEvents]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);

    res.json({
      success: true,
      data: allActivity
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get revenue report
router.get('/reports/revenue', async (req, res) => {
  try {
    const connection = await getDBPool().getConnection();

    const [revenueData] = await connection.execute(`
      SELECT 
        DATE_FORMAT(payment_date, '%Y-%m') as month,
        SUM(amount) as revenue,
        COUNT(*) as transaction_count
      FROM payments
      WHERE status = 'completed' AND payment_date IS NOT NULL
      GROUP BY DATE_FORMAT(payment_date, '%Y-%m')
      ORDER BY month DESC
      LIMIT 12
    `);

    connection.release();

    res.json({
      success: true,
      data: revenueData
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get booking report
router.get('/reports/bookings', async (req, res) => {
  try {
    const connection = await getDBPool().getConnection();

    const [bookingData] = await connection.execute(`
      SELECT 
        service_type,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        AVG(amount) as avg_amount
      FROM bookings
      GROUP BY service_type
    `);

    connection.release();

    res.json({
      success: true,
      data: bookingData
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get top clients
router.get('/clients/top', async (req, res) => {
  try {
    const connection = await getDBPool().getConnection();

    const [topClients] = await connection.execute(`
      SELECT 
        id, first_name, last_name, email, total_bookings, total_spent
      FROM clients
      ORDER BY total_spent DESC
      LIMIT 10
    `);

    connection.release();

    res.json({
      success: true,
      data: topClients
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get upcoming bookings
router.get('/bookings/upcoming', async (req, res) => {
  try {
    const connection = await getDBPool().getConnection();

    const [upcomingBookings] = await connection.execute(`
      SELECT b.*, c.first_name, c.last_name
      FROM bookings b
      LEFT JOIN clients c ON b.client_id = c.id
      WHERE b.event_date >= CURDATE() AND b.status != 'cancelled'
      ORDER BY b.event_date ASC
      LIMIT 10
    `);

    connection.release();

    res.json({
      success: true,
      data: upcomingBookings
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get system performance metrics
router.get('/metrics/performance', async (req, res) => {
  try {
    const connection = await getDBPool().getConnection();

    const [metrics] = await connection.execute(`
      SELECT 
        (SELECT COUNT(*) FROM bookings WHERE status = 'completed') as completed_bookings,
        (SELECT COUNT(*) FROM bookings WHERE STATUS = 'pending') as pending_bookings,
        (SELECT SUM(amount) FROM bookings) as total_bookings_value,
        (SELECT SUM(amount) FROM payments WHERE status = 'completed') as total_collected,
        (SELECT AVG(amount) FROM bookings) as avg_booking_value,
        (SELECT COUNT(*) FROM clients) as total_clients
    `);

    connection.release();

    res.json({
      success: true,
      data: metrics[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
