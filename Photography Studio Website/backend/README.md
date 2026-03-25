# Ambiance Photo Backend - API Server

Complete Node.js backend for Ambiance Photo Services with MySQL database integration.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14+)
- **XAMPP** with MySQL running
- **npm** package manager

### Installation Steps

#### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

#### 2. Start XAMPP MySQL
- Open XAMPP Control Panel
- Click "Start" for MySQL
- Verify MySQL is running on port 3306

#### 3. Configure Database (Optional)
Edit `.env` file in the root directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ambiance_photo_db
PORT=5000
```

#### 4. Start Backend Server
```bash
npm start
```

The server will:
- Create the `ambiance_photo_db` database
- Create all necessary tables automatically
- Start running on `http://localhost:5000`

#### 5. Seed Sample Data (Optional)
```bash
npm run seed
```

This will insert sample data for testing:
- 4 sample clients
- 4 sample employees
- 3 sample events
- Sample bookings and payments

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/admin-login` - Admin login
- `POST /api/auth/admin-register` - Admin registration
- `POST /api/auth/client-login` - Client login
- `POST /api/auth/client-register` - Client registration

### Clients Management
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get single client
- `POST /api/clients` - Create client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client
- `GET /api/clients/stats/overview` - Client statistics

### Bookings Management
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `PATCH /api/bookings/:id/status` - Update booking status
- `DELETE /api/bookings/:id` - Delete booking
- `GET /api/bookings/stats/overview` - Booking statistics

### Employees Management
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get single employee
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /api/employees/public/gallery` - Get public employees

### Events Management
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `PATCH /api/events/:id/status` - Update event status
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/type/:eventType` - Events by type

### Payments Management
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get single payment
- `POST /api/payments` - Create payment
- `PUT /api/payments/:id` - Update payment
- `PATCH /api/payments/:id/complete` - Mark payment complete
- `DELETE /api/payments/:id` - Delete payment
- `GET /api/payments/stats/overview` - Payment statistics
- `GET /api/payments/client/:clientId` - Payments by client

### Admin Dashboard
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/activity/recent` - Recent activity
- `GET /api/admin/reports/revenue` - Revenue report
- `GET /api/admin/reports/bookings` - Bookings report
- `GET /api/admin/clients/top` - Top clients
- `GET /api/admin/bookings/upcoming` - Upcoming bookings
- `GET /api/admin/metrics/performance` - Performance metrics

### Health Check
- `GET /api/health` - Server status

---

## 📊 Database Schema

### Tables Created Automatically
1. **admin_users** - Admin accounts
2. **clients** - Client information
3. **employees** - Staff members
4. **events** - Event records
5. **bookings** - Booking records
6. **payments** - Payment records
7. **gallery** - Event photos/videos
8. **feedback** - Client feedback

---

## 🔗 Connecting Frontend to Backend

### Update API Base URL in Frontend

Edit your frontend environment or API configuration:

```javascript
// In your React components or API utility
const API_BASE_URL = 'http://localhost:5000/api';

// Example API call
const response = await fetch(`${API_BASE_URL}/clients`, {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
});
```

### CORS Configuration
- Backend already has CORS enabled
- Frontend can make requests from any origin (for development)
- In production, update CORS to specific domain

---

## 🧪 Testing API Endpoints

### Using cURL
```bash
# Get all clients
curl http://localhost:5000/api/clients

# Create admin user
curl -X POST http://localhost:5000/api/auth/admin-register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123","email":"admin@ambiance.lk"}'

# Login
curl -X POST http://localhost:5000/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Using Postman
1. Import endpoints from API documentation
2. Set request method and URL
3. Add JSON body for POST/PUT requests
4. Send request

---

## 📁 Project Structure

```
backend/
├── server.js              # Main server file
├── package.json           # Dependencies
├── routes/
│   ├── auth.js           # Authentication
│   ├── clients.js        # Client endpoints
│   ├── bookings.js       # Booking endpoints
│   ├── employees.js      # Employee endpoints
│   ├── events.js         # Event endpoints
│   ├── payments.js       # Payment endpoints
│   └── admin.js          # Admin endpoints
└── scripts/
    └── seed.js           # Sample data
```

---

## 🐛 Troubleshooting

### MySQL Connection Failed
**Problem**: `Database connection failed`
**Solution**: 
- Start XAMPP and ensure MySQL is running
- Check credentials in `.env` file
- Verify port 3306 is not blocked

### Port Already in Use
**Problem**: `Error: listen EADDRINUSE :::5000`
**Solution**:
- Change PORT in `.env` file
- Or kill process: `lsof -ti:5000 | xargs kill -9`

### Database Not Found
**Problem**: `ER_BAD_DB_ERROR`
**Solution**:
- Server will create database automatically on first run
- If not, check MySQL user has CREATE DATABASE permission

---

## 🔐 Security Notes

⚠️ **Development Only**: Current implementation uses plain passwords. For production:
- Use bcrypt for password hashing
- Implement JWT tokens
- Add request validation
- Enable authentication middleware
- Add rate limiting
- Use HTTPS

---

## 📚 Sample Requests

### Create a Booking
```json
POST /api/bookings
{
  "clientId": 1,
  "serviceType": "Photography",
  "bookingDate": "2024-03-23",
  "eventDate": "2024-04-15",
  "eventTime": "10:00",
  "location": "Grand Hotel",
  "amount": 150000,
  "notes": "Wedding photography"
}
```

### Create Payment
```json
POST /api/payments
{
  "bookingId": 1,
  "clientId": 1,
  "amount": 75000,
  "paymentMethod": "bank_transfer",
  "dueDate": "2024-04-10",
  "notes": "Advance payment"
}
```

---

## 🚀 Deployment

### Using PM2 (Recommended)
```bash
npm install -g pm2
pm2 start server.js --name "ambiance-backend"
pm2 save
pm2 startup
```

### Using Docker
Create `Dockerfile` for containerization (coming soon)

---

## 📞 Support

For issues or questions:
1. Check logs in terminal
2. Verify MySQL is running
3. Check `.env` configuration
4. Review API endpoint documentation

---

## 📝 License

Private project for Ambiance Photo Services

---

**Last Updated**: March 23, 2026
**Version**: 1.0.0
