# Photo Delivery & Feedback Management - Complete Guide

## 🎯 Overview

The Ambiance Photography Studio Photo Delivery & Feedback Management System provides comprehensive photo gallery creation, Instagram-ready photo delivery, client feedback collection, and satisfaction analytics.

---

## 📋 Table of Contents

1. [System Architecture](#system-architecture)
2. [Access Levels](#access-levels)
3. [How to Access](#how-to-access)
4. [Feature Breakdown](#feature-breakdown)
5. [Routes Reference](#routes-reference)
6. [Instagram Format Specs](#instagram-format-specs)

---

## 🏗️ System Architecture

### **Three-Tier Gallery System:**

```
┌─────────────────────────────────────────────────┐
│           CLIENT ACCESS                         │
│  • View own galleries (/gallery)                │
│  • Download photos                              │
│  • Leave feedback & ratings                     │
│  • Select & download specific photos            │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│          STAFF ACCESS                           │
│  • View assigned galleries                      │
│  • Upload photos with auto-crop                 │
│  • Publish/Unpublish galleries                  │
│  • Share gallery links                          │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│          ADMIN ACCESS                           │
│  • Full gallery management                      │
│  • View all feedback & ratings                  │
│  • Gallery insights & analytics                 │
│  • Download reports                             │
│  • Moderate testimonials                        │
└─────────────────────────────────────────────────┘
```

---

## 🔐 Access Levels

### **1. CLIENT (Login Required)**

**What They Can See/Do:**
- ✅ View their own published galleries only
- ✅ View photos in Instagram-style grid
- ✅ Download all photos as ZIP
- ✅ Select and download specific photos
- ✅ Leave 5-star ratings and reviews
- ✅ Add feedback tags
- ✅ Consent to public testimonial use

**What They CANNOT See:**
- ❌ Draft galleries
- ❌ Other clients' galleries
- ❌ Upload photos
- ❌ Gallery management controls
- ❌ Analytics

---

### **2. STAFF (Login Required)**

**What They Can Do:**
- ✅ View all galleries (draft/published/archived)
- ✅ Upload photos with Instagram crop presets
- ✅ Batch upload multiple photos
- ✅ Publish/Unpublish galleries
- ✅ Share public gallery links
- ✅ Replace cover images
- ✅ View client feedback

**What They CANNOT Do:**
- ❌ Delete galleries (admin only)
- ❌ Access analytics dashboard
- ❌ Moderate testimonials

---

### **3. ADMIN (Full Access)**

**Full Permissions:**
- ✅ All staff permissions
- ✅ View gallery insights & reports
- ✅ Moderate client testimonials
- ✅ Archive/Delete galleries
- ✅ Export analytics data
- ✅ View download statistics
- ✅ See rating distribution
- ✅ Access feedback keywords/tags

---

## 🚀 How to Access

### **Client Gallery Access**

**Option 1: Client Login**
1. Visit `/client/login`
2. Login with credentials
3. Navigate to `/gallery` or click "My Galleries"
4. Only see published galleries for your account

**Option 2: Public Share Link (No Login)**
```
https://ambiance.lk/gallery/public/TOKEN-123
```
- 30-day expiry
- View & download only
- No feedback submission

---

### **Staff Gallery Management**

**Login & Access:**
1. Visit `/staff/login`
2. Enter credentials
3. Navigate to `/gallery`
4. See all galleries with filters

**Upload Photos:**
```
/gallery → Click gallery → Upload button → /gallery/upload/:bookingId
```

---

### **Admin Gallery Reports**

**Access Dashboard:**
1. Visit `/admin/login`
2. Any credentials work (development mode)
3. Navigate to `/admin/reports/gallery`
   OR
   Click "Galleries" in admin nav → "View Reports"

---

## ✨ Feature Breakdown

### **📂 Galleries List** (`/gallery`)

#### **Client View:**

**Gallery Cards Show:**
- Cover photo (square aspect)
- Gallery title (e.g., "Silva-Perera Wedding")
- Event date
- Photo count badge
- Rating (if feedback submitted)
- Download count
- "View Gallery" button

**Features:**
- Search by title
- Cards grid (3 columns desktop, 2 tablet, 1 mobile)
- Only shows published galleries
- Hover effects with scale

---

#### **Staff/Admin View:**

**Additional Features:**
- **Status Filter:**
  - All Status
  - Draft (gray badge)
  - Published (blue badge)
  - Archived (purple badge)
  
- **Statistics Dashboard:**
  - Total Galleries count
  - Published count
  - Average rating (4.9★)
  - Total photos count

- **Search & Filter:**
  - Search by client name
  - Search by booking ID
  - Filter by status
  - Real-time results

- **Create Gallery Button:**
  - Links to upload page
  - Creates new gallery

---

### **📸 Single Gallery View** (`/gallery/:bookingId`)

#### **Gallery Header:**

**Information Displayed:**
- Gallery title (large serif font)
- Status badge (Draft/Published/Archived)
- Event date & location
- Photographer name
- Photo count
- Average rating (if available)

---

#### **Client Actions:**

**Selection Mode:**
1. Click "Select Photos" button
2. Click photos to select/deselect
3. Selected photos show yellow ring + checkmark
4. "Select All" / "Deselect All" toggle
5. Download selected button appears

**Download Options:**
- **Download All** - ZIP of all photos
- **Download Selected** - ZIP of selected photos only

**Feedback:**
- "Leave Feedback" button
- Links to `/feedback/:bookingId`
- Prominent yellow button

---

#### **Staff/Admin Actions:**

**Gallery Management:**
- **Upload Photos** - Add new photos to gallery
- **Share** - Generate public share link
- **Publish** - Make gallery visible to client
- **Unpublish** - Move back to draft status
- **Replace Cover** - Set new cover image (planned)

---

#### **Photo Grid:**

**Instagram-Style Layout:**
- Square tiles (1080×1080)
- 3 columns on desktop
- 2 columns on tablet
- 1 column on mobile
- Hover zoom effect (scale 1.05)
- Gradient overlay on hover
- Click to view full-size lightbox

**Lightbox Viewer:**
- Full-screen dark overlay
- Large photo preview
- Close button (top-right)
- Click outside to close
- Smooth animations

---

### **📤 Upload & Crop** (`/gallery/upload/:bookingId`)

#### **Upload Settings:**

**Crop Preset Selector:**
- **Square (1080×1080)** - Recommended ⭐
- **Portrait (1080×1350)** - Tall format
- **Landscape (1080×566)** - Wide format

**Features:**
- All photos auto-crop to selected preset
- Uniform size across gallery
- Instagram-ready delivery

**Publish Toggle:**
- Checkbox: "Publish gallery immediately after upload"
- Skip draft stage if checked

---

#### **Drop Zone:**

**Upload Methods:**
1. **Drag & Drop** - Drop files into zone
2. **Click to Browse** - File picker dialog

**Accepted Formats:**
- JPG / JPEG
- PNG
- WebP

**File Validation:**
- Max 20MB per file
- Invalid files rejected with toast message
- File type check
- Size check

---

#### **Selected Files Preview:**

**Features:**
- Grid preview of all selected files
- Thumbnail for each photo
- File name display
- Individual remove button
- "Clear All" option
- Photo count display

---

#### **Upload Process:**

**Progress Tracking:**
1. Upload initiated
2. Progress bar shows percentage
3. Processing indicator
4. Success toast notification
5. Auto-redirect to gallery

**Success Message:**
```
"Upload complete — 24 photos added to gallery"
```

---

#### **Upload Guidelines:**

**Automatic Processing:**
✅ All photos cropped to selected preset  
✅ Optimized for web delivery  
✅ EXIF data stripped (including GPS for privacy)  
✅ Thumbnails generated  
✅ WebP compression (where possible)  

---

### **⭐ Feedback & Ratings** (`/feedback/:bookingId`)

#### **5-Star Rating System:**

**Interactive Stars:**
- Click to select rating (1-5 stars)
- Hover preview
- Required field (cannot submit without rating)
- Visual feedback:
  - 1 Star = Poor
  - 2 Stars = Fair
  - 3 Stars = Good
  - 4 Stars = Very Good
  - 5 Stars = Excellent

---

#### **Review Text:**

**Features:**
- Optional text field
- 500 character limit
- Character counter
- Multi-line textarea
- Placeholder guidance

**Example Prompts:**
```
Share your thoughts about the photography, 
service, creativity, professionalism...
```

---

#### **Feedback Tags:**

**Quick Selection Tags:**
- ⏰ **On Time** - Punctuality
- 🎨 **Creative** - Artistic vision
- 😊 **Friendly** - Personable service
- 👔 **Professional** - Business conduct
- 💬 **Responsive** - Communication
- ✨ **High Quality** - Photo excellence

**Features:**
- Multi-select (choose multiple tags)
- Toggle on/off by clicking
- Visual highlight when selected
- Yellow border for active tags

---

#### **Public Testimonial Consent:**

**Checkbox:**
```
I consent to Ambiance Studio using my feedback 
as a testimonial on their website and marketing 
materials. My name may be displayed publicly.
```

**Features:**
- Optional checkbox
- Only consented reviews can be featured
- Admin must still approve before public display
- Clear privacy disclosure

---

#### **Submit Flow:**

**Process:**
1. Client fills rating (required)
2. Optional review & tags
3. Optional consent checkbox
4. Click "Submit Feedback"
5. Validation check
6. Success animation
7. Thank you message
8. Auto-redirect to gallery

**Success Screen:**
- Green checkmark icon
- "Thank You!" heading
- Confirmation message
- Back to Gallery button

---

### **📊 Gallery Insights** (`/admin/reports/gallery`)

#### **Dashboard Statistics (4 Cards):**

1. **Total Galleries**
   - Count: 24
   - Change indicator: "+4 this month"
   - Blue theme

2. **Delivered Galleries**
   - Count: 20
   - Delivery rate: "83% rate"
   - Green theme

3. **Average Rating**
   - Rating: 4.8 ★
   - Change: "+0.2 vs last month"
   - Yellow theme

4. **Total Downloads**
   - Count: 1,247
   - Change: "+156 this week"
   - Purple theme

---

#### **Chart 1: Gallery Delivery Rate (Bar Chart)**

**Data Shown:**
- Monthly breakdown (Jan, Feb, Mar)
- Delivered galleries (green bars)
- Pending galleries (yellow bars)
- Comparison view

**Insights:**
- Track delivery timelines
- Identify bottlenecks
- Monitor workload

---

#### **Chart 2: Rating Distribution (Pie Chart)**

**Breakdown:**
- 5 Stars: 60% (12 reviews)
- 4 Stars: 25% (5 reviews)
- 3 Stars: 10% (2 reviews)
- 2 Stars: 5% (1 review)

**Features:**
- Color-coded segments
- Percentage labels
- Hover tooltips
- Visual satisfaction overview

---

#### **Chart 3: Top Feedback Tags (Bar Graph)**

**Top Keywords:**
1. Professional - 18 mentions
2. Creative - 15 mentions
3. On Time - 14 mentions
4. Friendly - 12 mentions
5. High Quality - 10 mentions

**Features:**
- Horizontal progress bars
- Gradient fill (yellow to red)
- Count display
- Relative sizing

---

#### **Downloads by Gallery Table:**

**Columns:**
- Gallery name
- Photo count
- Total downloads
- Average downloads per photo

**Sample Data:**
```
Silva Wedding    | 124 photos | 156 downloads | 1.3x avg
Fernando Birthday| 87 photos  | 87 downloads  | 1.0x avg
Perera Corporate | 156 photos | 203 downloads | 1.3x avg
```

**Insights:**
- Identify popular galleries
- Track client engagement
- Download metrics

---

#### **Date Range Filter:**

**Quick Options:**
- Last 7 Days
- Last 30 Days
- Year to Date

**Export Button:**
- Download reports as PDF/Excel
- Full analytics data

---

## 🗺️ Routes Reference

### **Public/Client Routes**
```
GET  /gallery                   → Galleries List (Client View)
GET  /gallery/:bookingId        → Single Gallery View
POST /gallery/:bookingId/download-all
POST /gallery/:bookingId/download-selected
GET  /feedback/:bookingId       → Feedback Form
POST /feedback/:bookingId       → Submit Feedback
```

### **Staff Routes (Staff/Admin Auth)**
```
GET  /gallery                   → Galleries List (Staff View)
GET  /gallery/upload/:bookingId → Upload & Crop Page
POST /gallery/:bookingId/photos → Upload Photos
PATCH /gallery/:bookingId       → Publish/Unpublish
POST /gallery/:bookingId/share  → Generate Share Link
```

### **Admin Routes (Admin Auth Only)**
```
GET  /admin/reports/gallery     → Gallery Insights Dashboard
GET  /api/reports/galleries     → Analytics Data
PATCH /feedback/:feedbackId     → Approve/Hide Testimonial
```

---

## 📐 Instagram Format Specs

### **Crop Presets:**

#### **1. Square (Recommended)**
```
Dimensions: 1080 × 1080 pixels
Aspect Ratio: 1:1
Use Case: Most versatile, Instagram feed
```

#### **2. Portrait**
```
Dimensions: 1080 × 1350 pixels
Aspect Ratio: 4:5
Use Case: Tall shots, full-body portraits
```

#### **3. Landscape**
```
Dimensions: 1080 × 566 pixels
Aspect Ratio: 1.91:1
Use Case: Wide shots, group photos
```

---

### **Why Instagram Format?**

✅ **Client Benefits:**
- Ready to share on social media
- No cropping needed
- Professional presentation
- Consistent aesthetic

✅ **Studio Benefits:**
- Uniform gallery appearance
- Predictable layouts
- Fast delivery optimization
- Storage efficiency

✅ **Technical Benefits:**
- WebP compression support
- Thumbnail generation
- CDN-friendly sizing
- Mobile-optimized

---

## 💡 Key Features

✅ **Instagram-Ready Photos** - Auto-crop to 1080×1080  
✅ **Drag & Drop Upload** - Easy batch uploads  
✅ **5-Star Ratings** - Client satisfaction tracking  
✅ **Feedback Tags** - Quick sentiment analysis  
✅ **Publish Workflow** - Draft → Published → Archived  
✅ **Share Links** - Public token links (30-day expiry)  
✅ **Download All/Selected** - Flexible download options  
✅ **Lightbox Viewer** - Full-screen photo viewing  
✅ **Privacy Protection** - EXIF/GPS data removal  
✅ **Analytics Dashboard** - Comprehensive insights  
✅ **Testimonial Moderation** - Admin approval system  

---

## 🔐 Security & Privacy

### **Access Control:**
- Role-based permissions (Client/Staff/Admin)
- Session-based authentication
- Token-based public links
- Auto-redirect if not authenticated

### **Privacy Features:**
- EXIF data stripping (including GPS coordinates)
- Client can only see own galleries
- Public consent required for testimonials
- Admin moderation before public display
- Optional password protection on share links

### **Data Protection:**
- Token links with expiry (30 days)
- Revokable access tokens
- Download quota tracking (optional)
- Rate limiting on downloads
- Secure file storage

---

## 🎨 Design Features

### **Dark Burgundy Theme:**
- Background: Black with burgundy gradients
- Primary: Yellow/Gold (#fbbf24)
- Accent: Red (#991b1b)
- Cards: Burgundy to black gradient
- Borders: Gray-800 with yellow hover

### **Status Badges:**
- **Draft:** Gray background, gray text
- **Published:** Blue background, blue text
- **Archived:** Purple background, purple text

### **Photo Grid:**
- Square tiles with rounded corners (8px)
- Subtle shadow
- Hover zoom (scale 1.05)
- Gradient overlay on hover
- Selection ring (yellow)

### **Animations:**
- Staggered grid load
- Smooth transitions
- Progress bars
- Success animations
- Lightbox fade in/out

---

## 📊 Sample Data

### **Gallery Example:**
```
Booking ID: BK-2024-001
Title: Silva-Perera Wedding
Event Date: 2024-03-25
Status: Published
Photos: 124
Rating: 5.0 ★
Downloads: 156
Photographer: Amaya Silva
```

### **Feedback Example:**
```
Rating: 5 stars
Review: "Absolutely stunning photos! Amaya captured 
every special moment beautifully. Very professional 
and creative."
Tags: Professional, Creative, On Time, Friendly
Consent: Yes
Status: Approved (public testimonial)
```

---

## 🔄 Status Workflow

### **Gallery Lifecycle:**

```
Create → Draft → Published → Archived

Draft:
- Staff can edit
- Client cannot see
- Not in public lists

Published:
- Client can access
- Download enabled
- Feedback enabled
- Public share links active

Archived:
- Hidden from client
- Kept for records
- Admin access only
- Historical data preserved
```

---

## 🚀 Next Steps (Backend Integration)

When ready to connect to real backend:

1. **API Endpoints:**
   - `POST /api/galleries/:bookingId/photos` - Upload
   - `GET /api/galleries/:bookingId/photos` - List
   - `DELETE /api/galleries/:bookingId/photos/:photoId` - Remove
   - `POST /api/feedback/:bookingId` - Submit
   - `GET /api/feedback/:bookingId` - View
   - `PATCH /api/feedback/:feedbackId` - Moderate

2. **File Storage:**
   - S3 or Cloudinary integration
   - Image processing (sharp/jimp)
   - Thumbnail generation
   - WebP conversion
   - ZIP creation for downloads

3. **Features to Add:**
   - Email notifications on gallery publish
   - SMS reminders for feedback
   - Watermark overlay option
   - Bulk delete photos
   - Reorder photos (drag & drop)
   - Video support
   - Album sets

---

## 📞 Support

For questions or issues:
- Check this guide first
- Review the code comments
- Test with mock data
- Use browser console for debugging

---

**Built with ❤️ for Ambiance Photography Studio**
