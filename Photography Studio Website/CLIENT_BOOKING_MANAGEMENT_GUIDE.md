# Client & Booking Management System - Complete Guide

## 🎯 Overview

The Ambiance Photography Studio Client & Booking Management System provides comprehensive client authentication, profile management, booking request submission, and full booking lifecycle management for staff/admin.

---

## 📋 Table of Contents

1. [System Architecture](#system-architecture)
2. [Module Boundaries](#module-boundaries)
3. [Access Levels](#access-levels)
4. [How to Access](#how-to-access)
5. [Feature Breakdown](#feature-breakdown)
6. [Routes Reference](#routes-reference)
7. [Design System](#design-system)

---

## 🏗️ System Architecture

### **Two-Part System:**

```
┌─────────────────────────────────────────────────┐
│      CLIENT MANAGEMENT (S. Anchuga)             │
│  • Client Authentication (Register/Login)       │
│  • Profile Management                           │
│  • Booking Request Submission (Request Only)    │
│  • Booking History (Read-Only View)             │
└─────────────────────────────────────────────────┘
                      ↓
              Booking Requests
                      ↓
┌─────────────────────────────────────────────────┐
│     BOOKING MANAGEMENT (R. Chanjugaa)           │
│  • Booking Creation & Scheduling                │
│  • Booking CRUD Operations                      │
│  • Service Package Management                   │
│  • Calendar & Availability                      │
│  • Status Transitions & Lifecycle               │
└─────────────────────────────────────────────────┘
```

---

## 🔐 Module Boundaries

### **CLIENT MANAGEMENT (S. Anchuga)**

**Responsibilities:**
- ✅ Client registration and authentication
- ✅ Client profile management (view/edit)
- ✅ **Booking REQUEST submission** (intent only)
- ✅ Booking history **READ-ONLY** view
- ✅ Client dashboard

**Does NOT Handle:**
- ❌ Actual booking creation/scheduling
- ❌ Booking editing or rescheduling
- ❌ Booking confirmation or cancellation
- ❌ Service package management
- ❌ Calendar management

---

### **BOOKING MANAGEMENT (R. Chanjugaa)**

**Responsibilities:**
- ✅ Create bookings from client requests
- ✅ Full booking CRUD operations
- ✅ Service package management
- ✅ Calendar and availability view
- ✅ Status transitions (Pending → Confirmed → Completed)
- ✅ Reschedule and cancellation
- ✅ Conflict detection

**Does NOT Handle:**
- ❌ Client authentication/registration
- ❌ Client profile management
- ❌ Photo delivery or feedback
- ❌ Events gallery management
- ❌ Payments or invoicing
- ❌ Staff management

---

## 🔐 Access Levels

### **1. CLIENT (Authenticated)**

**What They Can Do:**
- ✅ Register and log in
- ✅ View/edit their profile
- ✅ Upload profile avatar
- ✅ Submit booking requests (intent only)
- ✅ View booking history (read-only)
- ✅ See booking statuses

**What They CANNOT Do:**
- ❌ Create actual bookings
- ❌ Edit booking details
- ❌ Reschedule bookings
- ❌ Cancel confirmed bookings
- ❌ Access admin features
- ❌ Manage packages

---

### **2. STAFF (Authenticated)**

**What They Can Do:**
- ✅ View all booking requests
- ✅ Convert requests to bookings
- ✅ Create bookings manually
- ✅ View calendar
- ✅ Update booking details
- ✅ Change booking status

**What They CANNOT Do:**
- ❌ Delete bookings (admin only)
- ❌ Manage service packages
- ❌ Access analytics

---

### **3. ADMIN (Full Access)**

**Full Permissions:**
- ✅ All staff permissions
- ✅ Manage service packages
- ✅ Delete/archive bookings
- ✅ View analytics
- ✅ Export booking data
- ✅ Manage client accounts

---

## 🚀 How to Access

### **Client Portal**

**Option 1: New Client Registration**
```
1. Visit: /client/register
2. Fill in: Name, Email, Phone, Password
3. Upload profile photo (optional)
4. Agree to terms
5. Click "Create Account"
6. Auto-redirect to /client/dashboard
```

**Option 2: Existing Client Login**
```
1. Visit: /client/login
2. Enter: Email + Password
3. Click "Sign In"
4. Redirect to /client/dashboard
```

**Quick Test (Development):**
```javascript
// In browser console:
localStorage.setItem('isAuthenticated', 'true');
localStorage.setItem('userRole', 'client');
localStorage.setItem('userName', 'Sarah Silva');
localStorage.setItem('userEmail', 'sarah@example.com');
localStorage.setItem('userId', 'CLT-123');

// Then visit: /client/dashboard
```

---

### **Staff/Admin Booking Management**

**Access:**
```
1. Login: /staff/login or /admin/login
2. Navigate: /bookings
3. Tabs: List | Calendar | Packages
```

---

## ✨ Feature Breakdown

### **📝 CLIENT REGISTRATION** (`/client/register`)

#### **Form Fields:**

**Required:**
- Full Name
- Email Address
- Phone Number
- Password (minimum 8 characters)
- Confirm Password

**Optional:**
- Profile Photo Upload (max 5MB)

#### **Validation:**
- Email format check
- Password strength (8+ chars)
- Password match confirmation
- Phone format validation
- Terms & Conditions checkbox

#### **Success Flow:**
```
1. Fill form
2. Validation passes
3. API creates account
4. Auto-login
5. Redirect to /client/dashboard
6. Welcome toast message
```

---

### **🔑 CLIENT LOGIN** (`/client/login`)

#### **Features:**
- Email/Password authentication
- Show/Hide password toggle
- "Remember me" checkbox
- "Forgot password?" link
- Link to registration

#### **Form Fields:**
- Email Address
- Password

#### **Success:**
```
Login → Dashboard redirect
```

#### **Failure:**
```
Wrong credentials → Inline error message
```

---

### **🏠 CLIENT DASHBOARD** (`/client/dashboard`)

#### **Layout:**

**Header:**
- Ambiance Studio logo
- "Client Portal" label
- Logout button

**Welcome Section:**
```
"Welcome back, {FirstName}!"
"Manage your bookings and profile from your dashboard"
```

---

#### **3 Quick Action Cards:**

**1. My Profile**
- Icon: User (blue gradient)
- Link: `/client/profile`
- Description: "Update your personal information and preferences"

**2. Request a Booking**
- Icon: Calendar (green gradient)
- Link: `/client/book`
- Description: "Submit a new booking request for our services"

**3. Booking History**
- Icon: File (purple gradient)
- Link: `/client/bookings`
- Description: "View all your past and upcoming bookings"

---

#### **Recent Bookings Section:**

**Displays:**
- 3 most recent bookings
- Booking type
- Date & time
- Status badge
- Booking ID
- "View All" button

**Empty State:**
```
No bookings yet
Start by requesting a booking
```

---

### **👤 CLIENT PROFILE** (`/client/profile`)

#### **Layout: 2 Columns**

**Left Column (Avatar Card):**
- Profile photo preview (128×128)
- Upload button (bottom-right overlay)
- User name
- User email

**Right Column (Profile Form):**
- Personal information form
- Change password toggle
- Save/Cancel buttons

---

#### **Editable Fields:**

**Personal Info:**
- Full Name (editable)
- Email Address (read-only, unique identifier)
- Phone Number (editable)

**Change Password Section (Toggle):**
- Current Password
- New Password
- Confirm New Password

---

#### **Avatar Upload:**
- Click icon to upload
- Max file size: 5MB
- Formats: JPG, PNG, WebP
- Preview before save
- Circular crop preview

---

### **📅 BOOKING REQUEST** (`/client/book`)

#### **Purpose:**
**IMPORTANT:** This page does NOT create actual bookings. It submits a booking REQUEST that staff will convert to a scheduled booking.

---

#### **Service Type Selection (Required):**

**6 Service Options:**
- 💍 Wedding Photography
- 🎉 Event Photography
- 📸 Studio Portrait
- 🌳 Outdoor Photoshoot
- 💼 Corporate Event
- 🎂 Birthday Party

**UI:** Grid of clickable cards with icons

---

#### **Preferred Date (Required):**
- Date picker
- Minimum: Today
- Calendar icon
- Format: YYYY-MM-DD

---

#### **Preferred Time Window (Required):**

**4 Time Options:**
- Morning (8:00 AM - 12:00 PM)
- Afternoon (12:00 PM - 4:00 PM)
- Evening (4:00 PM - 8:00 PM)
- Full Day

**UI:** Dropdown select

---

#### **Additional Notes (Optional):**
- Multiline textarea (5 rows)
- 500 character limit
- Placeholder: "Tell us more about your requirements..."

---

#### **"What Happens Next?" Info Box:**

**3 Steps Explained:**
1. Our team will review your booking request
2. We'll contact you within 24 hours to confirm availability
3. You'll receive a confirmation email with booking details

---

#### **Submit Behavior:**

**API Call:**
```
POST /api/booking-requests
{
  "clientId": "CLT-123",
  "serviceType": "Wedding",
  "preferredDate": "2024-04-15",
  "preferredTimeWindow": "Evening",
  "notes": "Outdoor preferred"
}
```

**Response:**
```
{
  "requestId": "REQ-789",
  "status": "RequestPending",
  "createdAt": "2024-03-21T10:10:00Z"
}
```

**Success Flow:**
```
Submit → Success toast → Redirect to /client/bookings
```

---

### **📋 BOOKING HISTORY** (`/client/bookings`)

#### **Read-Only View**

**Table Columns:**
1. **Booking ID** - Unique identifier (e.g., BK-2024-101, REQ-2024-045)
2. **Type** - Service type
3. **Requested Date** - Client's preferred date
4. **Scheduled Date** - Actual scheduled date/time (if confirmed)
5. **Status** - Color-coded badge
6. **Action** - "View" button only (no edit/cancel)

---

#### **Status Badges:**

**Color Coding:**
- 🟢 **Confirmed** - Green background
- 🔵 **Pending** - Blue background
- 🟡 **Request Pending** - Yellow background
- ⚫ **Completed** - Gray background
- 🔴 **Cancelled** - Red background

---

#### **Additional Info (Per Row):**
- Package name (if assigned)
- Photographer name (if assigned)

---

#### **Features:**
- ✅ View all bookings and requests
- ✅ See status updates in real-time
- ✅ Click "View" for details
- ❌ NO edit/reschedule buttons
- ❌ NO cancel buttons
- ❌ NO status change controls

**Why?** All booking management belongs to Staff/Admin module (Chanjugaa)

---

#### **Empty State:**
```
No bookings yet
Start by requesting your first booking
[Request a Booking] button
```

---

## 🗺️ Routes Reference

### **Client Routes (Public)**
```
GET  /client/register         → Registration Page
GET  /client/login            → Login Page
POST /api/client/register     → Create Account
POST /api/client/login        → Authenticate
```

### **Client Routes (Authenticated)**
```
GET  /client/dashboard        → Client Dashboard
GET  /client/profile          → Profile Management
GET  /client/book             → Booking Request Form
GET  /client/bookings         → Booking History (Read-Only)
PUT  /api/client/profile/:id  → Update Profile
POST /api/client/avatar       → Upload Avatar
```

### **Booking Request API (Client → Staff)**
```
POST /api/booking-requests    → Submit Booking Request
{
  "clientId": "CLT-123",
  "serviceType": "Wedding",
  "preferredDate": "2024-04-15",
  "preferredTimeWindow": "Evening",
  "notes": "..."
}
```

### **Booking History API (Read-Only for Client)**
```
GET  /api/bookings/client/:clientId  → Get Client's Bookings
Response:
[
  {
    "id": "BK-1205",
    "type": "Wedding",
    "requestedDate": "2024-03-15",
    "scheduledDate": "2024-03-16T14:00:00Z",
    "status": "Confirmed",
    "package": "Wedding Premium",
    "photographer": "Amaya Silva"
  }
]
```

---

## 🎨 Design System (ShootProof Style)

### **Color Palette:**

**CSS Variables:**
```css
:root {
  --primary-blue: #4C8BF5;
  --white: #FFF;
  --light-grey: #F3F4F6;
  --grey: #D1D5DB;
  --dark-grey: #1F2937;
  --pastel-blue: #C7E0FF;
  --pastel-lavender: #E3D9FF;
  --pastel-peach: #FFE7D6;
  --success: #27AE60;
  --error: #E63946;
  --radius: 10px;
  --shadow-soft: 0 2px 6px rgba(0,0,0,.05);
}
```

---

### **Typography:**

**Font Family:**
- Inter (Google Fonts)

**Weights:**
- Headings: 600–700 (Semibold to Bold)
- Body: 400–500 (Regular to Medium)

**Sizes:**
- H1: 48px (3xl)
- H2: 36px (2xl)
- H3: 28px (xl)
- Body: 16–18px (base)

---

### **Components:**

**Cards:**
- Background: White
- Border: None (shadow only)
- Shadow: `0 2px 6px rgba(0,0,0,.05)`
- Radius: 10px
- Padding: 24px–48px

**Buttons:**
- Primary: Blue (#4C8BF5) background
- Height: 48px (h-12)
- Border-radius: 8px
- Font-weight: 600
- Hover: Darker shade

**Inputs:**
- Height: 48px (h-12)
- Border: 1px solid #D1D5DB
- Focus: Blue ring
- Radius: 8px

**Badges:**
- Border-radius: 6px
- Padding: 4px 12px
- Font-size: 14px
- Font-weight: 500

---

### **Background Gradient:**
```css
background: linear-gradient(
  to bottom right, 
  #EFF6FF, /* blue-50 */
  #FFFFFF, /* white */
  #FAF5FF  /* purple-50 */
);
```

---

### **Status Badge Colors:**

**Confirmed:**
```css
background: #D1FAE5; /* green-100 */
color: #065F46;      /* green-700 */
border: #A7F3D0;     /* green-200 */
```

**Pending:**
```css
background: #DBEAFE; /* blue-100 */
color: #1E40AF;      /* blue-700 */
border: #BFDBFE;     /* blue-200 */
```

**Request Pending:**
```css
background: #FEF3C7; /* yellow-100 */
color: #92400E;      /* yellow-700 */
border: #FDE68A;     /* yellow-200 */
```

**Completed:**
```css
background: #F3F4F6; /* gray-100 */
color: #374151;      /* gray-700 */
border: #E5E7EB;     /* gray-200 */
```

**Cancelled:**
```css
background: #FEE2E2; /* red-100 */
color: #991B1B;      /* red-700 */
border: #FECACA;     /* red-200 */
```

---

## 💡 Key Features

✅ **Client Authentication** - Secure registration and login  
✅ **Profile Management** - Edit details, upload avatar  
✅ **Booking Requests** - Submit intent (not create booking)  
✅ **Booking History** - Read-only view with status  
✅ **Service Selection** - 6 photography service types  
✅ **Date Preferences** - Date picker + time windows  
✅ **Status Tracking** - Real-time status updates  
✅ **Responsive Design** - Mobile-friendly layout  
✅ **ShootProof Theme** - Clean, professional UI  
✅ **Form Validation** - Comprehensive client-side checks  

---

## 🔐 Security & Privacy

### **Authentication:**
- JWT token storage (httpOnly recommended)
- Secure password hashing (backend)
- Password strength requirements (8+ chars)
- Session management

### **Authorization:**
- Role-based access control
- Client can only view own data
- Protected routes with auth guards
- Auto-redirect if not authenticated

### **Data Privacy:**
- Email as unique identifier
- No public exposure of client PII
- Profile data encrypted in transit
- Secure avatar upload

---

## 📊 Data Models

### **clients Table:**
```sql
{
  id: "CLT-123",
  name: "Sarah Silva",
  email: "sarah@example.com",
  phone: "+94 77 123 4567",
  avatarUrl: "https://...",
  createdAt: "2024-03-21T10:00:00Z"
}
```

### **booking_requests Table:**
```sql
{
  requestId: "REQ-789",
  clientId: "CLT-123",
  serviceType: "Wedding",
  preferredDate: "2024-04-15",
  preferredTimeWindow: "Evening",
  notes: "Outdoor preferred",
  status: "RequestPending",
  createdAt: "2024-03-21T10:10:00Z"
}
```

### **bookings Table (Read-Only for Client):**
```sql
{
  id: "BK-1205",
  clientId: "CLT-123",
  packageId: "PKG-101",
  scheduledStart: "2024-04-15T18:00:00Z",
  scheduledEnd: "2024-04-15T22:00:00Z",
  status: "Confirmed",
  notes: "...",
  assignedPhotographerId: "STF-77",
  createdAt: "2024-03-21T11:00:00Z"
}
```

---

## 🔄 Workflow: Request to Booking

### **Step-by-Step:**

**1. Client Submits Request:**
```
/client/book → Submit form → POST /api/booking-requests
Status: "RequestPending"
```

**2. Staff Receives Request:**
```
/bookings → View requests tab → See pending requests
```

**3. Staff Converts to Booking:**
```
Click request → "Create Booking" → 
Select package, assign photographer, confirm date/time →
POST /api/bookings
Status: "Pending" or "Confirmed"
```

**4. Client Sees Update:**
```
/client/bookings → Request becomes booking
Status changes: "RequestPending" → "Confirmed"
ScheduledDate populated
```

---

## 📞 Support & Handoffs

### **From Client Module (Anchuga):**
- ✅ Provides: Booking requests
- ✅ Consumes: Booking history (read-only)
- ✅ Dependency: Service packages list (for request dropdown)

### **To Booking Module (Chanjugaa):**
- ✅ Receives: Booking request payloads
- ✅ Provides: Booking history endpoint
- ✅ Provides: Packages list for client selection

---

## 🚀 Testing Checklist

### **Registration:**
- [ ] Prevents invalid email format
- [ ] Requires 8+ character password
- [ ] Password confirmation matches
- [ ] Avatar upload < 5MB
- [ ] Successful registration → logged in

### **Login:**
- [ ] Wrong password shows error
- [ ] Correct credentials redirect to dashboard
- [ ] Session persists after refresh

### **Profile:**
- [ ] Name/phone updates persist
- [ ] Email is read-only
- [ ] Avatar preview works
- [ ] Password change requires current password

### **Booking Request:**
- [ ] Requires service type selection
- [ ] Requires date and time
- [ ] Notes optional
- [ ] Submit creates RequestPending record
- [ ] Success redirects to history

### **Booking History:**
- [ ] Shows all client bookings
- [ ] Status badges correct colors
- [ ] Scheduled date shows when confirmed
- [ ] NO edit/cancel buttons visible
- [ ] View button works

---

**Built with ❤️ for Ambiance Photography Studio**
