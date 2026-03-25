# 🎬 Event System - File Connections Map

## Quick Overview
This document maps all event-related files and shows how they connect to each other in your photography studio management system.

---

## 📋 File Structure by Category

### 1. **Homepage & Navigation Entry**

**File:** `src/app/pages/HomePage.tsx`
- **Purpose:** Main landing page with service mode toggle
- **Event Features:** 
  - Toggle between Photography and Event Management
  - Event type selector (DJ Services, Live Music, Party Planning, Weddings)
  - Dynamic content based on event type
- **Connects To:**
  - `routes.tsx` - Navigation links to event pages
  - Event Management pages via routing

---

### 2. **Routes Definition**

**File:** `src/app/routes.tsx`
- **Purpose:** Central routing configuration for all pages
- **Event Routes:**
  ```
  Public Routes:
  - /events/gallery → EventsGallery.tsx
  - /events/gallery/:eventId → PublicEventDetail.tsx
  
  Staff Routes:
  - /staff/events → EventManagement.tsx
  - /staff/events/:eventId → EventDetails.tsx
  
  Admin Routes:
  - /admin/events → AdminEventManagement.tsx
  ```
- **Connects To:**
  - All event page files
  - Navigation components

---

## 📄 Page Files

### **Public Tier (Client Facing)**

#### `src/app/pages/public/EventsGallery.tsx`
- **Purpose:** Public event gallery showcase
- **Displays:**
  - Completed events with photos
  - Event type filtering
  - Event cards with cover image, name, date, location
  - Event count by type
- **Data Used:** Event object array with photos
- **Connects To:**
  - `PublicEventDetail.tsx` - Clicking event card navigates here
  - `routes.tsx` - Route definition
  - Shared UI Components (Card, Badge, Button)
  - Data/Models/eventData.tsx (if it exists)

#### `src/app/pages/public/PublicEventDetail.tsx`
- **Purpose:** Individual event details for public viewers
- **Displays:**
  - Event information (date, location, photographer)
  - Photo gallery (1080×1080 grid)
  - Lightbox viewer
  - Event type and description
- **Data Used:** Single event object with photos array
- **Connects To:**
  - `routes.tsx` - Route with eventId parameter
  - `EventsGallery.tsx` - Go back link
  - Shared UI Components
  - Image gallery/lightbox components

---

### **Staff Tier (Employee Dashboard)**

#### `src/app/pages/events/EventManagement.tsx`
- **Purpose:** Staff view of assigned events
- **Displays:**
  - List of assigned events
  - Event category breakdown
  - Event search and filter
  - Status indicators (Upcoming, Ongoing, Completed, Cancelled)
- **Features:**
  - View-only permissions (no create/edit/delete)
  - Filter by event type
  - Quick event details display
- **Data Used:** Event objects filtered by assigned photographer
- **Connects To:**
  - `EventDetails.tsx` - Click to view event details
  - `routes.tsx` - Route definition
  - `EMPLOYEE_MANAGEMENT_GUIDE.md` - Documentation
  - Shared UI Components
  - Data layer (if exists)

#### `src/app/pages/events/EventDetails.tsx`
- **Purpose:** Staff view of specific event details
- **Displays:**
  - Event full information
  - Assigned photographer details
  - Event notes and special requests
  - Photo gallery for completed events
  - Event timeline/status
- **Features:**
  - Read-only access
  - Photo viewing
  - Export/print option (possibly)
- **Data Used:** Single event object from event ID
- **Connects To:**
  - `EventManagement.tsx` - Back to list
  - `routes.tsx` - Route with eventId parameter
  - `EMPLOYEE_MANAGEMENT_GUIDE.md` - Documentation
  - Shared UI Components

---

### **Admin Tier (Management Console)**

#### `src/app/pages/admin/AdminEventManagement.tsx`
- **Purpose:** Complete admin event management console
- **Features:**
  - ✅ Create new events (Add Event drawer form)
  - ✅ View all events (Table with ID, name, type, date, photographer, status)
  - ✅ Edit event details (Edit Event drawer)
  - ✅ Delete events
  - ✅ Assign photographers to events
  - ✅ Upload photos for completed events
  - ✅ Manage event status
  - ✅ Filter by event type and status
  - ✅ View event details in detail drawer
- **Form Fields:**
  - Event name
  - Event type (Wedding, Birthday, Corporate, Cultural, Other)
  - Date and time
  - Location
  - Photographer selection/assignment
  - Booking link (optional)
  - Event notes/description
  - Photo gallery upload
