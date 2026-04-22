# Ambiance Studio - Complete Navigation Guide

##  System Overview

The Ambiance Photography Studio management system consists of **two major modules** that are fully integrated:

1. **Employee Management Module** - Team directory, staff portal, admin employee controls
2. **Event Management Module** - Event creation, photo galleries, public showcase

---

##  Quick Access Dashboard

### **Admin Dashboard** (`/admin/dashboard`)

The central hub for all admin operations with:

**Statistics Cards:**
- Total Employees: 12
- Active Staff: 10
- Total Events: 4
- Upcoming Events: 2

**Quick Action Cards:**
-  **Manage Employees** → `/admin/employees`
-  **Manage Events** → `/admin/events`
-  **Salary Management** → `/admin/employees`
-  **View Public Directory** → `/employees`

**Navigation Bar:**
```
[Ambiance Admin] [Dashboard] [Employees] [Events] [User] [Logout]
```

---

##  Main Access Points

### **1. Admin Access** (Full Control)

**Login:**
```
URL: /admin/login
Email: any email
Password: any password
```

**After Login → Redirects to:**
```
/admin/dashboard
```

**Available Routes:**
- `/admin/dashboard` - Overview & Stats
- `/admin/employees` - Employee Management
- `/admin/events` - Event Management

---

### **2. Staff Access** (Self-Service)

**Login:**
```
URL: /staff/login
Email: any email
Password: any password
```

**After Login → Redirects to:**
```
/staff/me
```

**Available Tabs:**
- My Profile
- Portfolio
- My Assignments (shows events)
- My Salary

---

### **3. Public Access** (No Login)

**Direct URLs:**
- `/employees` - Employee Directory
- `/employees/:id` - Employee Profile
- `/events/gallery` - Events Gallery
- `/events/gallery/:id` - Event Detail with Photos

---

##  Module Switching Methods

### **Method 1: Top Navigation Bar**  **RECOMMENDED**

**When logged in as Admin:**

```
┌──────────────────────────────────────────────────────┐
│ Ambiance Admin │ Dashboard │ Employees │ Events │  │
└──────────────────────────────────────────────────────┘
```

**Click to Navigate:**
- **Dashboard** → `/admin/dashboard`
- **Employees** → `/admin/employees`
- **Events** → `/admin/events`
- **Logout** → Clears session, redirects to `/admin/login`

**Active Page Highlighting:**
- Current page has **red background**
- Inactive pages are gray with hover effect

---

### **Method 2: Dashboard Quick Actions**

**From `/admin/dashboard`:**

Click any Quick Action Card:
1. **Manage Employees** → Opens `/admin/employees`
2. **Manage Events** → Opens `/admin/events`
3. **Salary Management** → Opens `/admin/employees` (salary tab)
4. **View Public Directory** → Opens `/employees` (public view)

---

### **Method 3: Direct URL Entry**

**Type in browser:**
```
http://localhost:5173/admin/employees
http://localhost:5173/admin/events
http://localhost:5173/admin/dashboard
```

**Protected Routes:**
- Will redirect to `/admin/login` if not authenticated
- Will redirect to `/admin/login` if role is not 'admin'

---

### **Method 4: Breadcrumb Navigation**

**Planned Feature:**
```
Home > Admin > Events > Event Details
         ↑      ↑
    Click here to switch modules
```

---

##  Complete Route Map

### ** Authentication Routes**

```
/admin/login              → Admin Login Page
/staff/login              → Staff Login Page
/client/login             → Client Login Page
/client/register          → Client Registration
```

---

### ** Admin Routes** (Requires: `role === 'admin'`)

```
/admin/dashboard          → Admin Dashboard
├─ Quick Stats
├─ Quick Actions
├─ Recent Activity
└─ Upcoming Tasks

/admin/employees          → Employee Management
├─ Employee Table
├─ Search & Filters
├─ Add/Edit Drawer
├─ Salary Management
└─ Task Assignment

/admin/events             → Event Management  NEW
├─ Event Categories
├─ Event Table
├─ Add/Edit Event
├─ Event Details
└─ Photo Gallery Management
```

