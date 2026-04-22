# Payment & Invoice Management - Complete Guide

## 🎯 Overview

The Ambiance Photography Studio Payment & Invoice Management System provides comprehensive financial tracking, payment recording, invoice generation, and financial reporting capabilities.

---

## 📋 Table of Contents

1. [System Architecture](#system-architecture)
2. [Access Levels](#access-levels)
3. [How to Access](#how-to-access)
4. [Feature Breakdown](#feature-breakdown)
5. [Routes Reference](#routes-reference)
6. [Business Logic](#business-logic)

---

## 🏗️ System Architecture

### **Financial Management Flow:**

```
┌─────────────────────────────────────────────────┐
│           ADMIN ACCESS ONLY                     │
│  • Record Payments (/admin/payments)            │
│  • Manage Invoices                              │
│  • View Financial Reports                       │
│  • Download PDFs                                │
│  • Share Invoice Links                          │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│          FINANCIAL TRACKING                     │
│  • Payment Recording                            │
│  • Invoice Generation                           │
│  • Balance Calculation                          │
│  • Status Management                            │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│          REPORTING & ANALYTICS                  │
│  • Revenue Trends                               │
│  • Payment Method Analysis                      │
│  • Package Performance                          │
│  • Outstanding Tracking                         │
└─────────────────────────────────────────────────┘
```

---

## 🔐 Access Levels

### **ADMIN ONLY (Full Access)**

**What They Can Do:**
- ✅ Record payments
- ✅ Generate invoices
- ✅ View all financial data
- ✅ Download invoice PDFs
- ✅ Share invoice links with clients
- ✅ Mark invoices as paid
- ✅ View financial reports
- ✅ Export financial data
- ✅ Track outstanding balances
- ✅ Manage invoice status

**Protected Features:**
- All payment and invoice features require admin authentication
- Auto-redirect to `/admin/login` if not authenticated

---

## 🚀 How to Access

### **Admin Payment Management**

**Option 1: Login & Navigate** ⭐ **RECOMMENDED**
1. Visit `http://localhost:5173/admin/login`
2. Enter any email (e.g., `admin@ambiance.lk`)
3. Enter any password
4. Click "Sign In"
5. You'll be redirected to `/admin/dashboard`
6. Click **"Payments"** in the navigation bar

**Option 2: Direct Access**
```
http://localhost:5173/admin/payments
```

**Option 3: Quick Access (Development)**
```javascript
// Open browser console (F12) and run:
localStorage.setItem('isAuthenticated', 'true');
localStorage.setItem('userRole', 'admin');
localStorage.setItem('userName', 'Admin User');
localStorage.setItem('userEmail', 'admin@ambiance.lk');

// Then navigate to: http://localhost:5173/admin/payments
```

---

## ✨ Feature Breakdown

### **📊 Admin Payments & Invoices** (`/admin/payments`)

#### **Dashboard Statistics**

**4 Key Metrics:**
1. **Total Revenue** - Rs. 1,320,000
   - Green indicator
   - Shows total revenue for selected period
   
2. **Outstanding Balance** - Rs. 245,000
   - Yellow indicator
   - Unpaid invoices amount
   
3. **Total Invoices** - 4
   - Blue indicator
   - Count of all invoices
   
4. **Payments This Month** - 3
   - Purple indicator
   - Recent payment count

---

#### **Tab Navigation**

**Two Main Tabs:**

##### **1. Payments Tab**

**Displays:**
- Payment history table
- All recorded payments
- Payment methods
- Amounts and dates

**Table Columns:**
- **ID** - Auto-generated payment number
- **Client** - Client name
- **Booking ID** - Linked booking reference
- **Amount** - Payment amount (Rs.)
- **Method** - Cash/Bank/Card/Online
- **Date** - Payment date
- **Notes** - Additional information

**Features:**
- Search by client or booking
- Filter by payment method
- Real-time filtering

---

##### **2. Invoices Tab**

**Displays:**
- All generated invoices
- Invoice status tracking
- Payment progress

**Table Columns:**
- **Invoice #** - Unique invoice number
- **Client** - Client name
- **Booking ID** - Linked booking
- **Dates** - Issue date & Due date
- **Total** - Invoice total amount
- **Paid** - Amount paid (green)
- **Outstanding** - Balance due (yellow)
- **Status** - Color-coded badge
- **Actions** - View & Download buttons

**Status Types:**
- 🔵 **Draft** - Not yet finalized
- 🟡 **Unpaid** - Awaiting payment
- 🟠 **Partial** - Partially paid
- 🟢 **Paid** - Fully paid
- 🔴 **Overdue** - Past due date
- ⚫ **Void** - Cancelled

---

#### **Record Payment Drawer**

**Slide-in Form Fields:**

**Required Fields:**
- **Client Name** - Autocomplete client selector
- **Booking ID** - Links payment to booking
- **Amount (Rs.)** - Payment amount
- **Payment Method** - Dropdown selection

**Optional Fields:**
- **Invoice ID** - Link to existing invoice
- **Date** - Defaults to today
- **Notes** - Additional information

**Validation Rules:**
- Amount must be > 0
- Cannot exceed outstanding balance (if invoice linked)
- All required fields must be filled

**Actions:**
- **Cancel** - Close without saving
- **Record Payment** - Save payment

**Success Flow:**
1. Form validates input
2. Payment recorded
3. Invoice updated (if linked)
4. Outstanding balance recalculated
5. Success toast notification
6. Drawer closes

---

### **📄 Invoice Detail Viewer** (`/admin/invoices/:invoiceId`)

#### **Professional Invoice Layout**

**Header Section:**
- **Studio Information:**
  - Ambiance Studio logo
  - Business name
  - Address, phone, email
  
- **Invoice Metadata:**
  - Invoice number
  - Issue date
  - Due date
  - Status badge

---

#### **Bill To Section:**
- Client name
- Client phone
- Client email
- Booking reference

---

#### **Items Table:**

**Columns:**
- Description
- Quantity
- Unit Price
- Line Total

**Sample Items:**
- Premium Wedding Package - Rs. 120,000
- Additional Hours (3 hrs) - Rs. 30,000
- Photo Album - Rs. 20,000

---

#### **Totals Panel (Right-Aligned):**

```
Subtotal:            Rs. 150,000
Discount:            Rs. 0
Tax:                 Rs. 0
─────────────────────────────────
Total:               Rs. 150,000
Payments Received:   Rs. 50,000
─────────────────────────────────
Outstanding:         Rs. 100,000 ⚠️
```

---

#### **Notes & Terms:**
- Payment terms
- Cancellation policy
- Delivery timeline
- Refund conditions

---

#### **Footer:**
- Thank you message
- Contact information

---

#### **Action Buttons:**

**Top Right:**
1. **Download PDF** 📥
   - Generates printable invoice
   - A4 portrait format
   - Professional layout
   
2. **Share** 🔗
   - Opens share modal
   - Generates public link
   - Copy to clipboard
   - 30-day expiry
   
3. **Mark as Paid** ✅
   - Only shows if outstanding > 0
   - Updates status to "Paid"
   - Records full payment
   - Redirects to payments list

---

#### **Share Invoice Modal:**

**Features:**
- Public link generation
- Copy to clipboard button
- Expiry date display (30 days)
- Secure token-based URL

**Example Link:**
```
https://ambiance.lk/invoices/public/INV-2024-001
```

---

### **📈 Finance Reports Dashboard** (`/admin/reports/finance`)

#### **Header Controls:**

**Date Range Selector:**
- Last 7 Days
- Last 30 Days
- Year to Date
- Custom Range

**Export Button:**
- Download financial report
- PDF or Excel format

---

#### **Summary Statistics (4 Cards):**

1. **Total Revenue (Period)**
   - Rs. 1,320,000
   - +12.5% vs previous period
   - Green indicator

2. **Payments Received**
   - Rs. 450,000
   - +8.2% increase
   - Blue indicator

3. **Outstanding Balance**
   - Rs. 245,000
   - -5.1% decrease
   - Yellow indicator

4. **Overdue Invoices**
   - 1 invoice (Rs. 90,000)
   - "Needs attention" warning
   - Red indicator

---

#### **Chart 1: Monthly Revenue Trend (Line Chart)**

**Data Displayed:**
- Actual revenue (green line)
- Target revenue (yellow dashed line)
- Monthly comparison (Jan - Apr)

**Features:**
- Hover tooltips
- Axis labels
- Grid lines
- Legend

**Insights:**
- Track performance vs targets
- Identify seasonal trends
- Forecast future revenue

---

#### **Chart 2: Payment Methods (Pie Chart)**

**Breakdown:**
- **Cash** - Rs. 125,000 (28%)
- **Bank Transfer** - Rs. 200,000 (44%)
- **Card** - Rs. 80,000 (18%)
- **Online** - Rs. 45,000 (10%)

**Color Coded:**
- Green - Cash
- Blue - Bank Transfer
- Orange - Card
- Purple - Online

**Features:**
- Percentage labels
- Hover for details
- Transaction count

---

#### **Chart 3: Revenue by Package (Bar Chart)**

**Packages Analyzed:**
- Wedding Premium - Rs. 480,000 (4 bookings)
- Wedding Standard - Rs. 240,000 (2 bookings)
- Birthday Package - Rs. 80,000 (2 bookings)
- Corporate Events - Rs. 350,000 (3 bookings)

**Dual Bars:**
- Revenue (blue)
- Bookings count (orange)

**Insights:**
- Most profitable packages
- Booking frequency
- Package popularity

---

#### **Payment Method Summary Table:**

**Columns:**
- Method name with color indicator
- Total amount
- Transaction count
- Percentage with progress bar

**Visual Features:**
- Color-coded dots
- Horizontal progress bars
- Percentage values
- Sortable columns

---

## 🗺️ Routes Reference

### **Admin Routes (Admin Auth Required)**
```
GET  /admin/payments              → Payments & Invoices List
GET  /admin/invoices/:invoiceId   → Invoice Detail Viewer
GET  /admin/reports/finance       → Finance Reports Dashboard
```

---

## 📊 Business Logic

### **Invoice Status Auto-Update Rules:**

**Status Calculation:**
```javascript
if (paid === 0 && today <= dueDate) {
  status = 'unpaid'
}
else if (paid === 0 && today > dueDate) {
  status = 'overdue'
}
else if (paid > 0 && paid < total) {
  status = 'partial'
}
else if (paid === total) {
  status = 'paid'
}
```

---

### **Payment Posting Flow:**

```
1. User records payment
2. System validates amount > 0
3. Check if invoice linked
4. If invoice:
   - Verify payment <= outstanding
   - Update invoice.paid_amount
   - Recalculate outstanding
   - Update invoice.status
5. Save payment record
6. Update booking aggregates
7. Commit transaction
8. Show success message
```

---

### **Overpayment Prevention:**

**Rule:**
- If invoice is linked
- Payment amount cannot exceed outstanding balance
- Error message: "Overpayment not allowed"

**Example:**
```
Invoice Total:     Rs. 100,000
Already Paid:      Rs. 60,000
Outstanding:       Rs. 40,000

❌ Cannot record:  Rs. 50,000
✅ Can record:     Rs. 40,000 or less
```

---

### **Invoice Voiding:**

**When Void:**
- Invoice status set to 'void'
- Locks all edits
- Excludes from revenue reports
- Keeps audit trail
- Cannot be un-voided

---

## 🎨 Design Features

### **Currency Format:**
- **Currency:** Sri Lankan Rupees (LKR)
- **Symbol:** Rs.
- **Format:** Rs. 150,000
- **Decimal:** 2 places for cents (if needed)

### **Color Palette:**

**Status Colors:**
- **Paid:** Green (#10b981)
- **Partial:** Yellow (#f59e0b)
- **Overdue:** Red (#dc2626)
- **Unpaid:** Blue (#3b82f6)
- **Draft:** Gray (#6b7280)

**Chart Colors:**
- Primary: Green (#10b981)
- Secondary: Blue (#3b82f6)
- Accent: Orange (#f59e0b)
- Highlight: Purple (#8b5cf6)

### **PDF Invoice Design:**
- **Format:** A4 Portrait
- **Colors:** Monochrome-friendly
- **Layout:** Professional business invoice
- **Sections:** Clear dividers
- **Totals:** Right-aligned
- **Branding:** Studio logo and colors

---

## 💡 Key Features

✅ **Payment Recording** - Quick payment entry with validation  
✅ **Invoice Generation** - Professional invoice creation  
✅ **PDF Download** - Print-ready invoice format  
✅ **Public Sharing** - Secure shareable links  
✅ **Status Tracking** - Auto-updating payment status  
✅ **Balance Calculation** - Real-time outstanding tracking  
✅ **Financial Reports** - Comprehensive analytics  
✅ **Chart Visualization** - Revenue trends and insights  
✅ **Payment Methods** - Multiple payment options  
✅ **Search & Filters** - Quick data access  
✅ **Mobile Responsive** - Works on all devices  

---

## 🔄 Integration with Other Modules

### **Bookings Integration:**
- Payments link to booking IDs
- Invoices generated from bookings
- Booking status updates when paid

### **Client Integration:**
- Client names autocomplete
- Client contact info on invoices
- Payment history per client

### **Reports Integration:**
- Revenue by photographer (planned)
- Event type profitability
- Seasonal trends

---

## 📝 Sample Data

### **Invoice Example:**
```
Invoice #: INV-2024-001
Client: Silva Family
Booking: BK-2024-001
Issue Date: 2024-03-01
Due Date: 2024-03-20

Items:
- Premium Wedding Package x 1 = Rs. 120,000
- Additional Hours x 3 = Rs. 30,000

Total: Rs. 150,000
Paid: Rs. 50,000
Outstanding: Rs. 100,000
Status: Partial
```

### **Payment Example:**
```
Payment #: 0001
Client: Silva Family
Booking: BK-2024-001
Invoice: INV-2024-001
Amount: Rs. 50,000
Method: Bank Transfer
Date: 2024-03-15
Notes: Advance payment for wedding
```

---

## 🚀 Next Steps (Backend Integration)

When ready to connect to real database:

1. **API Endpoints:**
   - `POST /api/payments` - Record payment
   - `GET /api/payments` - List payments
   - `POST /api/invoices` - Create invoice
   - `GET /api/invoices/:id` - Get invoice
   - `PATCH /api/invoices/:id` - Update invoice
   - `POST /api/invoices/:id/share` - Generate share link
   - `GET /api/reports/finance` - Financial reports

2. **Database Tables:**
   - `invoices` - Invoice records
   - `invoice_items` - Line items
   - `payments` - Payment records

3. **Features to Add:**
   - PDF generation service
   - Email invoice delivery
   - Automated reminders
   - Recurring invoices
   - Payment gateway integration

---

## 📞 Support

For questions or issues:
- Check this guide first
- Review the code comments
- Test with mock data
- Use browser console for debugging

---

**Built with ❤️ for Ambiance Photography Studio**