- **Data Used:** All events with full CRUD operations
- **Connected To:**
  - `routes.tsx` - /admin/events route
  - `EMPLOYEE_MANAGEMENT_GUIDE.md` - Photographer assignment reference
  - `BOOKING_SYSTEM_GUIDE.md` - Booking linkage
  - `EVENT_MANAGEMENT_GUIDE.md` - System documentation
  - Data management layer
  - Shared UI Components (Button, Input, Select, Drawer, Table, Badge, Dialog, etc.)

---

## 📚 Documentation Files

### Primary Documentation

**`EVENT_MANAGEMENT_GUIDE.md`** (Root level)
- **Covers:**
  - System architecture (3-tier structure)
  - Access levels and permissions
  - Features for each tier (Public, Staff, Admin)
  - Detailed interface descriptions
  - Photo gallery specifications (1080×1080)
  - Status management
  - Routes reference
  - Navigation instructions
- **References:** All event pages and admin console
- **Connected To:**
  - `AdminEventManagement.tsx`
  - `EventManagement.tsx`
  - `EventsGallery.tsx`
  - All event detail pages

### Detailed Specifications

**`src/imports/pasted_text/event-management.md`**
- Requirements and specifications for event management system
- Data structure definitions
- Feature requirements

**`src/imports/pasted_text/event-management-1.md`**
- Additional event management specifications
- Extended requirements and features

---

## 🔗 Related System Documentation

These files reference or work with the event system:

### **`BOOKING_SYSTEM_GUIDE.md`**
- **Connection:** Events linked to booking records
- **Purpose:** Shows how event bookings create event records
- **Data Link:** `bookingId` field in event object
- **Usage:** Admin can link bookings to events

### **`EMPLOYEE_MANAGEMENT_GUIDE.md`**
- **Connection:** Photographer assignment to events
- **Purpose:** Shows how staff members are assigned to events
- **Data Link:** `photographerId` and `photographerName` fields
- **Features:**
  - Staff can view assigned events
  - Admin assigns photographers to events
  - Staff see upcoming work in dashboard

### **`CLIENT_BOOKING_MANAGEMENT_GUIDE.md`**
- **Connection:** Event types and packages
- **Purpose:** Shows service types available (Wedding Photography, Event Coverage, etc.)
- **Data Link:** Event types match booking service types

### **`NAVIGATION_GUIDE.md`**
- **Connection:** Navigation links and menu structure
- **Purpose:** Shows how users navigate to event pages
- **Links Reference:**
  - `/events/gallery` - Public events gallery
  - `/staff/events` - Staff event management
  - `/admin/events` - Admin console

---

## 🧩 Shared UI Components Used

All event pages use these reusable components from `src/app/components/ui/`:

| Component | Used In | Purpose |
|-----------|---------|---------|
| **Button** | All pages | Actions (Add, Edit, Delete, Save) |
| **Card** | Gallery, List views | Event card containers |
| **Badge** | All pages | Event type, status indicators |
| **Tabs** | Detail pages | Organize event info |
| **Drawer** | Admin console | Add/Edit/Details overlays |
| **Table** | Admin console | Events list display |
| **Input** | Admin forms | Text field inputs |
| **Select** | Admin forms | Event type, photographer selection |
| **Dialog** | All pages | Confirmations, alerts |
| **Dialog/Modal** | Detail pages | Photos and lightbox |

---

## 📊 Data Model Connections

### **Event Object Structure**

```javascript
{
  id: string,                    // Unique event identifier
  name: string,                  // Event name
  type: 'Wedding' | 'Birthday' | 'Corporate' | 'Cultural' | 'Other',
  date: string,                  // YYYY-MM-DD format
  time: string,                  // HH:MM format
  location: string,              // Event location
  photographerId: string,        // Assigned photographer ID
  photographerName: string,      // Photographer full name
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled',
  bookingId: string,             // Optional: linked booking
  notes: string,                 // Event details/special requests
  photos: string[]               // Array of photo URLs (for completed events)
}
```

### **Where Data Flows:**

1. **Admin Creates/Edits** → AdminEventManagement.tsx
2. **Data Stored** → Backend database
3. **Staff Retrieves** → EventManagement.tsx & EventDetails.tsx
4. **Public Views** → EventsGallery.tsx & PublicEventDetail.tsx

---

## 🔐 Permission Levels & Access

