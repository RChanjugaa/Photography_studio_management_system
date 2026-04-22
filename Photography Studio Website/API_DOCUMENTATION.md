# Ambiance Photo Services - API Documentation

Complete REST API documentation for the backend server.

## Base URL
```
http://localhost:5000/api
```

## Response Format
All responses are in JSON format with standard structure:
```json
{
  "success": true/false,
  "message": "Description",
  "data": {}
}
```

---

## 🔐 Authentication Endpoints

### Admin Login
```http
POST /auth/admin-login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin login successful",
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@ambiance.lk",
    "token": "token_string"
  }
}
```

### Admin Register
```http
POST /auth/admin-register
Content-Type: application/json

{
  "username": "newadmin",
  "password": "password123",
  "email": "admin@example.com"
}
```

### Client Login
```http
POST /auth/client-login
Content-Type: application/json

{
  "email": "client@email.com",
  "password": "password123"
}
```

### Client Register
```http
POST /auth/client-register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@email.com",
  "phone": "+94 77 123 4567",
  "password": "password123"
}
```

---

## 👥 Clients Endpoints

### Get All Clients
```http
GET /clients
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "first_name": "Nimal",
      "last_name": "Fernando",
      "email": "nimal@email.com",
      "phone": "+94 77 345 6789",
      "status": "active",
      "registration_date": "2024-03-15T10:30:00Z",
      "last_login": "2024-03-20T15:45:00Z",
      "total_bookings": 3,
      "total_spent": 250000,
      "email_verified": true
    }
  ],
  "total": 1
}
```

### Get Single Client
```http
GET /clients/:id
```

### Create Client (Admin)
```http
POST /clients
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@email.com",
  "phone": "+94 77 123 4567",
  "status": "active"
}
```

### Update Client
```http
PUT /clients/:id
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@email.com",
  "phone": "+94 77 123 4567",
  "status": "active"
}
```

### Delete Client
```http
DELETE /clients/:id
```

### Client Statistics
```http
GET /clients/stats/overview
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 24,
    "active": 18,
    "inactive": 4,
    "pending": 2,
    "verified": 20,
    "total_revenue": 5250000
  }
}
```

---

## 📅 Bookings Endpoints

### Get All Bookings
```http
GET /bookings
```

### Get Single Booking
```http
GET /bookings/:id
```

### Create Booking
```http
POST /bookings
Content-Type: application/json

{
  "clientId": 1,
  "eventId": 1,
  "serviceType": "Photography",
  "bookingDate": "2024-03-23",
  "eventDate": "2024-04-15",
  "eventTime": "10:00",
  "duration": 8,
  "location": "Grand Hotel",
  "amount": 150000,
  "notes": "Wedding photography",
  "assignedEmployees": [1, 2]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": 5,
    "bookingNumber": "BK1711194000123"
  }
}
```

### Update Booking
```http
PUT /bookings/:id
Content-Type: application/json

{
  "serviceType": "Photography",
  "eventDate": "2024-04-15",
  "eventTime": "10:00",
  "location": "Grand Hotel",
  "amount": 150000,
  "status": "confirmed",
  "notes": "Updated notes"
}
```

### Update Booking Status
```http
PATCH /bookings/:id/status
Content-Type: application/json

{
  "status": "completed"
}
```

Valid statuses: `pending`, `confirmed`, `in_progress`, `completed`, `cancelled`

### Delete Booking
```http
DELETE /bookings/:id
```

### Booking Statistics
```http
GET /bookings/stats/overview
```

---

## 👨‍💼 Employees Endpoints

### Get All Employees
```http
GET /employees
```

### Get Single Employee
```http
GET /employees/:id
```

### Create Employee
```http
POST /employees
Content-Type: application/json

{
  "firstName": "Amaya",
  "lastName": "Silva",
  "email": "amaya@ambiance.lk",
  "phone": "+94 77 123 4567",
  "role": "Lead Photographer",
  "status": "active",
  "visiblePublic": true,
  "joinDate": "2016-03-15",
  "bio": "Specialized in wedding photography",
  "specialties": ["Weddings", "Portraits"],
  "baseSalary": 120000
}
```

### Update Employee
```http
PUT /employees/:id
Content-Type: application/json

{
  "firstName": "Amaya",
  "lastName": "Silva",
  "email": "amaya@ambiance.lk",
  "phone": "+94 77 123 4567",
  "role": "Lead Photographer",
  "status": "active",
  "visiblePublic": true,
  "bio": "Updated bio",
  "specialties": ["Weddings", "Portraits", "Events"],
  "baseSalary": 125000
}
```

### Delete Employee
```http
DELETE /employees/:id
```

### Get Public Employees
```http
GET /employees/public/gallery
```

---

## 🎉 Events Endpoints

### Get All Events
```http
GET /events
```

### Get Single Event
```http
GET /events/:id
```

