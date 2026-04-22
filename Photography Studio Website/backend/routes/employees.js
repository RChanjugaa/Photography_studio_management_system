const express = require('express');
const { getPool } = require('../db');

// Helper to get pool instance
const getDBPool = () => getPool();

const router = express.Router();

// Get all employees
router.get('/', async (req, res) => {
  try {
    const connection = await getDBPool().getConnection();
    const [employees] = await connection.execute(`
      SELECT id, first_name, last_name, email, phone, role, status, 
             visible_public, join_date, specialties FROM employees
      ORDER BY first_name ASC
    `);
    connection.release();

    res.json({
      success: true,
      data: employees,
      total: employees.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single employee
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getDBPool().getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM employees WHERE id = ?',
      [id]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const employee = rows[0];
    employee.specialties = employee.specialties ? JSON.parse(employee.specialties) : [];

    res.json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create employee
router.post('/', async (req, res) => {
  try {
    const {
      firstName, lastName, email, phone, role, status, visiblePublic,
      joinDate, bio, specialties, baseSalary
    } = req.body;

    if (!firstName || !lastName || !email || !role) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const connection = await getDBPool().getConnection();
    const [result] = await connection.execute(
      `INSERT INTO employees (
        first_name, last_name, email, phone, role, status, visible_public,
        join_date, bio, specialties, base_salary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName, lastName, email, phone, role, status || 'active',
        visiblePublic !== false, joinDate || new Date().toISOString().split('T')[0],
        bio || null, JSON.stringify(specialties || []), baseSalary || null
      ]
    );
    connection.release();

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: { id: result.insertId }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update employee
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName, lastName, email, phone, role, status, visiblePublic,
      bio, specialties, baseSalary
    } = req.body;

    const connection = await getDBPool().getConnection();
    await connection.execute(
      `UPDATE employees SET 
        first_name = ?, last_name = ?, email = ?, phone = ?, role = ?,
        status = ?, visible_public = ?, bio = ?, specialties = ?, base_salary = ?
       WHERE id = ?`,
      [
        firstName, lastName, email, phone, role, status, visiblePublic,
        bio, JSON.stringify(specialties || []), baseSalary, id
      ]
    );
    connection.release();

    res.json({
      success: true,
      message: 'Employee updated successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getDBPool().getConnection();
    await connection.execute('DELETE FROM employees WHERE id = ?', [id]);
    connection.release();

    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get public employees (visible)
router.get('/public/gallery', async (req, res) => {
  try {
    const connection = await getDBPool().getConnection();
    const [employees] = await connection.execute(`
      SELECT id, first_name, last_name, role, bio, specialties 
      FROM employees WHERE visible_public = true AND status = 'active'
      ORDER BY first_name ASC
    `);
    connection.release();

    res.json({
      success: true,
      data: employees
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
