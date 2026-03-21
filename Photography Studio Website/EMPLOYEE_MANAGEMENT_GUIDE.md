# Employee Management System - Complete Guide

## 🎯 Overview

The Ambiance Photography Studio Employee Management System is a comprehensive full-stack solution with public-facing directory, staff self-service portal, and admin management console.

---

## 📋 Table of Contents

1. [System Architecture](#system-architecture)
2. [Access Levels](#access-levels)
3. [How to Access](#how-to-access)
4. [Feature Breakdown](#feature-breakdown)
5. [Routes Reference](#routes-reference)
6. [Authentication Guide](#authentication-guide)

---

## 🏗️ System Architecture

### **Three-Tier Access Control:**

```
┌─────────────────────────────────────────────────┐
│           PUBLIC ACCESS (No Login)              │
│  • Employee Directory (/employees)              │
│  • Employee Profiles (/employees/:id)           │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│          STAFF ACCESS (/staff/login)            │
│  • Self-Service Portal (/staff/me)              │
│  • Profile Management                           │
│  • Portfolio Management (Public/Private)        │
│  • View Assignments                             │
│  • View Salary (Private)                        │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│          ADMIN ACCESS (/admin/login)            │
│  • Admin Dashboard (/admin/dashboard)           │
│  • Employee Management (/admin/employees)       │
│  • CRUD Operations                              │
│  • Salary Management                            │
│  • Task Assignment                              │
│  • Visibility Controls                          │
└─────────────────────────────────────────────────┘
```

---

## 🔐 Access Levels

### **1. PUBLIC (No Authentication Required)**

**What They Can See:**
- ✅ Employee directory with search and filters
- ✅ Employee profiles (only publicly visible employees)
- ✅ Public portfolio items only
- ✅ Employee ratings and reviews
- ✅ Specialties and certifications

**What They CANNOT See:**
- ❌ Private portfolio items
- ❌ Salary information
- ❌ Contact details (phone/email)
- ❌ Hidden employees
- ❌ Administrative data

---

### **2. STAFF (Login Required)**

**What They Can Do:**
- ✅ Edit own profile (name, bio, phone, email)
- ✅ Manage own portfolio (add/delete items, set visibility)
- ✅ View assigned tasks/bookings
- ✅ View own salary and payslips (PRIVATE)
- ✅ Update profile picture

**What They CANNOT Do:**
- ❌ Change own role
- ❌ Toggle public visibility of profile
- ❌ View other employees' salaries
- ❌ Access admin functions
- ❌ Assign tasks

---

### **3. ADMIN (Login Required)**

**Full Permissions:**
- ✅ Create, Read, Update, Delete employees
- ✅ Manage employee salaries
- ✅ Assign tasks to employees
- ✅ Toggle public visibility
- ✅ Change employee status (active/inactive)
- ✅ View all data across the system
- ✅ Upload payslips
- ✅ Conflict checking for assignments

---

## 🚀 How to Access

### **Public Employee Directory**
1. Navigate to the main website
2. Click **"Our Team"** in the navigation bar
3. OR directly visit: `http://localhost:5173/employees`
4. No login required!

---

### **Staff Portal Access**

**Option 1: Login Page**
1. Visit `http://localhost:5173/staff/login`
2. Enter any email (e.g., `staff@ambiance.lk`)
3. Enter any password
4. Click "Sign In"
5. You'll be redirected to `/staff/me`

**Option 2: Quick Access (Development)**
```javascript
// Open browser console (F12) and run:
localStorage.setItem('isAuthenticated', 'true');
localStorage.setItem('userRole', 'staff');
localStorage.setItem('userName', 'Amaya Silva');
localStorage.setItem('userEmail', 'amaya@ambiance.lk');

// Then navigate to: http://localhost:5173/staff/me
```

---

### **Admin Portal Access**

**Option 1: Login Page** ⭐ **RECOMMENDED**
1. Visit `http://localhost:5173/admin/login`
2. Enter any email (e.g., `admin@ambiance.lk`)
3. Enter any password
4. Click "Sign In"
5. You'll be redirected to `/admin/dashboard`

**Option 2: Quick Access (Development)**
```javascript
// Open browser console (F12) and run:
localStorage.setItem('isAuthenticated', 'true');
localStorage.setItem('userRole', 'admin');
localStorage.setItem('userName', 'Admin User');
localStorage.setItem('userEmail', 'admin@ambiance.lk');

// Then navigate to: http://localhost:5173/admin/dashboard
```

---

## ✨ Feature Breakdown

### **📂 Public Employee Directory** (`/employees`)

**Features:**
- Search by name, role, or specialty
- Filter by role (Photographer/Cinematographer/Editor)
- Sort by experience or rating
- Beautiful card layout with hover effects
- Only shows employees with `visiblePublic: true`

**Employee Cards Show:**
- Profile photo
- Name and role
- Short bio (2-3 lines)
- Specialty tags
- Years of experience
- Average rating
- "View Profile" button

---

### **👤 Public Employee Profile** (`/employees/:id`)

**Layout:**
- Hero cover image
- Profile header with avatar and stats
- About/Bio section (3-5 paragraphs)
- Certifications list
- **Portfolio Grid** (1080×1080 uniform images)
- Recent work highlights
- Image lightbox for portfolio viewing
- "Request This Photographer" CTA

**Privacy:**
- Only shows public portfolio items
- Email/phone not exposed
- Only visible if `visiblePublic: true`

---

### **👨‍💼 Staff Self-Service Portal** (`/staff/me`)

**4 Tabs:**

#### **1. My Profile**
- Update first/last name
- Edit email and phone
- Update bio
- View specialties
- Upload profile picture
- **Read-only:** Role, join date (set by admin)

#### **2. Portfolio**
- Add new portfolio items
  - Title, description, image URL
  - Set visibility: Public or Private
- Delete portfolio items
- Visual indicators for public/private status
- Grid display of all items

#### **3. My Assignments**
- View upcoming bookings/events
- See task details: date, time, location
- Priority badges (high/medium/low)
- Status indicators (upcoming/completed)

#### **4. My Salary** 🔒 **PRIVATE**
- Salary breakdown:
  - Base salary
  - Allowances
  - Deductions
  - Net salary calculation
- Pay cycle information
- Payslip history with download buttons
- Privacy warning badge

**Privacy Notice:**
"Salary details are private to you and the owner."

---

### **🎛️ Admin Dashboard** (`/admin/dashboard`)

**Overview Stats:**
- Total Employees
- Active Staff
- Inactive Staff
- Public Profiles

**Quick Actions:**
- Manage Employees
- Salary Management
- Task Assignment
- View Public Directory

**Activity Feed:**
- Recent employee additions
- Salary updates
- Task assignments
- Visibility changes

**Upcoming Tasks:**
- Shows all assigned tasks
- Priority indicators
- Assignee names
- Dates

---

### **👥 Admin Employee Management** (`/admin/employees`)

#### **Employee Directory Table**

**Columns:**
- Name & Email
- Role badge
- Status badge (Active/Inactive)
- Visibility toggle (Public/Hidden)
- Last login timestamp
- Action buttons

**Search & Filters:**
- Search by name or email
- Filter by role
- Filter by status
- Real-time filtering

#### **Action Buttons:**

**1. Edit Employee** (Pencil Icon)
Opens side drawer with:
- First/Last name
- Email & Phone
- Role
- Join date
- Bio
- Specialties (comma-separated)
- Status dropdown
- **Publicly Visible checkbox**

**2. Manage Salary** (Dollar Icon)
Opens modal with:
- Base salary input
- Allowances input
- Deductions input
- Pay cycle dropdown (weekly/biweekly/monthly)
- Effective date
- **Real-time net salary calculation**

**3. Assign Task** (Calendar Icon)
Opens modal with:
- Task title
- Type dropdown (booking/event/ops)
- Priority dropdown (low/medium/high)
- Start date & time
- Location
- Notes textarea

#### **Visibility Toggle**
- Click on Public/Hidden badge to toggle
- Instantly affects public directory
- Visual feedback with color-coded badges

---

## 🗺️ Routes Reference

### **Public Routes (No Auth)**
```
GET  /employees              → Employee Directory
GET  /employees/:id          → Employee Profile
```

### **Staff Routes (Staff Auth)**
```
GET  /staff/login           → Staff Login Page
GET  /staff/me              → Staff Self-Service Portal
```

### **Admin Routes (Admin Auth)**
```
GET  /admin/login           → Admin Login Page
GET  /admin/dashboard       → Admin Dashboard
GET  /admin/employees       → Employee Management Console
```

---

## 🔑 Authentication Guide

### **Mock Login System (Current Implementation)**

All login pages accept **any email and password** for demonstration.

**Staff Login:**
```javascript
Email: anything@email.com
Password: anything
Role: staff
```

**Admin Login:**
```javascript
Email: anything@email.com
Password: anything
Role: admin
```

### **Local Storage Keys:**
```javascript
localStorage.setItem('isAuthenticated', 'true');
localStorage.setItem('userRole', 'staff' | 'admin' | 'client');
localStorage.setItem('userName', 'Full Name');
localStorage.setItem('userEmail', 'email@example.com');
```

### **Route Protection:**
- Staff routes check: `userRole === 'staff' || userRole === 'admin'`
- Admin routes check: `userRole === 'admin'`
- Redirects to appropriate login page if unauthorized

---

## 🎨 UI/UX Features

### **Design Theme:**
- **Background:** Black with burgundy gradients (`#2a0f0f`)
- **Primary Color:** Yellow/Gold (`#fbbf24`)
- **Accent:** Red (`#991b1b`)
- **Cards:** Dark burgundy to black gradient with border
- **Buttons:** Red with hover states

### **Animations:**
- Fade in on page load (Motion/React)
- Staggered animations for lists
- Smooth transitions on hover
- Modal/drawer slide animations
- Tab switching animations

### **Responsive:**
- Mobile-first design
- Responsive grids (1/2/3/4 columns)
- Mobile navigation menus
- Horizontal scroll for tables on mobile
- Touch-friendly buttons

---

## 📊 Data Structure (Mock Data)

### **Employee Object:**
```javascript
{
  id: 1,
  firstName: 'Amaya',
  lastName: 'Silva',
  email: 'amaya@ambiance.lk',
  phone: '+94 77 123 4567',
  role: 'Lead Photographer',
  status: 'active',
  visiblePublic: true,
  joinDate: '2016-03-15',
  lastLogin: '2024-03-10',
  bio: 'Specialized in wedding...',
  specialties: ['Weddings', 'Portraits'],
  baseSalary: 120000,
  avatar: 'https://...',
  coverImage: 'https://...'
}
```

### **Portfolio Item:**
```javascript
{
  id: 1,
  employeeId: 1,
  title: 'Beach Wedding',
  description: 'Beautiful sunset ceremony',
  url: 'https://...',
  visibility: 'public' | 'private'
}
```

### **Task/Assignment:**
```javascript
{
  id: 1,
  title: 'Silva-Perera Wedding',
  assigneeId: 1,
  targetType: 'booking' | 'event' | 'ops',
  startDate: '2024-03-25',
  startTime: '14:00',
  location: 'Galle Face Hotel',
  priority: 'high' | 'medium' | 'low',
  status: 'upcoming' | 'completed',
  notes: '...'
}
```

---

## 🔄 Next Steps (Backend Integration)

When ready to connect to real database:

1. **Replace mock data with API calls**
2. **Create endpoints:**
   - `GET /api/public/employees`
   - `GET /api/staff/me`
   - `PATCH /api/staff/me`
   - `POST /api/admin/employees`
   - etc.

3. **Add file uploads** for avatars and portfolio
4. **Implement real authentication** (JWT tokens)
5. **Add email notifications** for task assignments
6. **Salary change audit logging**
7. **Image optimization** and CDN

---

## 🎯 Key Differentiators

✅ **Privacy First:** Salary data never exposed to public
✅ **Flexible Visibility:** Admin controls who appears publicly
✅ **Self-Service:** Staff manage own profiles and portfolios
✅ **Task Management:** Built-in assignment system
✅ **Professional Design:** Dark, elegant Ambiance theme
✅ **Mobile Responsive:** Works perfectly on all devices
✅ **Real-time Filtering:** Instant search and filter results

---

## 📞 Support

For questions or issues:
- Check this guide first
- Review the code comments
- Test with mock login credentials
- Use browser console for debugging

---

**Built with ❤️ for Ambiance Photography Studio**
