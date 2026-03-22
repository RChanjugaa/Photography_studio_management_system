-- Studio Ambiance - Event Management Database
-- Developer: S. Vaheesh

CREATE DATABASE IF NOT EXISTS studio_ambiance;
USE studio_ambiance;

-- Users table (needed for foreign key)
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('Client', 'Admin', 'Staff') DEFAULT 'Client',
  contact_number VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event_name VARCHAR(150) NOT NULL,
  event_type ENUM('Wedding', 'Birthday', 'Corporate', 'Cultural Event', 'Other Events') NOT NULL,
  event_date DATE NOT NULL,
  location VARCHAR(255) DEFAULT 'Negombo, Sri Lanka',
  photographer VARCHAR(100) DEFAULT NULL,
  status ENUM('Scheduled', 'Upcoming', 'Ongoing', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Sample data
INSERT INTO users (name, email, password, role, contact_number) VALUES
('Admin User', 'admin@studioambiance.com', '$2b$10$hashedpassword', 'Admin', '+94771234567');

INSERT INTO events (user_id, event_name, event_type, event_date, location, photographer, status, notes) VALUES
(1, 'Silva Wedding', 'Wedding', '2026-03-10', 'Negombo Beach', 'Abisheka P.', 'Completed', 'Beach wedding at Negombo.'),
(1, 'Perera Birthday', 'Birthday', '2026-03-18', 'Colombo', 'Anchuga S.', 'Upcoming', '18th birthday party.'),
(1, 'TechCorp Annual', 'Corporate', '2026-02-28', 'Colombo 03', 'Abishek R.', 'Completed', 'Annual corporate event.'),
(1, 'Sinhala New Year', 'Cultural Event', '2026-04-13', 'Negombo', NULL, 'Upcoming', 'Cultural celebration.'),
(1, 'Fernando Engagement', 'Wedding', '2026-01-20', 'Kandy', 'Thiviyanath M.', 'Completed', 'Engagement ceremony.'),
(1, 'Kids Fun Day', 'Other Events', '2026-04-01', 'City Park', NULL, 'Scheduled', 'Kids event at city park.');
