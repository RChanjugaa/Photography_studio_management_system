# Photography Studio Management System - Data Connection Analysis

## Executive Summary
This document maps all connections between **Client Management**, **Admin Management**, **Booking System**, and **Admin Booking Functionality** across the entire codebase.

---

## 1. DATABASE LEVEL CONNECTIONS (backend/server.js)

### Core Tables and Foreign Keys:

#### **Clients Table**
```
- PK: id
- Fields: first_name, last_name, email, phone, status, total_bookings, total_spent
- Status: active, inactive, pending
- Relationships: One-to-Many with Bookings, Events, Payments, Feedback
```

#### **Bookings Table** 
```
- PK: id
- FK: client_id → clients(id) ON DELETE CASCADE ⭐ PRIMARY CONNECTION
- FK: event_id → events(id) ON DELETE SET NULL
- Fields: booking_number, service_type, booking_date, event_date, event_time, 
          duration_hours, location, status, amount, advance_paid, assigned_employees
- Status: pending, confirmed, in_progress, completed, cancelled
```

#### **Events Table**
```
- PK: id
- FK: client_id → clients(id) ON DELETE SET NULL
- Fields: event_type, event_name, event_date, event_time, location, assigned_employees, budget
- Status: pending, confirmed, completed, cancelled
- Notes: Bridge between Clients and Bookings for complex events
```

#### **Payments Table**
```
- PK: id
- FK: booking_id → bookings(id) ON DELETE CASCADE ⭐ CRITICAL CONNECTION
- FK: client_id → clients(id) ON DELETE CASCADE ⭐ DUAL CONNECTION
- Fields: invoice_number, amount, payment_method, status, payment_date, due_date
- Status: pending, completed, failed, refunded
- Purpose: Ties bookings and clients together for financial tracking
```

#### **Gallery Table**
```
- PK: id
- FK: booking_id → bookings(id) ON DELETE CASCADE
- Fields: image_url, image_type (photo, video, thumbnail)
- Purpose: Stores images for completed bookings
```

#### **Feedback Table**
```
- PK: id
- FK: booking_id → bookings(id) ON DELETE CASCADE ⭐ CONNECTION
- FK: client_id → clients(id) ON DELETE CASCADE ⭐ CONNECTION
- Fields: rating, comment
- Purpose: Client feedback after booking completion
```

### Database Schema Relationships Diagram:
```
Admin (implicit via routes)
  ↓
  └─→ Clients (direct management)
       ├─→ Bookings (1:M via client_id)
       │   ├─→ Events (1:1 optional via event_id)
       │   ├─→ Payments (1:M via booking_id) ⭐
       │   ├─→ Gallery (1:M via booking_id)
       │   └─→ Feedback (1:M via booking_id)
       ├─→ Events (1:M via client_id)
       ├─→ Payments (1:M via client_id) ⭐
       └─→ Feedback (1:M via client_id) ⭐
```

---

## 2. BACKEND API ROUTES (backend/routes/)

### **2.1 Bookings Routes** (backend/routes/bookings.js)

#### **Client-to-Booking Connections:**

| Route | Method | Purpose | SQL Join | Data Flow |
|-------|--------|---------|----------|-----------|
| `GET /bookings/` | GET | Get all bookings with client info | `LEFT JOIN clients c ON b.client_id = c.id` | Admin views all bookings + client names |
| `GET /bookings/:id` | GET | Get single booking with client | `LEFT JOIN clients c ON b.client_id = c.id` | Admin/Client views booking details |
| `POST /bookings/` | POST | Create booking | Inserts `client_id` parameter | Client creates booking, adds 1 to `total_bookings` |
| `PUT /bookings/:id` | PUT | Update booking details | Updates based on `id` | Admin modifies booking details |
| `PATCH /bookings/:id/status` | PATCH | Update booking status | Updates status field | Admin changes: pending → confirmed → completed |
| `DELETE /bookings/:id` | DELETE | Delete booking | Deletes booking by id | Admin removes booking |
| `GET /bookings/stats/overview` | GET | Booking statistics | Aggregates all bookings | Dashboard shows: total, pending, confirmed, completed, revenue |

