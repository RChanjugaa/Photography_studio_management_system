const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const insertSampleData = async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ambiance_photo_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    const connection = await pool.getConnection();

    console.log('🌱 Seeding database with sample data...\n');

    // Insert admin user
    try {
      await connection.execute(`
        INSERT INTO admin_users (username, password, email) 
        VALUES (?, ?, ?)
      `, [
        process.env.ADMIN_USERNAME || 'admin',
        process.env.ADMIN_PASSWORD || 'admin123',
        'admin@ambiance.lk'
      ]);
      console.log('✓ Admin user created');
    } catch (err) {
      if (err.code !== 'ER_DUP_ENTRY') throw err;
    }

    // Insert sample clients
    const clients = [
      ['Nimal', 'Fernando', 'nimal@email.com', '+94 77 345 6789'],
      ['Priya', 'Rajapaksa', 'priya@email.com', '+94 77 456 7890'],
      ['Sanjay', 'Kumar', 'sanjay@email.com', '+94 77 567 8901'],
      ['Dilini', 'Weerasinghe', 'dilini@email.com', '+94 77 678 9012'],
    ];

    for (const [fname, lname, email, phone] of clients) {
      try {
        await connection.execute(`
          INSERT INTO clients (first_name, last_name, email, phone, status, registration_date, total_bookings, total_spent, email_verified)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [fname, lname, email, phone, 'active', new Date(), Math.floor(Math.random() * 5), Math.random() * 100000, true]);
      } catch (err) {
        if (err.code !== 'ER_DUP_ENTRY') throw err;
      }
    }
    console.log('✓ Sample clients inserted');

    // Insert sample employees
    const employees = [
      ['Amaya', 'Silva', 'amaya@ambiance.lk', '+94 77 123 4567', 'Lead Photographer'],
      ['Kasun', 'Perera', 'kasun@ambiance.lk', '+94 77 234 5678', 'Cinematographer'],
      ['Nadeeka', 'Perera', 'nadeeka@ambiance.lk', '+94 77 343 5679', 'Event Manager'],
      ['Dinesh', 'Kumar', 'dinesh@ambiance.lk', '+94 77 454 5680', 'DJ'],
    ];

    for (const [fname, lname, email, phone, role] of employees) {
      try {
        await connection.execute(`
          INSERT INTO employees (first_name, last_name, email, phone, role, status, join_date, visible_public, base_salary)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [fname, lname, email, phone, role, 'active', new Date(), true, 100000]);
      } catch (err) {
        if (err.code !== 'ER_DUP_ENTRY') throw err;
      }
    }
    console.log('✓ Sample employees inserted');

    // Insert sample events
    const events = [
      ['Wedding', 'Silva-Perera Wedding', 'Grand wedding ceremony', '2024-04-15', '10:00', 'Grand Hotel Colombo', 1],
      ['DJ', 'Birthday Bash', 'Corporate birthday party', '2024-04-20', '18:00', 'Office Premises', 2],
      ['Party', 'Music Festival', 'Live music event', '2024-04-25', '19:00', 'City Park', 3],
    ];

    for (const [type, name, desc, date, time, location, clientId] of events) {
      try {
        await connection.execute(`
          INSERT INTO events (event_type, event_name, description, event_date, event_time, location, client_id, status, budget)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [type, name, desc, date, time, location, clientId, 'confirmed', 50000]);
      } catch (err) {
        console.log('Event insertion skipped');
      }
    }
    console.log('✓ Sample events inserted');

    // Insert sample bookings
    try {
      await connection.execute(`
        INSERT INTO bookings (booking_number, client_id, service_type, booking_date, event_date, duration_hours, location, amount, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, ['BK' + Date.now(), 1, 'Photography', new Date(), '2024-04-15', 8, 'Grand Hotel', 150000, 'confirmed']);
    } catch (err) {
      console.log('Booking insertion skipped');
    }
    console.log('✓ Sample bookings inserted');

    connection.release();
    console.log('\n✅ Database seeding completed successfully!\n');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err.message);
    process.exit(1);
  }
};

insertSampleData();