### Create Event
```http
POST /events
Content-Type: application/json

{
  "eventType": "Wedding",
  "eventName": "Silva-Perera Wedding",
  "description": "Grand wedding ceremony",
  "eventDate": "2024-04-15",
  "eventTime": "10:00",
  "location": "Grand Hotel Colombo",
  "clientId": 1,
  "assignedEmployees": [1, 2, 3],
  "budget": 500000
}
```

Event types: `DJ`, `Music`, `Party`, `Wedding`, `Corporate`, `Birthday`

### Update Event
```http
PUT /events/:id
Content-Type: application/json

{
  "eventType": "Wedding",
  "eventName": "Silva-Perera Wedding",
  "description": "Grand wedding ceremony",
  "eventDate": "2024-04-15",
  "eventTime": "10:00",
  "location": "Grand Hotel Colombo",
  "status": "confirmed",
  "assignedEmployees": [1, 2, 3],
  "budget": 500000
}
```

### Update Event Status
```http
PATCH /events/:id/status
Content-Type: application/json

{
  "status": "completed"
}
```

Valid statuses: `pending`, `confirmed`, `completed`, `cancelled`

### Delete Event
```http
DELETE /events/:id
```

### Get Events by Type
```http
GET /events/type/Wedding
```

---

## 💳 Payments Endpoints

### Get All Payments
```http
GET /payments
```

### Get Single Payment
```http
GET /payments/:id
```

### Create Payment
```http
POST /payments
Content-Type: application/json

{
  "bookingId": 1,
  "clientId": 1,
  "amount": 75000,
  "paymentMethod": "bank_transfer",
  "dueDate": "2024-04-10",
  "notes": "Advance payment"
}
```

Payment methods: `cash`, `credit_card`, `bank_transfer`, `cheque`

**Response:**
```json
{
  "success": true,
  "message": "Payment record created successfully",
  "data": {
    "id": 5,
    "invoiceNumber": "INV1711194000789"
  }
}
```

### Update Payment
```http
PUT /payments/:id
Content-Type: application/json

{
  "amount": 80000,
  "paymentMethod": "credit_card",
  "dueDate": "2024-04-15",
  "notes": "Updated notes"
}
```

### Mark Payment Complete
```http
PATCH /payments/:id/complete
```

### Delete Payment
```http
DELETE /payments/:id
```

### Payment Statistics
```http
GET /payments/stats/overview
```

### Get Payments by Client
```http
GET /payments/client/:clientId
```

---

## 📊 Admin Dashboard Endpoints

### Dashboard Statistics
```http
GET /admin/dashboard/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "clients": {
      "total": 24,
      "active": 18
    },
    "bookings": {
      "total": 18,
      "pending": 3,
      "total_value": 2700000
    },
    "employees": {
      "total": 12,
      "active": 11
    },
    "events": {
      "total": 4,
      "pending": 1
    },
    "payments": {
      "total_revenue": 1800000,
      "pending_payments": 900000
    }
  }
}
```

### Recent Activity
```http
GET /admin/activity/recent
```

### Revenue Report
```http
GET /admin/reports/revenue
```

### Bookings Report
```http
GET /admin/reports/bookings
```

### Top Clients
```http
GET /admin/clients/top
```

### Upcoming Bookings
```http
GET /admin/bookings/upcoming
```

### Performance Metrics
```http
GET /admin/metrics/performance
```

---

## ✅ Health Check

### Server Status
```http
GET /health
```

**Response:**
```json
{
  "status": "Server is running",
  "timestamp": "2024-03-23T10:30:00.000Z"
}
```

---

## 🔍 Query Parameters

Some endpoints support filtering:

### Example: Get Bookings with Filter
```http
GET /bookings?status=pending&serviceType=Photography
```

### Example: Limit Results
```http
GET /clients?limit=10&offset=20
```

---

## ❌ Error Responses

### 404 Not Found
```json
{
  "success": false,
  "message": "Client not found"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Missing required fields"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 🧪 Testing with cURL

### Get All Clients
```bash
curl http://localhost:5000/api/clients
```

### Create a Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": 1,
    "serviceType": "Photography",
    "eventDate": "2024-04-15",
    "amount": 150000
  }'
```

### Update Booking Status
```bash
curl -X PATCH http://localhost:5000/api/bookings/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

---

## 📝 Data Types

- `string` - Text
- `number` - Integer or decimal
- `boolean` - true/false
- `date` - YYYY-MM-DD format
- `datetime` - YYYY-MM-DD HH:MM:SS format
- `array` - JSON array
- `object` - JSON object

---

## 🔒 Authentication

Current implementation uses simple token-based authentication. In production:
- Use JWT tokens
- Add Bearer token to headers
- Implement token expiration
- Add refresh tokens

---

**Last Updated**: March 23, 2026
**API Version**: 1.0.0
