📘 MEMBER REPORT — S. Anchuga
Module / Page: Client Management\ Theme: ShootProof inspired modern SaaS (clean, neutral, pastel highlights)\ Primary Responsibilities: Client auth, profile, dashboard, booking request submission UI (request only), booking history view only\ Explicit Boundaries: No booking creation/editing/rescheduling UI (belongs to R. Chanjugaa). The “booking request” here captures a client’s intent and passes it to the Booking module for approval/scheduling.
1) Page Purpose
Provide a simple, secure place for clients to:
•	Register and log in
•	Manage their profile and avatar
•	Submit a booking request (request only; does not create a scheduled booking)
•	View their booking history and statuses
This page must strictly consume booking data and emit booking requests; all lifecycle management (approve/confirm/reschedule/cancel) occurs in Booking & Service Management (Chanjugaa).

2) Routes & Navigation
/client/register
/client/login
/client/dashboard
/client/profile
/client/book      (Booking Request submission form - request only)
/client/bookings  (History - read-only)




•	From Dashboard, provide:
o	Profile (go to /client/profile)
o	Request a Booking (go to /client/book)
o	View Booking History (go to /client/bookings)
•	“Request a Booking” button does not schedule; it creates a Pending Request that the booking module processes.

3) UX / Theme (ShootProof style)
•	Layout: Centered content, max width 1200px, generous whitespace
•	Colors: neutrals + soft pastels 
:root{
  --primary-blue:#4C8BF5; --white:#FFF; --light-grey:#F3F4F6; --grey:#D1D5DB;
  --dark-grey:#1F2937; --pastel-blue:#C7E0FF; --pastel-lavender:#E3D9FF;
  --pastel-peach:#FFE7D6; --success:#27AE60; --error:#E63946;
  --radius:10px; --shadow-soft:0 2px 6px rgba(0,0,0,.05);
  --space-2:8px; --space-3:16px; --space-4:24px; --space-5:32px; --space-6:48px;
}
•	Typography: Inter (headings 600–700, body 400–500; H1 48px, H2 36px, H3 28px, body 16–18px)
•	Components: white cards, rounded corners, soft shadows, thin borders, blue primary buttons
•	Accessibility: labels on inputs, visible focus state, Alt text on avatar, keyboard navigable forms





4) Page Contents (Sections & Behavior)
4.1 Register (/client/register)
•	Fields: Full name, Email, Phone, Password, Confirm Password, (optional) Profile photo upload
•	Validation: required fields, valid email, phone format, password match (8+ chars)
•	Actions: Create Account (POST), Go to Login
•	Success: redirect to /client/dashboard with welcome toast
4.2 Login (/client/login)
•	Fields: Email, Password
•	Actions: Login, Forgot Password (link to flow if available), Register
•	State: store JWT in secure storage (httpOnly cookie recommended if backend supports), minimal remember me
4.3 Client Dashboard (/client/dashboard)
•	Header: “Welcome back, {FirstName}”
•	3 Quick Cards:
o	Profile → /client/profile
o	Request a Booking → /client/book
o	Booking History → /client/bookings
•	Optional: show 3 most recent bookings (read only)
4.4 Profile (/client/profile)
•	Layout: 2 columns (left avatar, right form) in a white card on light section background
•	Fields: Name, Email (read only if unique), Phone, Change Password (show/hide fields), Profile Photo (preview + change)
•	Actions: Save, Cancel
•	Validation: standard + phone mask

4.5 Booking Request (REQUEST ONLY) (/client/book)
•	Purpose: allow clients to request a booking; not to schedule
•	Fields:
o	Service Type (Wedding/Event/Studio/Outdoor — dropdown sourced from Chanjugaa’s packages)
o	Preferred Date (single date)
o	Preferred Time Window (e.g., Morning/Afternoon/Evening or free text)
o	Notes
•	Submit Behavior:
o	POST a Booking Request to backend (dedicated endpoint)
o	Status set to RequestPending
o	Booking team (Chanjugaa) will convert this request → actual booking with date/time slot in their page
•	On success: toast + link to Booking History
✅ This preserves clear boundaries: Anchuga collects intent; Chanjugaa schedules & manages.
4.6 Booking History (read only) (/client/bookings)
•	Table Columns: Request/Booking ID, Type, Preferred Date, Actual Date (if set), Status (chips: Pending=blue, Confirmed=green, Cancelled=grey), Action: View
•	No edit/reschedule/cancel buttons here (belongs to Booking page)







5) Components to Implement / Reuse
•	AuthCard (Login/Register)
•	ProfileCard (avatar + details)
•	FormInput, FormSelect, PhoneInput (consistent borders/focus)
•	PrimaryButton, SecondaryButton
•	RequestBookingForm (the request only form)
•	BookingHistoryTable (read only)
•	Toast / Snackbar for feedback
All must use shared theme tokens and consistent spacing.