---

### ** Staff Routes** (Requires: `role === 'staff'`)

```
/staff/me                 → Staff Self-Service Portal
├─ My Profile Tab
├─ Portfolio Tab
├─ My Assignments Tab (shows assigned events)
└─ My Salary Tab
```

---

### ** Public Routes** (No Authentication)

```
/employees                → Employee Directory
├─ Search & Filters
├─ Employee Cards
└─ Public profiles only

/employees/:id            → Employee Profile
├─ Cover Image
├─ Profile Details
├─ Public Portfolio
└─ Certifications

/events/gallery           → Events Gallery  NEW
├─ Completed Events
├─ Search & Filters
└─ Event Cards

/events/gallery/:id       → Event Detail  NEW
├─ Event Information
├─ Photo Gallery
└─ Lightbox Viewer
```

---

##  Navigation Workflows

### **Workflow 1: Admin Manages Employees Then Events**

```
1. Login → /admin/login
2. Dashboard → /admin/dashboard
3. Click "Employees" nav → /admin/employees
4. Add/Edit employees
5. Click "Events" nav → /admin/events
6. Create event
7. Assign photographer from employee list
8. Upload photos
```

---

### **Workflow 2: Admin Creates Event & Assigns Photographer**

```
1. Login → /admin/login
2. Dashboard shows "2 Upcoming Events"
3. Click "Manage Events" → /admin/events
4. Click "+ Add New Event" button
5. Fill event form:
   - Name: "Silva-Perera Wedding"
   - Type: Wedding
   - Date: 2024-03-25
   - Assign Photographer: Amaya Silva
6. Save event
7. Event appears in table
8. When completed, upload photos
9. Photos visible in public gallery
```

---

### **Workflow 3: Client Views Public Events**

```
1. Visit website → /
2. Click "Events Gallery" → /events/gallery
3. Browse completed events
4. Click event card → /events/gallery/:id
5. View photo gallery
6. Click photo for lightbox
7. See photographer name
8. Click "Request Photographer" → /contact
```

---

### **Workflow 4: Staff Views Assigned Events**

```
1. Login → /staff/login
2. Portal → /staff/me
3. Click "My Assignments" tab
4. See list of assigned events:
   - Silva-Perera Wedding (Mar 25)
   - Dialog Corporate Event (Mar 28)
5. View event details
6. Check location and notes
```

---

##  Visual Navigation Guide

### **Admin Navigation Bar:**

```
┌────────────────────────────────────────────────────────┐
│  AMBIANCE ADMIN                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │Dashboard │ │Employees │ │ Events   │  User  Logout│
│  └──────────┘ └──────────┘ └──────────┘              │
└────────────────────────────────────────────────────────┘
```

**Color States:**
- Active: Red background, white text
- Hover: Gray background
- Inactive: Gray text

---

### **Staff Navigation Bar:**

```
┌────────────────────────────────────────────────────────┐
│  AMBIANCE STAFF                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │My Portal │ │Team Dir. │ │Main Site │  User  Logout│
│  └──────────┘ └──────────┘ └──────────┘              │
└────────────────────────────────────────────────────────┘
```

---

##  Mobile Navigation

### **Hamburger Menu:**

```
┌────────────────────────┐
│ AMBIANCE ADMIN    [≡]  │
├────────────────────────┤
│                        │
│  When clicked:         │
│  ┌─────────────────┐  │
│  │ Dashboard       │  │
│  │ Employees       │  │
│  │ Events          │  │
│  │─────────────────│  │
│  │ Admin User      │  │
│  │ Logout          │  │
│  └─────────────────┘  │
└────────────────────────┘
```

---

##  Cross-Module Integration

### **Employees  Events Integration:**