#### **Admin-to-Booking Connections (via Admin Routes):**

| Route | Method | Purpose | SQL Join | Data Flow |
|-------|--------|---------|----------|-----------|
| `GET /admin/bookings/upcoming` | GET | Get upcoming bookings | `LEFT JOIN clients c ON b.client_id = c.id` | Admin dashboard: 10 upcoming events |
| `GET /admin/reports/bookings` | GET | Booking report by service type | Groups by service_type | Admin analytics: Photography vs Cinematography |

#### **Key Booking Fields:**
- `assigned_employees` (JSON): Array of employee IDs assigned to booking
- `amount`: Booking price (used in payments tracking)
- `client_id`: Links to specific client
- `booking_number`: Unique identifier (format: BK{timestamp}{random})

---

### **2.2 Clients Routes** (backend/routes/clients.js)

#### **Admin-to-Client Connections:**

| Route | Method | Purpose | Data |
|-------|--------|---------|------|
| `GET /clients/` | GET | Get all clients (admin view) | Returns all client info, total_bookings, total_spent |
| `GET /clients/:id` | GET | Get single client | Detailed client profile |
| `POST /clients/` | POST | Create client (admin) | Admin creates new client record |
| `PUT /clients/:id` | PUT | Update client (admin) | Admin modifies client details |
| `DELETE /clients/:id` | DELETE | Delete client (admin) | Admin removes client |
| `GET /clients/stats/overview` | GET | Client statistics | Active, inactive, pending, verified count, total revenue |

#### **Client Data Updated via Bookings:**
```javascript
// When booking is created:
UPDATE clients SET 
  total_bookings = total_bookings + 1, 
  total_spent = total_spent + [amount] 
WHERE id = [clientId]
```

---

### **2.3 Admin Routes** (backend/routes/admin.js)

#### **Admin Dashboard - Multi-Entity Connections:**

| Route | Method | Connections | Purpose |
|-------|--------|-------------|---------|
| `GET /admin/dashboard/stats` | GET | Clients + Bookings + Employees + Events + Payments | Dashboard statistics |
| `GET /admin/activity/recent` | GET | Bookings + Payments + Events | Recent activity feed |
| `GET /admin/reports/revenue` | GET | Payments table | Monthly revenue report |
| `GET /admin/reports/bookings` | GET | Bookings table grouped | Service type analysis |
| `GET /admin/clients/top` | GET | Clients table | Top 10 clients by spending |
| `GET /admin/bookings/upcoming` | GET | Bookings + Clients JOIN | Next 10 upcoming events |

#### **Admin Statistics Query Example:**
```sql
SELECT COUNT(*) as total,
       SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
FROM bookings
```

---

### **2.4 Payments Routes** (backend/routes/payments.js)

#### **Connections Between Clients-Bookings-Payments:**

| Route | Method | Joins | Purpose |
|-------|--------|-------|---------|
| `GET /payments/` | GET | 3-way join: payments → bookings → clients | All payments with booking & client info |
| `GET /payments/:id` | GET | 3-way join | Single payment details |
| `POST /payments/` | POST | Dual insert: booking_id + client_id | Create payment record |
| `PATCH /payments/:id/complete` | PATCH | Updates booking advance_paid | Mark payment complete |

#### **Three-Way Data Connection (Most Important):**
```sql
SELECT p.*, b.booking_number, c.first_name, c.last_name 
FROM payments p
LEFT JOIN bookings b ON p.booking_id = b.id
LEFT JOIN clients c ON p.client_id = c.id
```
**This connects:** Admin (managing) → Payments → Bookings → Clients

---

### **2.5 Events Routes** (backend/routes/events.js)

#### **Events Bridge Between Clients and Bookings:**

| Route | Method | Join | Purpose |
|-------|--------|------|---------|
| `GET /events/` | GET | LEFT JOIN clients c ON e.client_id = c.id | Events with client names |
| `GET /events/:id` | GET | LEFT JOIN clients | Single event with client |
| `POST /events/` | POST | Stores client_id + assigned_employees | Create event for client |
| `PUT /events/:id` | PUT | Update event details | Modify event |

