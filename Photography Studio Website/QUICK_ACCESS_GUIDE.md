# Quick Access Guide - Ambiance Studio

## 🔐 How to Access Admin Payments

### **Method 1: Login First (Recommended)**

1. **Visit Admin Login:**
   ```
   http://localhost:5173/admin/login
   ```

2. **Enter ANY credentials:**
   - Email: `admin@ambiance.lk`
   - Password: `password`
   - Click "Sign In"

3. **Navigate to Payments:**
   - After login, you'll be at `/admin/dashboard`
   - Click "Payments" in the navigation bar
   - OR directly visit: `http://localhost:5173/admin/payments`

---

### **Method 2: Quick Test (Browser Console)**

Open browser console (F12) and run:

```javascript
// Set admin authentication
localStorage.setItem('isAuthenticated', 'true');
localStorage.setItem('userRole', 'admin');
localStorage.setItem('userName', 'Admin User');
localStorage.setItem('userEmail', 'admin@ambiance.lk');

// Then visit
window.location.href = '/admin/payments';
```

---

## 📍 All Admin Routes

```
/admin/login              → Admin Login Page
/admin/dashboard          → Admin Dashboard
/admin/employees          → Employee Management
/admin/events             → Event Management
/admin/payments           → Payments & Invoices ⭐
/admin/invoices/:id       → Invoice Detail View
/admin/reports/finance    → Finance Reports
/admin/reports/gallery    → Gallery Reports
```

---

## 🚀 All Client Routes

```
/client/login             → Client Login
/client/register          → Client Registration
/client/dashboard         → Client Dashboard
/client/profile           → Profile Management
/client/book              → Booking Request Form
/client/bookings          → Booking History
```

---

## 🎨 All Gallery Routes

```
/gallery                  → Galleries List
/gallery/:bookingId       → Single Gallery View
/gallery/upload/:bookingId → Upload Photos
/feedback/:bookingId      → Submit Feedback
```

---

## 🌐 All Public Routes

```
/                         → Home Page
/about                    → About Us
/packages                 → Packages Page
/employees                → Employee Directory
/events/gallery           → Events Gallery
/contact                  → Contact Page
```

---

## ⚡ Quick Login Credentials (Development Mode)

### **Admin:**
- URL: `/admin/login`
- Email: `admin@ambiance.lk`
- Password: `password` (any password works)

### **Staff:**
- URL: `/staff/login`
- Email: `staff@ambiance.lk`
- Password: `password` (any password works)

### **Client:**
- URL: `/client/login`
- Email: `client@ambiance.lk`
- Password: `password` (any password works)

---

## 🐛 If You Get 404 on /admin/payments

### **Troubleshooting Steps:**

1. **Check if logged in:**
   ```javascript
   // In browser console:
   console.log(localStorage.getItem('userRole'));
   // Should show: "admin"
   ```

2. **Clear browser cache:**
   - Press `Ctrl + Shift + Delete` (Windows/Linux)
   - Press `Cmd + Shift + Delete` (Mac)
   - Clear cache and reload

3. **Hard refresh:**
   - Press `Ctrl + F5` (Windows/Linux)
   - Press `Cmd + Shift + R` (Mac)

4. **Check URL is correct:**
   ```
   http://localhost:5173/admin/payments
   ```
   NOT:
   ~~http://localhost:5173/payments~~
   ~~http://localhost:5173/admin/payment~~ (no 's')

5. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   # Then restart
   npm run dev
   ```

---

## 📊 Feature Access by Role

### **Admin (Full Access):**
- ✅ Employees
- ✅ Events  
- ✅ Payments & Invoices
- ✅ Gallery Management
- ✅ All Reports
- ✅ Client Management

### **Staff:**
- ✅ View assigned events
- ✅ Upload photos
- ✅ View bookings
- ❌ Payments
- ❌ Reports

### **Client:**
- ✅ Profile
- ✅ Booking requests
- ✅ View galleries
- ✅ Submit feedback
- ❌ Admin features

---

## 🔗 Navigation Flow

### **Admin Navigation Bar:**

When logged in as admin, you'll see:

```
[Dashboard] [Employees] [Events] [Payments] [Galleries] [Logout]
```

Click **"Payments"** to go to `/admin/payments`

---

## 💡 Common Issues & Solutions

### **Issue: "404 Page Not Found" on /admin/payments**

**Solution 1:** Login first
```
1. Go to /admin/login
2. Enter any credentials
3. Click Sign In
4. Then click Payments in nav
```

**Solution 2:** Set localStorage manually
```javascript
localStorage.setItem('isAuthenticated', 'true');
localStorage.setItem('userRole', 'admin');
window.location.reload();
```

---

### **Issue: Page shows but looks broken**

**Solution:** Clear cache and hard refresh
```
Ctrl + Shift + Delete → Clear cache
Then Ctrl + F5 to hard refresh
```

---

### **Issue: "Access Denied" message**

**Solution:** Check user role
```javascript
// Should be 'admin'
console.log(localStorage.getItem('userRole'));

// If not, set it:
localStorage.setItem('userRole', 'admin');
window.location.reload();
```

---

## 🎯 Testing All Payment Features

Once on `/admin/payments`:

### **Tabs Available:**
1. **Payments** - Record new payments
2. **Invoices** - Generate invoices

### **Test Actions:**

**Record a Payment:**
1. Click "+ Record Payment" button
2. Fill form:
   - Client: Select client
   - Booking: Select booking
   - Amount: Rs. 50,000
   - Method: Bank Transfer
   - Date: Today
   - Notes: Test payment
3. Click "Record Payment"
4. Success toast appears
5. Payment added to table

**Generate Invoice:**
1. Click "Invoices" tab
2. Click "+ Generate Invoice"
3. Fill form:
   - Client: Select client
   - Booking: Select booking
   - Items: Add line items
   - Discount: Optional
4. Click "Generate Invoice"
5. Invoice appears in list

**View Invoice:**
1. Click "View" on any invoice
2. See invoice detail page
3. Download PDF or Share options

---

## 🚀 Quick Start Commands

### **Start Development Server:**
```bash
npm run dev
```

### **Access URLs:**
```
Main App:    http://localhost:5173
Admin:       http://localhost:5173/admin/login
Client:      http://localhost:5173/client/login
Payments:    http://localhost:5173/admin/payments
```

---

## 📱 Mobile Testing

**Responsive Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Test on mobile:**
1. Open browser DevTools (F12)
2. Click device toolbar icon
3. Select device (iPhone/iPad/etc)
4. Test all features

---

## 🔧 Developer Tools

### **Check Route Loading:**
```javascript
// In browser console:
console.log(window.location.pathname);
// Should show: "/admin/payments"
```

### **Check Component Mounted:**
```javascript
// Look for AdminPayments component in React DevTools
```

### **Check for Errors:**
```javascript
// Open Console tab (F12)
// Look for red error messages
```

---

**If you're still seeing 404, please share:**
1. The exact URL you're visiting
2. What you see in browser console (F12)
3. Your localStorage values:
   ```javascript
   console.log({
     auth: localStorage.getItem('isAuthenticated'),
     role: localStorage.getItem('userRole')
   });
   ```