**From Employees to Events:**
1. Admin creates employee "Amaya Silva"
2. Employee has role "Lead Photographer"
3. Navigate to Events module
4. Create new event
5. Photographer dropdown shows "Amaya Silva"
6. Assign to event
7. Event shows photographer name

**From Events to Employees:**
1. View event details
2. See "Photographer: Amaya Silva"
3. Click name (future feature)
4. Navigate to `/employees/1`
5. View photographer profile

---

### **Staff Portal Integration:**

**Unified Staff Experience:**
1. Staff login → `/staff/me`
2. "My Profile" tab - Edit personal info
3. "Portfolio" tab - Manage work samples
4. "My Assignments" tab - See events assigned to you
5. "My Salary" tab - View compensation

---

##  Quick Access Cheat Sheet

### **Admin Shortcuts:**

```bash
# Login
/admin/login

# Dashboard (Overview)
/admin/dashboard

# Manage Employees
/admin/employees

# Manage Events
/admin/events

# Logout
Click logout button in nav bar
```

---

### **Staff Shortcuts:**

```bash
# Login
/staff/login

# My Portal
/staff/me

# View Team
/employees

# Logout
Click logout button in nav bar
```

---

### **Public Shortcuts:**

```bash
# Employee Directory
/employees

# Specific Employee
/employees/1

# Events Gallery
/events/gallery

# Specific Event
/events/gallery/3
```

---

##  Developer Testing Workflow

### **Test All Modules Quickly:**

**Step 1: Login as Admin**
```javascript
// Browser console
localStorage.setItem('isAuthenticated', 'true');
localStorage.setItem('userRole', 'admin');
localStorage.setItem('userName', 'Admin User');
localStorage.setItem('userEmail', 'admin@ambiance.lk');
```

**Step 2: Navigate Through Modules**
```
1. /admin/dashboard     → Check stats
2. /admin/employees     → Add employee
3. /admin/events        → Create event
4. /admin/events        → Assign photographer
5. /events/gallery      → View public gallery
6. Logout               → Clear session
```

**Step 3: Test Staff Access**
```javascript
// Browser console
localStorage.setItem('isAuthenticated', 'true');
localStorage.setItem('userRole', 'staff');
localStorage.setItem('userName', 'Amaya Silva');
localStorage.setItem('userEmail', 'amaya@ambiance.lk');
```

```
1. /staff/me           → View self-service
2. Check assignments   → See events
3. Update portfolio    → Add photos
```

---

##  UI/UX Consistency

### **Shared Design Elements:**

**Navigation Bars:**
- Same dark gradient background
- Same yellow logo color
- Same red active state
- Same logout button style

**Page Headers:**
- 4xl font size
- Yellow serif font
- Uppercase text
- Gray subtitle

**Cards:**
- Burgundy gradient background
- Gray-800 border
- Yellow hover state
- Rounded corners

**Tables:**
- Gray-900 header
- Gray-800 borders
- Hover row highlight
- Badge status indicators

**Modals/Drawers:**
- Slide from right
- Full height
- Dark overlay
- Close button top-right

---

## 📊 Navigation Analytics (Planned)

**Track User Flows:**
- Most used module switches
- Average time per module
- Common navigation paths
- Drop-off points

---

##  Access Control Summary

| Route | Public | Staff | Admin |
|-------|--------|-------|-------|
| `/employees` 
| `/events/gallery` 
| `/staff/me` 
| `/admin/dashboard` 
| `/admin/employees` 
| `/admin/events` 

---

##  Best Practices

**Navigation Tips:**
1. **Use the nav bar** for quick module switching
2. **Bookmark dashboard** for quick admin access
3. **Check active state** to know current location
4. **Use breadcrumbs** (future) for deep navigation
5. **Mobile users** - use hamburger menu

**Module Switching:**
1. Always **save work** before switching modules
2. **Check permissions** before attempting access
3. Use **dashboard** as home base
4. **Logout properly** when done

---

**Complete navigation system for seamless module switching! 🎉**
