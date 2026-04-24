const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
// Increase body size limit to 100MB for base64 image uploads
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Import and use routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/events', require('./routes/events'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/packages', require('./routes/packages'));


// Database initialization and server start
const initializeDatabase = async () => {
  try {
    const { initializePool } = require('./db');

    // Initialize the database pool (creates DB)
    await initializePool();
    console.log('✓ Database pool initialized');

    // Create tables if they don't exist
    await createTables();

    // Start server
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Database: ${process.env.DB_NAME || 'ambiance_photo_db'}`);
      console.log(`✅ Backend API is ready!\n`);
    });
  } catch (err) {
    console.error('Database initialization failed:', err.message);
    console.error('Make sure XAMPP MySQL is running and credentials are correct.');
    process.exit(1);
  }
};

// Create tables function
const createTables = async () => {
  const { getPool } = require('./db');
  const pool = getPool();
  const connection = await pool.getConnection();
  try {
    // Admin Users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Clients table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS clients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20),
        password VARCHAR(255),
        status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
        registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME,
        total_bookings INT DEFAULT 0,
        total_spent DECIMAL(10, 2) DEFAULT 0,
        profile_complete BOOLEAN DEFAULT false,
        email_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_status (status)
      )
    `);

    // Employees table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(100) NOT NULL,
        status ENUM('active', 'inactive', 'on_leave') DEFAULT 'active',
        visible_public BOOLEAN DEFAULT true,
        join_date DATE NOT NULL,
        last_login DATETIME,
        bio TEXT,
        specialties JSON,
        base_salary DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_status (status)
      )
    `);

    // Events table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_type ENUM('DJ', 'Music', 'Party', 'Wedding', 'Corporate', 'Birthday') NOT NULL,
        event_name VARCHAR(200) NOT NULL,
        description TEXT,
        event_date DATE NOT NULL,
        event_time TIME,
        location VARCHAR(255),
        client_id INT,
        assigned_employees JSON,
        status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
        budget DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
        INDEX idx_event_date (event_date),
        INDEX idx_status (status)
      )
    `);

    // Bookings table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_number VARCHAR(50) UNIQUE NOT NULL,
        client_id INT NOT NULL,
        event_id INT,
        service_type ENUM('Photography', 'Cinematography', 'DJ', 'Event Management') NOT NULL,
        booking_date DATE NOT NULL,
        event_date DATE NOT NULL,
        event_time TIME,
        duration_hours INT,
        location VARCHAR(255),
        status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
        amount DECIMAL(10, 2) NOT NULL,
        advance_paid DECIMAL(10, 2) DEFAULT 0,
        remaining_amount DECIMAL(10, 2),
        notes TEXT,
        assigned_employees JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL,
        INDEX idx_booking_number (booking_number),
        INDEX idx_client_id (client_id),
        INDEX idx_status (status),
        INDEX idx_event_date (event_date)
      )
    `);

    // Payments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        invoice_number VARCHAR(50) UNIQUE NOT NULL,
        booking_id INT NOT NULL,
        client_id INT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        payment_method ENUM('cash', 'credit_card', 'bank_transfer', 'cheque') NOT NULL,
        status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
        payment_date DATETIME,
        due_date DATE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
        INDEX idx_invoice_number (invoice_number),
        INDEX idx_status (status)
      )
    `);

    // Gallery table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id INT,
        employee_id INT,
        image_url LONGTEXT NOT NULL,
        image_type ENUM('photo', 'video', 'thumbnail') DEFAULT 'photo',
        description TEXT,
        uploaded_by INT NOT NULL,
        upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL,
        FOREIGN KEY (uploaded_by) REFERENCES admin_users(id) ON DELETE CASCADE,
        INDEX idx_booking_id (booking_id),
        INDEX idx_employee_id (employee_id),
        INDEX idx_upload_date (upload_date)
      )
    `);

    // Ensure booking_id is nullable (photos can be uploaded without a booking)
    try {
      await connection.execute(`
        ALTER TABLE gallery MODIFY COLUMN booking_id INT NULL
      `);
      console.log('✓ Updated booking_id column to allow NULL values');
    } catch (err) {
      if (err.message.includes('Duplicate') || err.message.includes('already')) {
        console.log('  booking_id already nullable');
      } else {
        console.log('  Note:', err.message);
      }
    }

    // Ensure image_url column is large enough for base64 images
    try {
      await connection.execute(`
        ALTER TABLE gallery MODIFY COLUMN image_url LONGTEXT NOT NULL
      `);
      console.log('✓ Updated image_url column to LONGTEXT for base64 support');
    } catch (err) {
      if (err.message.includes('Duplicate') || err.message.includes('already')) {
        console.log('  image_url column already optimized');
      } else {
        console.log('  Note:', err.message);
      }
    }
    try {
      await connection.execute(`
        ALTER TABLE gallery ADD COLUMN employee_id INT DEFAULT NULL
      `);
      console.log('✓ Added employee_id column to gallery table');
    } catch (err) {
      if (err.message.includes('Duplicate column name')) {
        console.log('  employee_id column already exists');
      } else {
        console.log('  Note: Could not add employee_id column:', err.message);
      }
    }

    // Ensure upload_date column exists
    try {
      await connection.execute(`
        ALTER TABLE gallery ADD COLUMN upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
      `);
      console.log('✓ Added upload_date column to gallery table');
    } catch (err) {
      if (err.message.includes('Duplicate column name')) {
        console.log('  upload_date column already exists');
      } else {
        console.log('  Note: Could not add upload_date column:', err.message);
      }
    }

    // Ensure description column exists
    try {
      await connection.execute(`
        ALTER TABLE gallery ADD COLUMN description TEXT DEFAULT NULL
      `);
      console.log('✓ Added description column to gallery table');
    } catch (err) {
      if (err.message.includes('Duplicate column name')) {
        console.log('  description column already exists');
      } else {
        console.log('  Note: Could not add description column:', err.message);
      }
    }

    // Ensure uploaded_by column exists
    try {
      await connection.execute(`
        ALTER TABLE gallery ADD COLUMN uploaded_by INT NOT NULL DEFAULT 1
      `);
      console.log('✓ Added uploaded_by column to gallery table');
    } catch (err) {
      if (err.message.includes('Duplicate column name')) {
        console.log('  uploaded_by column already exists');
      } else {
        console.log('  Note: Could not add uploaded_by column:', err.message);
      }
    }

    // Add foreign key for employee_id if it doesn't exist
    try {
      await connection.execute(`
        ALTER TABLE gallery ADD CONSTRAINT fk_gallery_employee_id 
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL
      `);
      console.log('✓ Added employee_id foreign key to gallery table');
    } catch (err) {
      if (err.message.includes('Duplicate') || err.message.includes('already exists')) {
        console.log('  employee_id foreign key already exists');
      } else {
        console.log('  Note: Could not add employee_id FK:', err.message);
      }
    }

    // Add foreign key for uploaded_by if it doesn't exist
    try {
      await connection.execute(`
        ALTER TABLE gallery ADD CONSTRAINT fk_gallery_uploaded_by 
        FOREIGN KEY (uploaded_by) REFERENCES admin_users(id) ON DELETE CASCADE
      `);
      console.log('✓ Added uploaded_by foreign key to gallery table');
    } catch (err) {
      if (err.message.includes('Duplicate') || err.message.includes('already exists')) {
        console.log('  uploaded_by foreign key already exists');
      } else {
        console.log('  Note: Could not add uploaded_by FK:', err.message);
      }
    }

    // Feedback table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS feedback (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id INT NOT NULL,
        client_id INT NOT NULL,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
        INDEX idx_booking_id (booking_id)
      )
        
    `);

    // Packages table
await connection.execute(`
  CREATE TABLE IF NOT EXISTS packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    duration_hours INT,
    features JSON,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`);

    console.log('✓ All database tables created/verified successfully');
  } catch (err) {
    if (err.message.includes('already exists')) {
      console.log('✓ Database tables already exist');
    } else {
      console.error('Error creating tables:', err.message);
    }
  } finally {
    connection.release();
  }
};

// Initialize and start
console.log('\n[SERVER] Starting initialization...\n');
initializeDatabase().catch(err => {
  console.error('[SERVER] Initialization error caught:', err.message);
  process.exit(1);
});

// Export app for testing
module.exports = { app };