6) API Contracts (consume/emit)
Anchuga coordinates with backend (Abishek/Chanjugaa) but does not build booking APIs.
Auth & Profile
•	POST /api/client/register → { id, name, email, phone, token }
•	POST /api/client/login → { token, client:{ id, name, email, phone, avatarUrl } }
•	GET /api/client/profile/:id → client profile object
•	PUT /api/client/profile/:id → updated profile object
•	(Optional) POST /api/client/avatar → { avatarUrl }








Booking Request (new endpoint)
•	POST /api/booking-requests\ Request: 
{
  "clientId": "CLT123",
  "serviceType": "Wedding",
  "preferredDate": "2026-03-15",
  "preferredTimeWindow": "Evening",
  "notes": "Outdoor shoot preferred"
}
Response: { "requestId":"REQ789", "status":"RequestPending", "createdAt":"2026-02-06T10:10:00Z" }
Booking History (read only)
•	GET /api/bookings/client/:clientId\ Item shape: 
{
  "id":"BK1205",
  "type":"Wedding",
  "requestedDate":"2026-03-15",
  "scheduledDate":"2026-03-16T14:00:00Z",
  "status":"Confirmed"
}
Backend note: booking requests can either live in a separate collection/table (e.g., booking_requests) or as a booking with status=RequestPending to be converted by the Booking module.



7) Data Model (Client side expectations)
clients
•	id, name, email (unique), phone, avatarUrl, createdAt
booking_requests (if separate)
•	requestId, clientId, serviceType, preferredDate, preferredTimeWindow, notes, status=RequestPending, createdAt
bookings (read only for Anchuga)
•	id, clientId, packageId, scheduledDateTime, status, lastUpdated
________________________________________
8) Security & Privacy
•	Use secure auth token handling (prefer httpOnly cookie if backend supports; otherwise store JWT in memory + refresh strategy)
•	Don’t show emails/phones on public routes
•	Validate and sanitize all inputs client side (and expect backend to re validate)
________________________________________
9) Error States & Empty States
•	Register/Login errors: show inline messages beneath fields
•	Profile save error: toast + keep unsaved values
•	Booking requests: if submit fails, keep form data and show retry
•	Booking history empty: show pastel empty state card: “No bookings yet. Start by requesting a booking.”
________________________________________
10) Performance
•	Debounce validation on inputs
•	Lazy load booking history if large
•	Cache profile response during session
•	Compress avatar images client side (if size too large)
11) Accessibility
•	Label + aria-describedby for input errors
•	Focus ring visible on all interactive controls
•	Tab order natural; submit on Enter works in forms
________________________________________
12) Analytics (optional but helpful)
•	Events: client_register, client_login_success, profile_update, booking_request_submit, booking_request_fail
•	Expose simple counters to Admin (later)
________________________________________
13) QA — Test Cases & Acceptance Criteria
Register/Login
•	[ ] Prevents invalid email/short password
•	[ ] Successful register → logged in session starts
•	[ ] Wrong password → inline error
Profile
•	[ ] Updates persist after refresh
•	[ ] Avatar preview works; large images constrained
Booking Request
•	[ ] Submitting creates RequestPending record
•	[ ] After submit, history shows request row (status pending)
•	[ ] No direct scheduling from this page
Booking History
•	[ ] Loads latest statuses (Confirmed/Pending/Cancelled)
•	[ ] No edit/reschedule controls displayed

Definition of Done
•	Meets theme & accessibility rules
•	Mobile responsive (≤360px)
•	All forms validated & errors surfaced
•	Integrated with live/mock APIs
•	Unit tests for form validation and request submission
•	Code reviewed and merged to dev
________________________________________
14) Trello Task Breakdown (for Anchuga)
•	UI Scaffolding
o	Create /client/* routes & empty pages
o	Add shared AuthCard, PrimaryButton, FormInput
•	Auth
o	Build Register page (validation + API integration)
o	Build Login page (error handling)
•	Profile
o	Profile view/edit form
o	Avatar upload + preview
o	Save/Cancel flows
•	Booking Request
o	Request form component
o	Submit to /api/booking-requests
o	Success/Fail toasts
•	History
o	Read only table for bookings
o	Status chips
•	Hardening
o	Responsive tweaks
o	Accessibility sweep
o	Unit tests
________________________________________
15) Hand offs & Dependencies
•	From Chanjugaa: packages list (service types) for the request dropdown
•	To Chanjugaa: booking request payloads (used to create real bookings)
•	From Backend: auth/profile endpoints; booking history endpoint
•	To Admin (Thiviyanath): future analytics events (optional)
.

