# ShootPro — Booking & Service Management

Full-stack app: **React + Tailwind** frontend · **Node.js + Express** backend · **SQLite** database.

---

## 🚀 Setup & Run (VS Code)

### Prerequisites
- Node.js installed → https://nodejs.org (LTS version)

### Step 1 — Open terminal in VS Code
```
Ctrl + `
```

### Step 2 — Install root dependencies
```bash
npm install
```

### Step 3 — Install server dependencies
```bash
cd server
npm install
cd ..
```

### Step 4 — Install client dependencies
```bash
cd client
npm install
cd ..
```

### Step 5 — Run both frontend + backend together
```bash
npm run dev
```

This starts:
- **Backend API** → http://localhost:5000
- **Frontend**    → http://localhost:5173

Open **http://localhost:5173** in your browser ✓

---

## 📁 Project Structure

```
booking-fullstack/
├── package.json          ← root (runs both together)
│
├── server/
│   ├── index.js          ← Express API server
│   ├── db.js             ← SQLite setup + all queries
│   ├── shootpro.db       ← SQLite database (auto-created on first run)
│   └── package.json
│
└── client/
    ├── src/
    │   ├── App.jsx               ← Root component
    │   ├── api.js                ← All fetch() calls (single place)
    │   ├── constants.js          ← Shared constants & helpers
    │   └── components/
    │       ├── UI.jsx            ← Chip, Modal, Field, Spinner, Toasts
    │       ├── Sidebar.jsx       ← Left nav
    │       ├── PackagesTab.jsx   ← Package CRUD
    │       ├── BookingsListTab.jsx ← Bookings table + filters
    │       ├── Others.jsx        ← Calendar, Sidebar, BookingDetail
    │       └── Modals.jsx        ← Create/Reschedule/Cancel modals
    └── package.json
```

---

## 🔌 API Endpoints

### Packages
| Method | Endpoint             | Description        |
|--------|----------------------|--------------------|
| GET    | /api/packages        | List all packages  |
| GET    | /api/packages/:id    | Get one package    |
| POST   | /api/packages        | Create package     |
| PUT    | /api/packages/:id    | Update package     |
| DELETE | /api/packages/:id    | Delete package     |

### Bookings
| Method | Endpoint                     | Description              |
|--------|------------------------------|--------------------------|
| GET    | /api/bookings                | List (with filters)      |
| GET    | /api/bookings/:id            | Get one + audit log      |
| POST   | /api/bookings                | Create booking           |
| PUT    | /api/bookings/:id            | Update details           |
| PUT    | /api/bookings/:id/status     | Change status            |
| PUT    | /api/bookings/:id/reschedule | Reschedule               |
| DELETE | /api/bookings/:id            | Delete booking           |
| POST   | /api/bookings/conflict-check | Check time conflicts     |

### Other
| Method | Endpoint      | Description             |
|--------|---------------|-------------------------|
| GET    | /api/calendar | All bookings (calendar) |
| GET    | /api/health   | Server health check     |

---

## 🗄️ Database
- SQLite file: `server/shootpro.db` (auto-created on first run)
- Tables: `packages`, `bookings`, `audit_log`
- Data persists across restarts automatically ✓

---

## 🔗 Connecting to Teammates
- **Clients (Anchuga)**: Replace client fields in Create Booking modal with a real `GET /api/clients?query=` call
- **Payments (Abisheka)**: `GET /api/bookings` returns base_price per booking for finance charts
- **Staff (Thiviyanath)**: `assigned_photographer_id` field is ready — wire to staff API
- **Gallery (Abishek)**: When booking status → `Completed`, trigger photo delivery event
