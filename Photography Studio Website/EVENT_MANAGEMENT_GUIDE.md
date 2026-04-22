# Event Management System - Complete Guide

##  Overview

The Ambiance Photography Studio Event Management System provides comprehensive event creation, assignment, photo gallery management, and public event showcase capabilities.



## Table of Contents

1. [System Architecture](#system-architecture)
2. [Access Levels](#access-levels)
3. [How to Access](#how-to-access)
4. [Feature Breakdown](#feature-breakdown)
5. [Routes Reference](#routes-reference)
6. [Module Switching](#module-switching)

---

## 🏗️ System Architecture

### **Three-Tier Event System:**

```
┌─────────────────────────────────────────────────┐
│           PUBLIC ACCESS (No Login)              │
│  • Events Gallery (/events/gallery)             │
│  • Event Detail with Photos (/events/:id)       │
│  • Browse past completed events                 │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│          STAFF ACCESS (/staff/login)            │
│  • View assigned events                         │
│  • See event details & location                 │
│  • Access event notes                           │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│          ADMIN ACCESS (/admin/login)            │
│  • Admin Event Management (/admin/events)       │
│  • CRUD Operations                              │
│  • Photographer Assignment                      │
│  • Photo Gallery Management                     │
│  • Event Status Controls                        │
│  • Upload Photos (1080×1080 Instagram format)   │
└─────────────────────────────────────────────────┘
```

---

## 🔐 Access Levels

### **1. PUBLIC (No Authentication Required)**

**What They Can See:**
- ✅ Completed events gallery
- ✅ Event photos (1080×1080 uniform grid)
- ✅ Event details (date, location, photographer)
- ✅ Event types and categories
- ✅ Lightbox image viewer

**What They CANNOT See:**
- Upcoming events
- ❌ Event management controls
- ❌ Private event notes
- ❌ Booking IDs
- ❌ Admin functions

---

### **2. STAFF (Login Required)**

**What They Can Do:
View assigned events from dashboard
- ✅ See event details and location
- ✅ Check event dates and times
- ✅ Read event notes

**What They CANNOT Do:**
- ❌ Create or edit events
- ❌ Upload photos
- ❌ Change assignments
- ❌ Delete events
- ❌ Change event status

---

### **3. ADMIN (Login Required)**

**Full Permissions:**
- ✅ Create, Read, Update, Delete events
- ✅ Assign photographers to events
- ✅ Change event status (upcoming/ongoing/completed/cancelled)
- ✅ Upload event photos
- ✅ Manage photo galleries
- ✅ Filter and search all events
- ✅ Link events to bookings
- ✅ View event statistics

---

## 🚀 How to Access

### **Public Events Gallery**
1. Navigate to the main website
2. Click **"Events Gallery"** in the navigation bar
3. OR directly visit: `http://localhost:5173/events/gallery`
4. No login required!

---

### **Admin Event Management**

**Option 1: Login & Navigate** ⭐ **RECOMMENDED**
1. Visit `http://localhost:5173/admin/login`
2. Enter any email (e.g., `admin@ambiance.lk`)
3. Enter any password
4. Click "Sign In"
5. You'll be redirected to `/admin/dashboard`
6. Click **"Events"** in the navigation bar

**Option 2: Direct Access**
```
http://localhost:5173/admin/events
```

**Option 3: Quick Access (Development)**
```javascript
// Open browser console (F12) and run:
localStorage.setItem('isAuthenticated', 'true');
localStorage.setItem('userRole', 'admin');
localStorage.setItem('userName', 'Admin User');
localStorage.setItem('userEmail', 'admin@ambiance.lk');

// Then navigate to: http://localhost:5173/admin/events
```

---

## ✨ Feature Breakdown

### **📂 Admin Event Management** (`/admin/events`)

#### **1. Event Categories Dashboard**

**Pastel Color-Coded Cards:**
- 💍 **Wedding** - Pastel Pink
- 🎂 **Birthday** - Pastel Lavender  
- 💼 **Corporate** - Pastel Blue
- 🎭 **Cultural** - Pastel Peach
- 📸 **Other** - Pastel Mint

**Each Card Shows:**
- Event type icon (emoji)
- Event count
- Click to filter by type
- Hover effects with ring highlight

---

#### **2. Events Table**

**Columns:**
- **Event ID** - Auto-generated with padding (#0001)
- **Event Name** - Name + Location preview
- **Type** - Badge with event category
- **Date** - Date + Time
- **Photographer** - Assigned photographer name
- **Status** - Color-coded badge
- **Actions** - View / Edit / Delete buttons

**Status Colors:**
- 🔵 **Upcoming** - Blue
- 🟡 **Ongoing** - Yellow
- 🟢 **Completed** - Green
- 🔴 **Cancelled** - Red

**Search & Filters:**
- Search by name, type, or location
- Filter by event type (Wedding/Birthday/Corporate/Cultural/Other)
- Filter by status (Upcoming/Ongoing/Completed/Cancelled)
- Real-time filtering

---

#### **3. Add/Edit Event Drawer**

**Slide-in Right Panel with:**

**Basic Information:**
- Event Name (required)
- Event Type dropdown (required)
- Booking ID (optional link)
- Date (required)
- Time
- Location

**Assignment:**
- Photographer dropdown
- Auto-populates photographer name

**Status:**
- Upcoming
- Ongoing
- Completed
- Cancelled

**Notes:**
- Additional event details
- Special instructions
- Client requests

**Actions:**
- Cancel button
- Create/Update Event button

---

#### **4. Event Details Drawer**

**Comprehensive Event View:**

**Event Header:**
- Event name
- Status badge
- Type badge
- Photo count

**Event Details Card:**
- 📅 **Date & Time** with icon
- 📍 **Location** with icon
- 📷 **Photographer** with icon
- 🎫 **Booking ID** (if linked)
- 📝 **Notes** section

**Photo Gallery (Completed Events Only):**
- Only shows for events with status = "completed"
- Instagram-style 1080×1080 uniform grid
- 3 columns on desktop
- 2 columns on tablet
- 1 column on mobile
- Multi-select functionality
- Download selected photos
- Add more photos button
- Hover effects with zoom
- Click to view full size

**Empty State:**
- Displays when no photos uploaded
- Large camera icon
- "Upload Photos" call-to-action
- Dashed border card design

**Action Buttons:**
- Edit Event (opens edit drawer)
- Close button

---

#### **5. Photo Gallery Features**

**Selection System:**
- Click photo to select/deselect
- Yellow ring indicates selection
- Checkmark badge on selected photos
- Download button shows count
- "Download Selected" batch action

**Individual Photo Cards:**
- Square aspect ratio (1:1)
- Rounded corners
- Hover zoom effect (scale 1.05)
- Gradient overlay on hover
- Photographer name overlay
- Date stamp

**Upload Functionality:**
- "Add Photos" button (admin only)
- Placeholder for upload modal
- Multi-file upload support
- Auto-crop to 1080×1080 (planned)

---

### **🌐 Public Events Gallery** (`/events/gallery`)

#### **Gallery Grid View:**

**Event Cards Show:**
- Cover photo (square)
- Event name
- Event type badge
- Date, location, photographer
- Photo count badge with camera icon
- "View Gallery" button

**Hover Effects:**
- Image scale up
- Gradient overlay fade
- Border color change to yellow
- Button color change

**Filtering:**
- Search by name, type, location
- Filter by event type dropdown
- Real-time results update

---

### **📸 Public Event Detail** (`/events/gallery/:eventId`)

**Layout:**

**Header Section:**
- Large event title
- Type badge + photo count
- Back to Events button

**Event Info Card:**
- Date with calendar icon
- Location with map pin icon
- Photographer with camera icon
- Event description (if available)
- Gradient burgundy card design

**Photo Gallery:**
- 3-column responsive grid
- Square photos (1080×1080)
- Click to open lightbox
- Hover zoom effect
- Smooth animations

**Lightbox:**
- Full-screen dark overlay
- Large image preview
- Close button (top-right)
- Click outside to close
- Smooth fade animations

---

## 🗺️ Routes Reference

### **Public Routes (No Auth)**
```
GET  /events/gallery              → Public Events Gallery
GET  /events/gallery/:eventId     → Public Event Detail
```

### **Admin Routes (Admin Auth)**
```
GET  /admin/events                → Admin Event Management Console
GET  /admin/dashboard             → Admin Dashboard (includes event stats)
```

### **Staff Routes (Staff Auth)**
```
GET  /staff/me                    → Staff Portal (shows assigned events)
```

---

## 🔄 Module Switching Guide

### **Navigation Between Modules:**

#### **From Admin Dashboard:**

**Method 1: Top Navigation Bar**
```
Dashboard → Employees → Events
```
- Click "Dashboard" - Overview stats
- Click "Employees" - Employee management
- Click "Events" - Event management

**Method 2: Quick Action Cards**
```
Dashboard > "Manage Events" card → /admin/events
```

---

#### **From Admin Event Management:**

**Switch to Employees:**
- Click "Employees" in navigation

**Back to Dashboard:**
- Click "Dashboard" in navigation

**View Public Gallery:**
- Direct link: `/events/gallery`

---

#### **From Public Site:**

**Access Admin Panel:**
1. Navigate to `/admin/login`
2. Login with any credentials
3. Redirected to Dashboard
4. Click "Events" in navigation

---

### **Quick Module Access URLs:**

**Admin Modules:**
```
/admin/login      → Admin Login
/admin/dashboard  → Overview & Stats
/admin/employees  → Employee Management
/admin/events     → Event Management ⭐
```

**Staff Modules:**
```
/staff/login      → Staff Login
/staff/me         → Staff Self-Service
```

**Public Modules:**
```
/employees        → Employee Directory
/events/gallery   → Events Gallery ⭐
```

---

##  Design Features

### **Theme Consistency:**
- **Background:** Black with burgundy gradients
- **Primary:** Yellow/Gold (#fbbf24)
- **Accent:** Red (#991b1b)
- **Cards:** Dark burgundy to black gradient
- **Borders:** Gray-800 with hover yellow

### **Event Categories (Pastel Accents):**
Following requirements for pastel colors on category cards:
- Soft, muted tones
- High contrast text
- Clean typography
- Hover state transitions

### **Photo Grid (Instagram Style):**
- Uniform 1080×1080 resolution
- Square aspect ratio maintained
- 3-column desktop layout
- Responsive breakpoints
- Lazy loading support (planned)

### **Animations:**
- Fade in on page load
- Staggered list animations
- Modal/drawer slide transitions
- Hover scale effects
- Smooth color transitions

---

## 📊 Data Structure (Mock Data)

### **Event Object:**
```javascript
{
  id: 1,
  name: 'Silva-Perera Wedding',
  type: 'Wedding',
  date: '2024-03-25',
  time: '14:00',
  location: 'Galle Face Hotel, Colombo',
  bookingId: 'BK-2024-001',
  photographerId: 1,
  photographerName: 'Amaya Silva',
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled',
  notes: 'Beach wedding ceremony...',
  photos: []
}
```

### **Photo Object:**
```javascript
{
  id: 1,
  url: 'https://images.unsplash.com/...',
  photographer: 'Amaya Silva',
  date: '2024-02-15'
}
```

---

##  Integration with Employee Module

### **Photographer Assignment:**
- Events link to employee IDs
- Photographer dropdown pulls from employee list
- Shows photographer name in event details
- Can view photographer profile from event

### **Staff Dashboard Integration:**
- Staff see assigned events in "My Assignments" tab
- Event details accessible from staff portal
- Task management shows event-related tasks

---

##  Next Steps (Backend Integration)

When ready to connect to real database:

1. **Replace mock data with API calls**
2. **Create endpoints:**
   - `GET /api/events` - List all events
   - `POST /api/events` - Create event
   - `PATCH /api/events/:id` - Update event
   - `DELETE /api/events/:id` - Delete event
   - `POST /api/events/:id/photos` - Upload photos
   - `GET /api/public/events/completed` - Public gallery

3. **Add file upload system:**
   - S3 or Cloudinary integration
   - Image processing (resize to 1080×1080)
   - Thumbnail generation
   - CDN delivery

4. **Implement features:**
   - Real photographer availability check
   - Email notifications on assignment
   - Event calendar integration
   - Photo approval workflow
   - Client photo delivery links

---

## Key Differentiators

✅ **Instagram-Ready:** All photos uniform 1080×1080  
✅ **Public Showcase:** Completed events visible to potential clients  
✅ **Photo Management:** Multi-select, batch download  
✅ **Status Workflow:** Upcoming → Ongoing → Completed  
✅ **Photographer Linking:** Events tied to employee system  
✅ **Responsive Design:** Works perfectly on all devices  
✅ **Visual Categories:** Color-coded event types  
✅ **Clean Gallery:** ShootProof-inspired minimal design  

---

##  Support

For questions or issues:
- Check this guide first
- Review the code comments
- Test with mock login credentials
- Use browser console for debugging

---

##  ShootProof Design Inspiration

Following ShootProof gallery aesthetics:
- ✅ Clean minimal design
- ✅ Uniform photo grid
- ✅ Soft pastel accents
- ✅ Professional typography
- ✅ Smooth hover effects
- ✅ Lightbox viewer
- ✅ Grid-based layout

---
**Built with ❤️ for Ambiance Photography Studio**