---

## 3. FRONTEND REACT COMPONENTS (src/app/pages/)

### **3.1 Admin Components**

#### **AdminClients.tsx** 
- **Purpose:** Admin manages all clients
- **API Calls:** `clientsAPI.getAll()`, `.create()`, `.update()`, `.delete()`
- **Connections:** 
  - Displays: total_bookings, total_spent per client
  - Status tracking: active, inactive, pending
  - Shows email_verified, profile_complete flags
- **Key Features:** Search, filter by status, edit client details

#### **AdminPayments.tsx**
- **Purpose:** Admin manages payment records & invoices
- **API Calls:** `paymentsAPI.getAll()`, `.create()`, `.complete()`
- **Connections:** ⭐ **PRIMARY ADMIN-BOOKINGS CONNECTION**
  - Links payments → bookings (via booking_id)
  - Links payments → clients (via client_id)
  - Shows booking_number, client name, invoice_id, amount, status
- **Key Features:** Payment tracking, invoice management, status updates

#### **AdminInvoiceDetail.tsx**
- **Purpose:** View detailed invoice
- **Connections:** Shows booking details, client info, payment history
- **Link:** References both booking and client entities

#### **BookingsManagement.tsx** (Admin view)
- **Purpose:** Admin manages all bookings
- **API Calls:** `bookingsAPI.getAll()`, `.delete()`, `.updateStatus()`
- **Connections:** ⭐ **CORE ADMIN-BOOKING CONNECTION**
  - Displays: client_name, booking_number, service_type, event_date, amount, status
  - Filter by: status, service type
  - Sort: by date
- **Key Features:** Status management (pending→confirmed→completed), deletion

#### **AdminEventManagement.tsx**
- **Purpose:** Admin manages events (related to bookings)
- **API Calls:** `eventsAPI.getAll()`, `.create()`, `.update()`, `.updateStatus()`
- **Connections:** 
  - Links events → bookings (via booking_id reference)
  - Links events → clients (via client_id)
  - Shows: event name, date, photographer assigned, booking link
- **Key Features:** Event scheduling, photo assignment, status tracking

#### **AdminFinanceReports.tsx**
- **Purpose:** Admin views financial reports
- **Connections:** 
  - Queries: payments, bookings, clients
  - Aggregates: revenue by month, by service type, by client
- **Key Features:** Analytics dashboard

---

### **3.2 Booking Components**

#### **BookingsManagement.tsx** (General booking view)
- **Purpose:** Central booking management
- **API Calls:** Same as Admin BookingsManagement
- **Connections:** Full client-booking integration
- **Tabs:** List view, Calendar view

#### **CreateBooking.tsx**
- **Purpose:** Create new booking
- **API Calls:** 
  - `clientsAPI.getAll()` - loads available clients
  - `bookingsAPI.create()` - creates booking with client_id
- **Connections:** ⭐ **CLIENT CREATES BOOKING**
  - Step 1: Select/Create Client
  - Step 2: Select Package (service type)
  - Step 3: Select Date & Time
  - Step 4: Add Notes
  - Result: Creates booking with client_id, amount, date, notes
- **Data Flow:** Client → Booking with all details

#### **BookingDetails.tsx**
- **Purpose:** View detailed booking info
- **Connections:** Shows client info, booking status, payment history
- **Linked Data:** Booking + Client + Payment info

#### **BookingsList.tsx**
- **Purpose:** List all bookings
- **Connections:** Displays client names, booking IDs, dates, statuses

#### **CalendarView.tsx**
- **Purpose:** Calendar view of bookings
- **Connections:** Shows all bookings by date
- **Client Link:** Displays client name on each event

#### **PackagesManagement.tsx**
- **Purpose:** Manage service packages
- **Connections:** Packages are selected when creating bookings
- **Links to:** Bookings (via service_type or package selection)

---

### **3.3 Client Components**

