#  Booking System Guide - Customer vs Admin

## Overview

The Ambiance Studio application has **TWO SEPARATE** booking systems:

1. **Customer Booking Requests** (`/client/*`) - For customers to submit booking requests
2. **Admin Booking Management** (`/admin/bookings/*`) - For admins to manage all bookings

---

## 👥 **CUSTOMER FLOW** (Public Users)

### **Access:**
- URL: `/client/*`
- No admin privileges required
- Must register/login as a client

### **Customer Journey:**

```
1. Visit Website (/) 
   ↓
2. Click "Book Now" button
   ↓
3. Login/Register (/client/login or /client/register)
   ↓
4. Customer Dashboard (/client/dashboard)
   ↓
5. Submit Booking Request (/client/book)
   ↓
6. View Request Status (/client/bookings)
```

### **What Customers CAN Do:**

 **Register an Account** (`/client/register`)
- Create profile with email, phone, password
- Upload profile photo
- Accept terms and conditions

 **Login** (`/client/login`)
- Access their personal dashboard
- View profile and booking history

✅ **Submit Booking Requests** (`/client/book`)
- Choose service type (Wedding, Event, Studio, etc.)
- Select preferred date
- Choose time window
- Add special notes/requirements
- Submit request for admin review

**View Booking History** (`/client/bookings`)
- See all submitted requests
- View request status (Pending, Confirmed, Completed, etc.)
- Check scheduled dates
- View assigned photographer

✅ **Update Profile** (`/client/profile`)
- Change personal information
- Update contact details
- Change password

### **What Customers CANNOT Do:**

❌ Access admin booking management (`/admin/bookings`)
❌ Create confirmed bookings directly
❌ Assign photographers
❌ Manage packages or pricing
❌ View other customers' bookings
❌ Access payment/invoice management
❌ View reports or analytics

---

## 🔐 **ADMIN FLOW** (Studio Staff)

### **Access:**
- URL: `/admin/*`
- Requires admin login
- Protected routes with authentication check

### **Admin Journey:**

```
1. Admin Login (/admin/login)
   ↓
2. Admin Dashboard (/admin/dashboard)
   ↓
3. Booking Management (/admin/bookings)
   ↓
4. Review Customer Requests
   ↓
5. Create/Confirm Bookings
   ↓
6. Manage Calendar & Resources
```

### **What Admins CAN Do:**

✅ **View All Customer Requests**
- See all submitted booking requests
- Filter by status, type, date
- Search by client name or ID

✅ **Create Bookings** (`/admin/bookings/new`)
- Create bookings directly (skip request process)
- Assign photographers
- Set dates, times, packages
- Confirm booking immediately

✅ **Manage Bookings** (`/admin/bookings`)
- **List View:** Table of all bookings with filters
- **Calendar View:** Visual calendar with availability
- **Packages View:** Manage service packages

✅ **Approve/Reject Requests**
- Review customer booking requests
- Convert requests into confirmed bookings
- Assign resources (photographers, equipment)
- Set final pricing

✅ **Calendar Management** (`/admin/calendar`)
- View booking schedule
- Check availability by date/time
- Prevent double bookings
- Manage time slots

✅ **Package Management** (`/admin/packages`)
- Create service packages
- Set pricing and duration
- Manage package details
- Activate/deactivate packages

✅ **Full System Access**
- Employee management
- Payment & invoice management
- Event management
- Gallery management
- Reports and analytics

### **What Admins CANNOT See:**

❌ Customer passwords (encrypted)
❌ Individual client portal views (designed for clients)

---

##  **KEY DIFFERENCES**

| Feature | Customer | Admin |
|---------|----------|-------|
| **Access Level** | Limited to own data | Full system access |
| **Booking Creation** | Submit requests only | Create confirmed bookings |
| **View Permissions** | Own bookings only | All bookings |
| **Photographer Assignment** | No | Yes |
| **Package Management** | View only | Full CRUD |
| **Calendar Access** | No | Full calendar management |
| **Pricing Control** | No | Yes |
| **Payment Management** | View own payments | Manage all payments |
| **Reports** | No | Yes |

---

## 🔄 **BOOKING REQUEST WORKFLOW**

### **Complete Flow:**

```
┌─────────────────┐
│  CUSTOMER       │
│  Submits        │
│  Request        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Request        │
│  Created        │
│  Status:PENDING │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ADMIN          │
│  Reviews        │
│  Request        │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────┐   ┌─────┐
│APPROVE  │REJECT│
└──┬──┘   └──┬──┘
   │         │
   ▼         ▼
┌─────┐   ┌─────┐
│CREATE│  │NOTIFY│
│BOOKING  │CLIENT│
└──┬──┘   └─────┘
   │
   ▼
┌─────────────────┐
│  Assign         │
│  Photographer   │
│  Set Date/Time  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  BOOKING        │
│  CONFIRMED      │
│  Status:CONFIRMED
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Customer       │
│  Notified       │
│  Can View Details
└─────────────────┘
```

---

## 🛡️ **ROUTE PROTECTION**

### **Customer Routes:**
```javascript
// Protected by client authentication
/client/dashboard    → Requires userRole === 'client'
/client/profile      → Requires userRole === 'client'
/client/book         → Requires userRole === 'client'
/client/bookings     → Requires userRole === 'client'
```

### **Admin Routes:**
```javascript
// Protected by admin authentication
/admin/dashboard     → Requires userRole === 'admin'
/admin/bookings      → Requires userRole === 'admin'
/admin/bookings/new  → Requires userRole === 'admin'
/admin/bookings/:id  → Requires userRole === 'admin'
/admin/calendar      → Requires userRole === 'admin'
/admin/packages      → Requires userRole === 'admin'
/admin/payments      → Requires userRole === 'admin'
```