| User Type | Can View | Can Create | Can Edit | Can Delete | Pages Access |
|-----------|----------|-----------|---------|-----------|--------------|
| **Public** | Completed events only | ❌ | ❌ | ❌ | EventsGallery, PublicEventDetail |
| **Staff** | Own assigned events | ❌ | ❌ | ❌ | EventManagement, EventDetails |
| **Admin** | All events | ✅ | ✅ | ✅ | AdminEventManagement |

---

## 🎯 User Journey & File Flow

### **Public User Journey**
```
HomePage 
  ↓
EventsGallery.tsx (Browse completed events)
  ↓
PublicEventDetail.tsx (View event & photos)
```

### **Staff Journey**
```
Staff Dashboard
  ↓
EventManagement.tsx (View assigned events)
  ↓
EventDetails.tsx (View event details & photos)
```

### **Admin Journey**
```
Admin Dashboard
  ↓
AdminEventManagement.tsx
  ├→ Create new event
  ├→ View event list
  ├→ Edit event details
  ├→ Assign photographer
  ├→ Upload photos
  └→ Manage status
```

---

## 💡 Key Features by Connection

### **Feature: Event Creation**
- **File:** AdminEventManagement.tsx
- **Form Fields:** Name, Type, Date, Time, Location, Photographer, Booking Link, Notes
- **Documentation:** EVENT_MANAGEMENT_GUIDE.md
- **Related:** BOOKING_SYSTEM_GUIDE.md (linking)

### **Feature: Photographer Assignment**
- **File:** AdminEventManagement.tsx
- **Data Field:** photographerId, photographerName
- **Documentation:** EMPLOYEE_MANAGEMENT_GUIDE.md
- **Staff Access:** See assigned events in EventManagement.tsx

### **Feature: Photo Gallery Management**
- **Files:** AdminEventManagement.tsx (upload), EventDetails.tsx (staff view), PublicEventDetail.tsx (public view)
- **Format:** 1080×1080 grid
- **Documentation:** EVENT_MANAGEMENT_GUIDE.md
- **Status Requirement:** Photos only for Completed events

### **Feature: Event Status Management**
- **File:** AdminEventManagement.tsx
- **Statuses:** Upcoming, Ongoing, Completed, Cancelled
- **Affects:** Staff visibility, Photo gallery access, Public display

### **Feature: Event Filtering**
- **Files:** EventsGallery.tsx (type filter), EventManagement.tsx (type filter), AdminEventManagement.tsx (type & status filter)
- **Filters:** By event type, by status, search by name

---

## 🚀 Integration Points

### **With Booking System**
- Events created from booking records
- Booking links stored in event
- File: BOOKING_SYSTEM_GUIDE.md

### **With Employee System**
- Photographers assigned to events
- Staff view assigned work
- File: EMPLOYEE_MANAGEMENT_GUIDE.md

### **With Navigation**
- Menu items link to event pages
- File: NAVIGATION_GUIDE.md

### **With Home Page**
- Event mode toggle showcases event services
- File: HomePage.tsx

---

## 📝 Summary Table

| File | Purpose | Tier | CRUD | Status |
|------|---------|------|------|--------|
| HomePage.tsx | Landing page with toggle | - | - | Active |
| routes.tsx | Route definitions | - | - | Core |
| EventsGallery.tsx | Public event list | Public | R | Active |
| PublicEventDetail.tsx | Public event view | Public | R | Active |
| EventManagement.tsx | Staff event list | Staff | R | Active |
| EventDetails.tsx | Staff event view | Staff | R | Active |
| AdminEventManagement.tsx | Admin console | Admin | CRUD | Active |
| EVENT_MANAGEMENT_GUIDE.md | Main documentation | - | - | Reference |
| event-management.md | Requirements | - | - | Reference |
| event-management-1.md | Specifications | - | - | Reference |

---

## ✨ Next Steps for Development

1. **Database Schema:** Connect to real database for event persistence
2. **Authentication:** Add permission checks based on user roles
3. **Real Photo Upload:** Implement file upload for event photos
4. **Notifications:** Add alerts when events are created/assigned
5. **Search/Export:** Add advanced filtering and data export
6. **Mobile Responsiveness:** Ensure mobile-friendly event views
7. **Calendar Integration:** Add event calendar view
8. **API Integration:** Connect to real backend services

---

**Last Updated:** March 23, 2026
**Version:** 1.0
**Maintained By:** Development Team