#### **ClientBookings.tsx**
- **Purpose:** Client views their bookings
- **API Calls:** Filters bookings by client_id (via auth token)
- **Connections:** ⭐ **CLIENT-BOOKING VIEW**
  - Shows: booking_id, type, status, requested_date, scheduled_date, photographer
  - Filter by: status
  - Actions: View details, download, feedback
- **Key Features:** My booking requests, status tracking

#### **ClientBookingRequest.tsx**
- **Purpose:** Client makes new booking request
- **API Calls:** `bookingsAPI.create()` with current client_id
- **Connections:** Creates booking linked to authenticated client
- **Data Flow:** Client form → Booking record (client_id auto-populated)

#### **ClientBookingHistory.tsx**
- **Purpose:** View past bookings
- **Connections:** 
  - Shows completed bookings only
  - Links to: photos from gallery, feedback left, payments made
- **Related Tables:** bookings, gallery, feedback, payments

#### **ClientDashboard.tsx**
- **Purpose:** Client home page
- **Connections:** 
  - Shows: recent bookings, total spent, profile status
  - Aggregates: total_bookings, total_spent from clients table
  - Quick links to: new booking, view bookings, payment history

#### **ClientProfile.tsx**
- **Purpose:** View/edit client profile
- **Connections:** 
  - Reads: email, phone, profile_complete, email_verified
  - Updates: client table with new info
- **Related:** total_bookings, total_spent (display only)

---

## 4. API SERVICE INTEGRATION (src/services/api.ts)

### **API Endpoints Structure:**

```typescript
// Clients API
clientsAPI.getAll()           → GET /clients
clientsAPI.getOne(id)         → GET /clients/:id
clientsAPI.create(data)       → POST /clients
clientsAPI.update(id, data)   → PUT /clients/:id
clientsAPI.delete(id)         → DELETE /clients/:id
clientsAPI.getStats()         → GET /clients/stats/overview

// Bookings API
bookingsAPI.getAll()          → GET /bookings
bookingsAPI.getOne(id)        → GET /bookings/:id
bookingsAPI.create(data)      → POST /bookings        ⭐ Client + Admin
bookingsAPI.update(id, data)  → PUT /bookings/:id
bookingsAPI.updateStatus(id, status) → PATCH /bookings/:id/status
bookingsAPI.delete(id)        → DELETE /bookings/:id
bookingsAPI.getStats()        → GET /bookings/stats/overview

// Payments API
paymentsAPI.getAll()          → GET /payments
paymentsAPI.getOne(id)        → GET /payments/:id
paymentsAPI.create(data)      → POST /payments        ⭐ Dual link
paymentsAPI.complete(id)      → PATCH /payments/:id/complete

// Events API
eventsAPI.getAll()            → GET /events
eventsAPI.create(data)        → POST /events          ⭐ With client_id
eventsAPI.update(id, data)    → PUT /events/:id
```

---

## 5. DATA FLOW DIAGRAMS

### **Flow 1: Client Creates Booking**
```
Client Portal (ClientBookingRequest.tsx)
    ↓
    User selects: package, date, time
    ↓
bookingsAPI.create({
  clientId: [from auth],
  serviceType: [from package],
  eventDate: [user selected],
  eventTime: [user selected],
  amount: [package price],
  notes: [user entered]
})
    ↓
Backend: POST /api/bookings
    ↓
INSERT INTO bookings (
  client_id, service_type, event_date, amount, notes, ...
)
    ↓
UPDATE clients SET 
  total_bookings = total_bookings + 1,
  total_spent = total_spent + [amount]
WHERE id = [client_id]
    ↓
Database Updated ✓
    ↓
ClientBookings.tsx refreshes and shows new booking
```

---

