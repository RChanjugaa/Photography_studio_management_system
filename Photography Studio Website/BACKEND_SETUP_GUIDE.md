# Ambiance Photo Services - Full Stack Setup Guide

Complete guide to set up and run both Frontend (React) and Backend (Node.js) for the Ambiance Photo Services application.

## 🏗️ Architecture Overview

```
FRONTEND (React + Vite)          BACKEND (Node.js + Express)
├── http://localhost:5175        ├── http://localhost:5000
├── Admin Dashboard              ├── REST API
├── Client Portal                ├── Database: MySQL
├── Public Website               └── XAMPP + PhpMyAdmin
└── Booking System
```

---

## 📋 System Requirements

- **Node.js** v14+ (Download: https://nodejs.org/)
- **XAMPP** with MySQL (Download: https://www.apachefriends.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for version control)
- **Postman** (optional, for API testing)

---

## 🚀 Initial Setup (First Time Only)

### Step 1: Install Node.js
1. Download from https://nodejs.org/
2. Install with default settings
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Install XAMPP
1. Download from https://www.apachefriends.org/
2. Install with default settings
3. After installation, open XAMPP Control Panel and click "Start" for:
   - Apache (for PhpMyAdmin)
   - MySQL (for database)

### Step 3: Install Project Dependencies

#### Frontend Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd backend
npm install
cd ..
```

---

## 🎯 Running the Application

### Option 1: Run Frontend & Backend Separately (Recommended for Development)

#### Terminal 1 - Start Frontend
```bash
npm run dev
```
Frontend will run on: **http://localhost:5175**

#### Terminal 2 - Start Backend
```bash
cd backend
npm start
```
Backend will run on: **http://localhost:5000**

#### Terminal 3 - PhpMyAdmin (Optional)
Open browser: **http://localhost/phpmyadmin**
- Username: root
- Password: (leave empty)

---

### Option 2: Run Everything at Once

```bash
# From root directory
npm run dev:all
```

This requires setting up concurrently package (coming soon)

---

## 📊 Database Setup

### Automatic (Recommended)
When you start the backend for the first time, it automatically:
1. Creates `ambiance_photo_db` database
2. Creates all required tables
3. Indexes all foreign keys

No manual setup needed! ✨

### Manual Setup (If needed)
1. Open PhpMyAdmin: http://localhost/phpmyadmin
2. Login with username: `root`, password: empty
3. Create new database: `ambiance_photo_db`
4. Run the SQL scripts from `/backend/sql/` (if available)

---

## 🔐 Admin Credentials

After running the backend seed script:
```bash
cd backend
npm run seed
```

**Login Credentials:**
- Username: `admin`
- Password: `admin123`

Access admin panel: **http://localhost:5175/admin/login**

---

## 📱 Key URLs

| Page | URL |
|------|-----|
| Public Website | http://localhost:5175 |
| Admin Login | http://localhost:5175/admin/login |
| Admin Dashboard | http://localhost:5175/admin/dashboard |
| Admin Clients | http://localhost:5175/admin/clients |
| Client Login | http://localhost:5175/client/login |
| API Health | http://localhost:5000/api/health |
| PhpMyAdmin | http://localhost/phpmyadmin |

---

## 🔌 Frontend - Backend Integration

### API Configuration
The frontend automatically connects to the backend at `http://localhost:5000/api`

To customize, edit your API utility file:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### Common API Endpoints

**Clients**
- `GET /api/clients` - List all clients
- `POST /api/clients` - Create client
- `GET /api/clients/stats/overview` - Client statistics

**Bookings**
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/stats/overview` - Booking statistics

**Admin Dashboard**
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/activity/recent` - Recent activity
- `GET /api/admin/reports/revenue` - Revenue report

---

## 🧪 Testing the Setup

### Test Frontend
1. Open http://localhost:5175 in browser
2. You should see the Ambiance Photo Services homepage
3. Try logging in or navigating around

### Test Backend
```bash
# Check if backend is running
curl http://localhost:5000/api/health
```

You should see:
```json
{
  "status": "Server is running",
  "timestamp": "2024-03-23T10:30:00.000Z"
}
```

### Test Database Connection
1. Open http://localhost/phpmyadmin
2. Look for `ambiance_photo_db` database on left sidebar
3. Click to view tables

---

## 📝 Sample Data

### Run Seed Script
```bash
cd backend
npm run seed
```

This will populate:
- 4 sample clients
- 4 sample employees
- 3 sample events
- Sample bookings and payments

Use these in admin dashboard to test features.

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'express'"
**Solution:**
```bash
cd backend
npm install
```

### Issue: "XAMPP MySQL not starting"
**Solution:**
- Close other MySQL instances
- Check if port 3306 is available
- Restart computer and try again

### Issue: "Connection refused on port 5000"
**Solution:**
- Make sure backend is running with `npm start`
- Check if port 5000 is available
- Change PORT in `backend/.env` to different port

### Issue: "Frontend not connecting to backend"
**Solution:**
- Verify backend is running on port 5000
- Check API_BASE_URL in frontend code
- Clear browser cache and reload
- Check browser console for errors

### Issue: "Database already exists"
**Solution:**
- This is not an error! Just means database is already created
- Backend will use existing tables

---

## 📦 Project Structure

```
photo-project/
├── src/                    # Frontend source
│   ├── app/               # React components
│   ├── pages/             # Page components
│   │   └── admin/        # Admin pages
│   └── main.tsx          # Entry point
├── backend/               # Backend source
│   ├── server.js         # Main server
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── clients.js
│   │   ├── bookings.js
│   │   ├── employees.js
│   │   ├── events.js
│   │   └── payments.js
│   └── scripts/
│       └── seed.js       # Sample data
├── package.json          # Frontend dependencies
├── .env                  # Configuration
└── vite.config.ts        # Vite configuration
```

---

## 🚀 Development Workflow

### Daily Startup
1. Start XAMPP (Apache + MySQL)
2. Open Terminal 1: `npm run dev` (frontend)
3. Open Terminal 2: `cd backend && npm start` (backend)
4. Access http://localhost:5175 in browser

### Adding New Features
1. Create feature on frontend in React
2. Create API endpoints in backend
3. Connect them together
4. Test in browser

### Viewing Database
- Use PhpMyAdmin: http://localhost/phpmyadmin
- Or use MySQL Workbench (if installed)

---

## 📊 Monitoring

### Check Frontend Status
- Open browser console (F12)
- Check "Network" tab for API calls
- Look for any 404 or 500 errors

### Check Backend Status
- Look at terminal output when server starts
- Check for "✓ Database connected successfully"
- View error messages if any API fails

### Check Database Status
- Open PhpMyAdmin
- Navigate to databases
- Check tables and data

---

## 💾 Important Files to Know

| File | Purpose |
|------|---------|
| `package.json` | Frontend dependencies |
| `backend/package.json` | Backend dependencies |
| `.env` | Database configuration |
| `vite.config.ts` | Frontend build config |
| `backend/server.js` | Main backend server |

---

## 🔐 Security Reminders

⚠️ **Before Production:**
- Change default admin password
- Update `.env` with strong credentials
- Enable HTTPS
- Add authentication middleware
- Implement rate limiting
- Use environment variables properly

---

## 📞 Quick Reference

```bash
# Start frontend
npm run dev

# Start backend
cd backend && npm start

# Install dependencies
npm install

# Seed database
cd backend && npm run seed

# View database
# Open http://localhost/phpmyadmin
```

---

## 🎓 Learning Resources

- React: https://react.dev/
- Node.js: https://nodejs.org/docs/
- Express: https://expressjs.com/
- MySQL: https://dev.mysql.com/doc/
- Tailwind CSS: https://tailwindcss.com/docs

---

## ✅ Checklist for Complete Setup

- [ ] Node.js installed
- [ ] XAMPP installed with MySQL running
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Backend database created and tables set up
- [ ] Frontend running on http://localhost:5175
- [ ] Backend running on http://localhost:5000
- [ ] Sample data seeded (`npm run seed` in backend)
- [ ] Admin login working
- [ ] API endpoints responding

---

## 🎉 Ready to Go!

Once you complete the setup:
1. Frontend is at http://localhost:5175
2. Backend API is at http://localhost:5000
3. Database is running automatically
4. You can start building features!

---

**Last Updated**: March 23, 2026
**Version**: 1.0.0 - Full Stack