### **Navigation Visibility:**

**Public Website Navigation (Not logged in):**
- Home, About, Packages, Team, Blog, Contact
- **"Book Now"** button → Redirects to `/client/login`

**Customer Navigation (Logged in as client):**
- User menu with: Dashboard, Profile, Logout
- **No access** to admin areas

**Admin Navigation (Logged in as admin):**
- Full admin sidebar with all management options
- **No public navigation** shown on admin pages

---

## 📱 **USER EXPERIENCE**

### **Customer Experience:**

**Home Page:**
```
┌──────────────────────────────┐
│ [Logo]  Home About Packages  │
│                 [BOOK NOW]   │ ← Click here
└──────────────────────────────┘
```

**After Login:**
```
┌──────────────────────────────┐
│ Welcome, John!               │
│                              │
│ ┌──────┐ ┌──────┐ ┌──────┐ │
│ │Profile│ │ Book │ │History│
│ └──────┘ └──────┘ └──────┘ │
│                              │
│ Recent Bookings:             │
│ • Wedding - Pending          │
│ • Birthday - Confirmed       │
└──────────────────────────────┘
```

### **Admin Experience:**

**Admin Dashboard:**
```
┌──────────────────────────────┐
│ Admin Dashboard              │
├──────────────────────────────┤
│                              │
│ [Employees] [Events]         │
│ [Bookings]  [Payments]       │
│ [Gallery]   [Reports]        │
│                              │
│ Pending Requests: 5          │
│ Today's Bookings: 3          │
└──────────────────────────────┘
```

**Booking Management:**
```
┌──────────────────────────────┐
│ Bookings & Services          │
├──────────────────────────────┤
│ [List] [Calendar] [Packages] │
├──────────────────────────────┤
│                              │
│ [Search...] [Filter] [+NEW]  │
│                              │
│ BK-1001 | John Doe | Wedding │
│ BK-1002 | Mary Lee | Event   │
│ REQ-045 | Sam Wong | Request │← Customer request
└──────────────────────────────┘
```

---

## 🎨 **THEME CONSISTENCY**

Both customer and admin interfaces use the **Ambiance Studio Theme**:

**Colors:**
- Background: `#000000` (black)
- Cards: `from-[#2a0f0f] to-black` (burgundy gradient)
- Primary: `#EAB308` (yellow-500)
- Text: `#FFFFFF` (white)
- Secondary: `#9CA3AF` (gray-400)

**Design Elements:**
- Dark elegant cards
- Golden yellow accents
- Burgundy gradients
- Smooth animations
- Consistent typography

---

## ✅ **TESTING THE SYSTEM**

### **Test as Customer:**

1. **Register:**
   ```
   Visit: /client/register
   Fill: Name, Email, Phone, Password
   Submit: Create account
   ```

2. **Login:**
   ```
   Visit: /client/login
   Enter: Email & Password
   Click: Sign In
   ```

3. **Submit Request:**
   ```
   Visit: /client/book
   Select: Service type
   Choose: Date & time
   Add: Notes
   Submit: Request
   ```

4. **View History:**
   ```
   Visit: /client/bookings
   See: All your requests
   Check: Status of each
   ```

### **Test as Admin:**

1. **Login:**
   ```
   Visit: /admin/login
   Enter: admin@ambiance.lk / password
   Click: Sign In
   ```

2. **View Bookings:**
   ```
   Visit: /admin/bookings
   See: All bookings & requests
   Filter: By status/type
   ```

3. **Create Booking:**
   ```
   Visit: /admin/bookings/new
   Fill: Client, package, date
   Assign: Photographer
   Save: Confirm booking
   ```

4. **Manage Calendar:**
   ```
   Visit: /admin/calendar
   View: Monthly calendar
   Check: Availability
   ```

---

## 🚀 **QUICK ACCESS URLs**

### **Customer:**
- Login: `http://localhost:5173/client/login`
- Register: `http://localhost:5173/client/register`
- Dashboard: `http://localhost:5173/client/dashboard`
- Book: `http://localhost:5173/client/book`
- History: `http://localhost:5173/client/bookings`

### **Admin:**
- Login: `http://localhost:5173/admin/login`
- Dashboard: `http://localhost:5173/admin/dashboard`
- Bookings: `http://localhost:5173/admin/bookings`
- Calendar: `http://localhost:5173/admin/calendar`
- Payments: `http://localhost:5173/admin/payments`

---

## 🔒 **SECURITY NOTES**

1. **Route Protection:**
   - All `/client/*` routes check for `userRole === 'client'`
   - All `/admin/*` routes check for `userRole === 'admin'`
   - Unauthorized access redirects to login

2. **Data Isolation:**
   - Customers see only their own bookings
   - Admins see all bookings system-wide

3. **Navigation Hiding:**
   - Admin nav hidden from customers
   - Public nav hidden on admin pages
   - Client nav hidden on public pages

4. **Authentication:**
   - LocalStorage tracks user role
   - useEffect hooks verify role on mount
   - Toast notifications for access denials

---

## 📊 **DATA FLOW**

```
Customer Request → Database (status: pending)
                      ↓
                 Admin Reviews
                      ↓
            Approve / Reject
                      ↓
        Create Booking (status: confirmed)
                      ↓
        Assign Resources (photographer, equipment)
                      ↓
        Customer Sees Confirmation
                      ↓
        Booking Complete (status: completed)
```

---

**Summary:** Customers submit requests through `/client/*` routes. Admins manage everything through `/admin/*` routes. The systems are completely separated by authentication and permissions, with admins having full visibility and control while customers have limited, personal access.