### **Flow 2: Admin Manages Booking → Payment**
```
Admin Portal (AdminBookingsManagement.tsx)
    ↓
Admin clicks: View Booking [ID]
    ↓
Loads: BookingDetails.tsx
    ↓
Shows:
  - Client: name, email, phone (from booking.client_id JOIN)
  - Booking: date, time, amount, status, service type
  - Assigned: photographers/staff (from assigned_employees JSON)
    ↓
Admin creates payment record
    ↓
POST /api/payments with:
  {
    bookingId: [booking.id],
    clientId: [booking.client_id],
    amount: [payment amount],
    paymentMethod: [selected],
    status: 'pending'
  }
    ↓
INSERT INTO payments (
  booking_id, client_id, amount, invoice_number, ...
)
    ↓
AdminPayments.tsx shows payment in list
  (via 3-way JOIN: payments → bookings → clients)
    ↓
Admin marks payment: PATCH /payments/:id/complete
    ↓
UPDATE payments SET status = 'completed'
    ↓
UPDATE bookings SET advance_paid = [amount]
```

---

### **Flow 3: Admin Dashboard Statistics**
```
Admin (AdminDashboard.tsx)
    ↓
Page loads: GET /admin/dashboard/stats
    ↓
Backend executes multiple queries:
    ├─ SELECT COUNT(*) FROM clients WHERE status = 'active'
    ├─ SELECT COUNT(*) FROM bookings WHERE status = 'pending'
    ├─ SELECT COUNT(*) FROM employees WHERE status = 'active'
    ├─ SELECT COUNT(*) FROM events WHERE status = 'pending'
    └─ SELECT SUM(amount) FROM payments WHERE status = 'completed'
    ↓
Returns aggregated stats:
  {
    clients: { total: 10, active: 8 },
    bookings: { total: 25, pending: 5, confirmed: 15 },
    employees: { total: 5, active: 5 },
    events: { total: 20, pending: 3 },
    payments: { totalRevenue: 850000, pendingPayments: 150000 }
  }
    ↓
Display on dashboard cards
```

---

### **Flow 4: Top Clients Report (Admin)**
```
Admin (AdminFinanceReports.tsx)
    ↓
GET /admin/clients/top
    ↓
Backend SQL:
  SELECT 
    id, first_name, last_name, email, 
    total_bookings, total_spent
  FROM clients
  ORDER BY total_spent DESC
  LIMIT 10
    ↓
Returns top 10 clients by spending
    ↓
Display in table:
  Client Name | Total Bookings | Total Spent
  ─────────────────────────────────────────
  Nimal Fernando | 5 | 750,000
  Priya Rajapaksa | 3 | 450,000
  ...
```

---

## 6. KEY FILES CONNECTING ENTITIES

### **Database Connection Files:**
- **[backend/db.js](backend/db.js)** - Database pool initialization
- **[backend/server.js](backend/server.js)** - Table schemas with FOREIGN KEY definitions

### **Backend Route Files:**
- **[backend/routes/bookings.js](backend/routes/bookings.js)** ⭐ Core: Client→Booking, Admin→Booking
- **[backend/routes/clients.js](backend/routes/clients.js)** ⭐ Core: Admin↔Client
- **[backend/routes/admin.js](backend/routes/admin.js)** ⭐ Core: Admin Dashboard (all entities)
- **[backend/routes/payments.js](backend/routes/payments.js)** ⭐ Core: 3-way (Admin, Booking, Client)
- **[backend/routes/events.js](backend/routes/events.js)** - Bridge: Client↔Event↔Booking
- **[backend/routes/employees.js](backend/routes/employees.js)** - Assigned to bookings/events
- **[backend/routes/gallery.js](backend/routes/gallery.js)** - Linked to bookings
- **[backend/routes/feedback.js](backend/routes/feedback.js)** - Linked to booking+client

### **Admin Component Files:**
- **[src/app/pages/admin/AdminClients.tsx](src/app/pages/admin/AdminClients.tsx)** ⭐ Admin↔Client management
- **[src/app/pages/admin/AdminPayments.tsx](src/app/pages/admin/AdminPayments.tsx)** ⭐ Admin→Payment→Booking→Client
- **[src/app/pages/admin/AdminInvoiceDetail.tsx](src/app/pages/admin/AdminInvoiceDetail.tsx)** - Invoice view
- **[src/app/pages/bookings/BookingsManagement.tsx](src/app/pages/bookings/BookingsManagement.tsx)** ⭐ Admin↔Booking
- **[src/app/pages/admin/AdminEventManagement.tsx](src/app/pages/admin/AdminEventManagement.tsx)** - Event↔Booking↔Client

