const express = require('express');
const bcryptjs = require('bcryptjs');
const { getPool } = require('../db');
const router = express.Router();

// Helper to get pool instance
const getDBPool = () => getPool();

// Admin Login
router.post('/admin-login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    const connection = await getDBPool().getConnection();
    const [rows] = await connection.execute('SELECT * FROM admin_users WHERE username = ?', [username]);
    connection.release();

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const admin = rows[0];
    // For now, simple comparison (in production, use bcrypt)
    const isPasswordValid = password === admin.password || await bcryptjs.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate a simple token (in production, use JWT)
    const token = Buffer.from(`${admin.id}:${Date.now()}`).toString('base64');

    res.json({
      success: true,
      message: 'Admin login successful',
      data: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        token: token
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin Register (for initial setup)
router.post('/admin-register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    const hashedPassword = password; // In production, use bcryptjs.hash()
    
    const connection = await getDBPool().getConnection();
    try {
      await connection.execute(
        'INSERT INTO admin_users (username, password, email) VALUES (?, ?, ?)',
        [username, hashedPassword, email]
      );
      connection.release();

      res.status(201).json({
        success: true,
        message: 'Admin registered successfully'
      });
    } catch (err) {
      connection.release();
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ success: false, message: 'Username already exists' });
      }
      throw err;
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Client Login
router.post('/client-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const connection = await getDBPool().getConnection();
    const [rows] = await connection.execute('SELECT * FROM clients WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      connection.release();
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const client = rows[0];
    // Simple password comparison (implement bcrypt in production)
    const isPasswordValid = password === client.password;

    if (!isPasswordValid) {
      connection.release();
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update last login
    await connection.execute(
      'UPDATE clients SET last_login = NOW() WHERE id = ?',
      [client.id]
    );
    connection.release();

    const token = Buffer.from(`${client.id}:${Date.now()}`).toString('base64');

    res.json({
      success: true,
      message: 'Client login successful',
      data: {
        id: client.id,
        firstName: client.first_name,
        lastName: client.last_name,
        email: client.email,
        status: client.status,
        token: token
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Client Register
router.post('/client-register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    const connection = await getDBPool().getConnection();
    try {
      const [result] = await connection.execute(
        'INSERT INTO clients (first_name, last_name, email, phone, password, status) VALUES (?, ?, ?, ?, ?, ?)',
        [firstName, lastName, email, phone, password, 'active']
      );
      
      // Fetch the created client
      const [newClient] = await connection.execute(
        'SELECT id, first_name, last_name, email, phone, status FROM clients WHERE id = ?',
        [result.insertId]
      );
      connection.release();

      res.status(201).json({
        success: true,
        message: 'Client registered successfully',
        data: {
          id: newClient[0].id,
          firstName: newClient[0].first_name,
          lastName: newClient[0].last_name,
          email: newClient[0].email,
          phone: newClient[0].phone,
          status: newClient[0].status
        }
      });
    } catch (err) {
      connection.release();
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }
      throw err;
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