### **Client Component Files:**
- **[src/app/pages/client/ClientBookings.tsx](src/app/pages/client/ClientBookings.tsx)** ⭐ Client↔Booking view
- **[src/app/pages/bookings/CreateBooking.tsx](src/app/pages/bookings/CreateBooking.tsx)** ⭐ Client→Create Booking
- **[src/app/pages/client/ClientBookingRequest.tsx](src/app/pages/client/ClientBookingRequest.tsx)** - New booking request
- **[src/app/pages/client/ClientDashboard.tsx](src/app/pages/client/ClientDashboard.tsx)** - Client home (shows booking stats)

### **API Service File:**
- **[src/services/api.ts](src/services/api.ts)** - All API endpoint definitions

---

## 7. SUMMARY TABLE: What Connects What

| Connection | Backend Route | Frontend Component | Database Join | Purpose |
|------------|---------------|-------------------|----------------|---------|
| **Admin ↔ Clients** | `/api/clients/*` | AdminClients.tsx | `clients.*` | Admin manages all client records |
| **Admin ↔ Bookings** | `/api/bookings/*` | BookingsManagement.tsx | `bookings.*` with `LEFT JOIN clients` | Admin views/edits all bookings, sees client names |
| **Admin ↔ Payments** | `/api/payments/*` | AdminPayments.tsx | `payments JOIN bookings JOIN clients` | Admin manages payment records, linked to booking+client |
| **Client → Booking** | `POST /api/bookings` | CreateBooking.tsx | `INSERT INTO bookings (client_id, ...)` | Client creates new booking |
| **Client → Booking** | `GET /api/bookings` | ClientBookings.tsx | `SELECT ... WHERE implied client_id` | Client views their bookings |
| **Booking → Events** | `/api/events/*` | AdminEventManagement.tsx | `event_id` FK in bookings | Optional event grouping for booking |
| **Booking → Gallery** | `/api/gallery/*` | – | `booking_id` FK in gallery | Photos uploaded for completed booking |
| **Booking → Feedback** | `/api/feedback/*` | – | `booking_id` + `client_id` FK | Client feedback on booking |
| **Admin Dashboard** | `/admin/dashboard/stats` | AdminDashboard.tsx | Multiple aggregates | Real-time statistics from all tables |
| **Admin Top Clients** | `/admin/clients/top` | AdminFinanceReports.tsx | `ORDER BY total_spent DESC` | Top 10 clients by spending |
| **Admin Upcoming** | `/admin/bookings/upcoming` | – | `WHERE event_date >= CURDATE()` | Next 10 upcoming events |

---

## 8. CRITICAL CONNECTION POINTS (Must Work)

### **🔴 Critical - System Core**
1. **`bookings.client_id` → `clients.id`** 
   - Every booking must link to a client
   - Cascade delete: if client deleted, bookings deleted
   
2. **`payments.booking_id` → `bookings.id`** 
   - Every payment must link to a booking
   - Cascade delete: payment → booking deleted
   
3. **`payments.client_id` → `clients.id`**
   - Payment tracks which client paid
   - Cascade delete: payment → client deleted

### **🟡 Important - Business Logic**
4. **`bookings.client_id` → `clients.total_bookings`**
   - Must increment when booking created
   - Must increment when booking completed
   
5. **`bookings.amount` → `clients.total_spent`**
   - Must update when booking created (if confirmed)
   - Must update when booking payment completed

6. **`bookings.assigned_employees` (JSON)**
   - Stores array of employee IDs
   - Must be parsed/validated before storage
   - Used for calendar and staff scheduling

---

## 9. AUTHENTICATION & AUTHORIZATION

### **User Types and Access:**

#### **Admin (via AdminLogin.tsx)**
- Role: `admin`
- Stored in: `localStorage.userRole = 'admin'`
- Access: All routes under `/api/admin/*`, `/api/clients/*`, `/api/bookings/*`, `/api/payments/*`
- Can: Create, read, update, delete all entities

#### **Client (via ClientLogin.tsx)**
- Role: `client`
- Stored in: `localStorage.userRole = 'client'`
- Access: `/api/bookings` (filtered by client_id), `/api/payments` (by client_id)
- Can: Create bookings, view own bookings, submit feedback, access profile

#### **Auth Routes (backend/routes/auth.js)**
- `POST /api/auth/login` - Admin/Client login
- `POST /api/auth/register` - Client registration
- Should verify role and token (JWT recommended but not visible in current code)

---

## 10. RECOMMENDATIONS

### **Immediate Fixes Needed:**
1. ✅ Verify foreign key constraints are enabled in MySQL
2. ✅ Implement JWT token authentication (replace localStorage roles)
3. ✅ Add role-based access control (RBAC) middleware
4. ✅ Validate `assigned_employees` JSON array before insert/update

### **Data Integrity:**
1. ✅ Add triggers to auto-update `clients.total_bookings` when booking status changes to 'completed'
2. ✅ Add triggers to auto-update `clients.total_spent` when payment status changes to 'completed'
3. ✅ Add soft-delete (archive) instead of hard delete for audit trail

### **Performance:**
1. ✅ Add indexes on commonly joined columns (already done: `idx_client_id`, `idx_booking_id`)
2. ✅ Cache admin dashboard statistics (5-minute TTL)
3. ✅ Paginate large result sets (bookings list, client list)

### **Frontend Enhancements:**
1. ✅ Add loading spinners for API calls
2. ✅ Add error boundaries for component failures
3. ✅ Implement optimistic updates for better UX
4. ✅ Add real-time WebSocket for live booking updates

---

## 11. TESTING CHECKLIST

### **End-to-End Flow Tests:**
- [ ] Admin creates client → Verify in AdminClients.tsx
- [ ] Client creates booking → Verify in ClientBookings.tsx
- [ ] Admin updates booking status → Verify status change
- [ ] Client completes payment → Verify payment status + client.total_spent update
- [ ] Admin views payments report → All bookings linked correctly
- [ ] Admin views top clients → Sorted by total_spent correctly
- [ ] Admin views dashboard → All stats accurate and real-time

### **Database Tests:**
- [ ] Foreign key cascade deletes work
- [ ] JSON fields (assigned_employees) serialize/deserialize correctly
- [ ] Indexes are being used for performance
- [ ] No orphaned records (booking without client, payment without booking)

---

## Appendix: File Paths Summary

```
backend/
├── db.js                           (Database pool)
├── server.js                       (Routes setup + schema)
└── routes/
    ├── admin.js                    (Admin dashboard queries)
    ├── auth.js                     (Login/Register)
    ├── bookings.js                 (Booking CRUD + client join)
    ├── clients.js                  (Client CRUD)
    ├── employees.js                (Staff management)
    ├── events.js                   (Event CRUD + client join)
    ├── feedback.js                 (Feedback CRUD)
    ├── gallery.js                  (Gallery CRUD)
    └── payments.js                 (Payment CRUD + 3-way join)

src/
└── app/
    └── pages/
        ├── admin/
        │   ├── AdminClients.tsx         (Admin client management)
        │   ├── AdminPayments.tsx        (Admin payment management)
        │   ├── AdminInvoiceDetail.tsx   (Invoice view)
        │   ├── AdminEventManagement.tsx (Event management)
        │   ├── AdminDashboard.tsx       (Statistics)
        │   └── AdminLogin.tsx           (Auth)
        ├── bookings/
        │   ├── BookingsManagement.tsx   (Booking list + calendar)
        │   ├── CreateBooking.tsx        (New booking form)
        │   ├── BookingDetails.tsx       (Booking details)
        │   └── BookingsList.tsx         (Booking list view)
        └── client/
            ├── ClientBookings.tsx       (Client's bookings)
            ├── ClientBookingRequest.tsx (New request)
            ├── ClientDashboard.tsx      (Client home)
            ├── ClientLogin.tsx          (Auth)
            └── ClientProfile.tsx        (Profile)

services/
└── api.ts                           (API client)
```

---

**Last Updated:** April 21, 2026  
**Status:** Complete Analysis
