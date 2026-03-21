📘 MEMBER REPORT — R. Chanjugaa
Module / Page: Booking & Service Management Primary Responsibilities: Create/manage bookings, calendar & availability, package (service) CRUD, status transitions (pending → confirmed → completed/cancelled), reschedule, cancellations.\ Explicit Boundaries:
•	Does not handle client auth/profile (Anchuga).
•	Does not upload/deliver photos or feedback (R. Abishek).
•	Does not manage events gallery (Vaheesh).
•	Does not record payments/invoices (P. Abisheka).
•	Does not manage staff/roles or admin reports (Thiviyanath).

1) Page Purpose
Provide a centralized interface for studio staff/admin to create, view, edit, reschedule, confirm, or cancel bookings and to define/manage service packages (wedding/event/studio/outdoor). Also exposes a calendar to visualize availability and avoid conflicts.

2) Routes & Navigation
/bookings               // bookings list (table)
/bookings/new           // create booking (multi-step)
/bookings/:id           // view/edit booking details
/packages               // service package CRUD
/calendar               // availability/calendar view (can be /bookings?view=calendar)
•	Global nav item: Bookings with sub tabs: List, Calendar, Packages.
•	“Create Booking” button appears in List and Calendar views.



3) UX / Theme (ShootProof style)
•	Layout: Centered content, max width 1200px, generous whitespace.
•	Cards: White background, subtle shadow (0 2px 6px rgba(0,0,0,.05)), radius 10px.
•	Colors (CSS tokens already shared globally):
o	Primary actions: --primary-blue
o	Status chips: Green (Confirmed), Blue (Pending/Booked), Grey (Cancelled), Gold/Amber (Awaiting Payment if you surface it as read only info).
•	Typography: Inter; H1 48px, H2 36px, H3 28px, Body 16–18px.
•	Accessibility: Label every input; show error text; keyboard tabbable; visible focus ring.

4) Page Contents (Sections & Behavior)

4.1 Bookings List (/bookings)
•	Controls (top): Search (client name/ID), Filters (status, package, date range), “Create Booking”, “Export CSV” (optional).
•	Table Columns:
o	Booking ID
o	Client (name + link to client view)
o	Package (Wedding/Event/Studio/Outdoor + package name)
o	Date/Time (scheduled)
o	Assigned Photographer (read only if assigned by Admin module)
o	Status (chip)
o	Actions: View/Edit, Reschedule, Cancel
•	Empty state: Pastel card: “No bookings found. Create your first booking.”


4.2 Create Booking (multi step) (/bookings/new)
•	Step 1 – Client
o	Search existing client by name/phone/email; or quick create a lightweight client record (name/email/phone).
•	Step 2 – Package
o	Select from Packages (sourced from /packages). Show price & duration metadata.
•	Step 3 – Date/Time
o	Date picker + time slot selector. Conflict check runs on change.
•	Step 4 – Notes & Summary
o	Internal notes, summary panel (client, package, datetime, price).
•	Submit → POST creates booking with status=Pending or Confirmed (if your workflow allows auto confirm after payment; default: Pending).
•	Success: Redirect to /bookings/:id with toast.


4.3 Booking Details (/bookings/:id)
•	Header: Booking ID + status chip + quick actions (Confirm, Reschedule, Cancel).
•	Sections (cards):
1.	Client Info (read only link to client)
2.	Package & Pricing (package name, duration, editable package assignment)
3.	Schedule (date, start/end time; “Reschedule” opens date/time modal)
4.	Assignment (read only if assigned by Admin; or an editable dropdown if your scope includes provisional assignment)
5.	Notes (internal)




•	Status Transitions:
o	Pending → Confirmed → Completed
o	Pending/Confirmed → Cancelled
o	Block invalid transitions (e.g., Completed → Pending).
•	Audit (optional): show recent updates history.


4.4 Calendar View (/calendar or /bookings?view=calendar)
•	Views: Month, Week; toggle buttons.
•	Visuals:
o	Blue = Pending/Booked; Green = Confirmed; Grey = Cancelled.
o	Show package type icon/color chip on event blocks.
•	Interactions:
o	Click a booking block → Quick peek (client, package, time) + “Open booking”.
o	Drag to reschedule (optional) → open confirmation modal + conflict re check.
•	Conflict Prevention:
o	When creating/rescheduling, call conflict API; refuse overlaps for same time/resource.
o	(If staff assignment is integrated later, also check per photographer conflicts.)




4.5 Packages (/packages)
•	Package Card Fields:
o	Title (e.g., “Wedding Gold”)
o	Type (Wedding/Event/Studio/Outdoor)
o	Base Price (LKR)
o	Duration (hours)
o	Description / inclusions
o	Active toggle
•	Actions: Create, Edit, Archive/Delete.
•	Grid or list with edit drawer.

5) Components to Implement / Reuse
•	BookingFormStepper (client → package → datetime → summary)
•	CalendarGrid (month/week with clickable items)
•	ConflictBadge / StatusBadge
•	BookingsTable
•	PackageCard / PackageForm
•	RescheduleModal (date/time picker + conflict check)
•	ConfirmDialog (cancel/confirm actions)
All must use shared theme tokens, consistent spacing, and the same button/input styles as the rest of the app.





6) API Contracts (own & consume)
Chanjugaa will own booking/package endpoints and consume client lookup; assignment read may come from Admin service.
Clients (consume)
•	GET /api/clients?query=... → search existing client
•	(Optional) POST /api/clients → quick create minimal client (if allowed)
Packages (own)
•	GET /api/packages
•	POST /api/packages
•	PUT /api/packages/:id
•	DELETE /api/packages/:id (or archive)
Package shape (example):
{
  "id":"PKG-101",
  "type":"Wedding",
  "title":"Wedding Gold",
  "basePrice": 125000,
  "durationHours": 6,
  "description":"Candid + traditional coverage, 2 photographers",
  "active": true
}





Bookings (own)
•	GET /api/bookings?status=&from=&to=&client=&package=
•	GET /api/bookings/:id
•	POST /api/bookings
•	PUT /api/bookings/:id // edit details
•	PUT /api/bookings/:id/status // confirm/cancel/complete
•	PUT /api/bookings/:id/reschedule // date/time change
•	DELETE /api/bookings/:id (rare; prefer cancel)
Booking shape (example):
{
  "id":"BK-1205",
  "clientId":"CL-3001",
  "packageId":"PKG-101",
  "scheduledStart":"2026-03-16T14:00:00+05:30",
  "scheduledEnd":"2026-03-16T20:00:00+05:30",
  "status":"Pending", // Pending | Confirmed | Completed | Cancelled
  "notes":"Bride prefers outdoor portraits",
  "assignedPhotographerId":"STF-77" // (may be read-only from Admin module)
}
Calendar & Conflicts (own)
•	GET /api/calendar?range=YYYY-MM-DD..YYYY-MM-DD → list of booking time blocks
•	POST /api/bookings/conflict-check\ Request: { "start":"...", "end":"...", "packageId":"...", "resourceId": "optional" }\ Response: { "conflict": true/false, "conflictingIds": ["BK-1201"] }
If you later integrate resource-level checks (per photographer/studio room), pass resourceId or a list.

7) Data Model Hints
packages
•	id, type, title, basePrice, durationHours, description, active, createdAt, updatedAt
bookings
•	id, clientId, packageId, scheduledStart, scheduledEnd, status, notes, assignedPhotographerId?, createdAt, updatedAt
calendar (derived)
•	Either computed from bookings on the fly or denormalized for fast month views.
conflict logic
•	Conflict if time windows overlap for the same resource. Start < other.end && end > other.start.

8) Validation & Rules
•	Required: clientId, packageId, scheduledStart/End (where end = start + durationHours)
•	No past booking (unless admin override)
•	No overlap for the same resource (once resources are added)
•	Status transitions:
o	Allowed: Pending→Confirmed, Confirmed→Completed, Pending/Confirmed→Cancelled
o	Disallowed: Completed→Pending, Cancelled→Confirmed (unless new booking)





9) Error, Empty, and Loading States
•	List empty: Show pastel “No bookings yet.” + CTA.
•	Calendar empty: “No bookings in this range.”
•	Conflict: Inline alert on date/time step + disable submit.
•	API errors: Inline messages + retry button.
•	Loading: Use skeletons for tables/card lists.

10) Performance
•	Debounce search/filter on list
•	Lazy load bookings by pages (server pagination)
•	Virtualize table rows if >200
•	Only fetch visible calendar range
•	Memoize calendar event rendering

11) Security
•	Protect all routes with staff/admin auth guard
•	Validate all inputs before send; backend validates again
•	Do not expose client PII beyond required fields

12) QA — Test Cases & Acceptance Criteria
Create Booking
•	[ ] Can search/select existing client or quick create
•	[ ] Selecting package auto sets duration
•	[ ] Conflict check prevents overlapping bookings
•	[ ] Successful submit shows booking in list & calendar


Edit / Reschedule
•	[ ] Changing date/time re checks conflicts
•	[ ] Updating package recalculates end time
•	[ ] Status chips update correctly
Cancel / Confirm / Complete
•	[ ] Allowed transitions only
•	[ ] Cancelled bookings hidden from calendar (or greyed) depending on filter
Packages
•	[ ] Create/edit/archive visible immediately in booking step
•	[ ] Inactive packages not selectable
Definition of Done
•	Theme, accessibility, responsiveness met
•	All flows integrated with live/mock APIs
•	Unit tests for conflict logic, transitions, and package form
•	PR reviewed and merged to dev
________________________________________
13) Trello Task Breakdown (for Chanjugaa)
•	Scaffold
o	Add /bookings, /bookings/new, /bookings/:id, /packages, /calendar routes
o	Create shared StatusBadge, ConfirmDialog, RescheduleModal
•	Packages
o	Package list/grid + create/edit modal
o	Archive/activate flow


•	Create Booking
o	Stepper: client → package → datetime (with conflict API) → summary
o	Submit & success redirect
•	Bookings List
o	Table with filters/search
o	Row actions (view/edit/reschedule/cancel)
•	Booking Details
o	Cards (client, package, schedule, notes)
o	Status transitions
•	Calendar
o	Month/week view with colored blocks
o	Click to open, (optional) drag to reschedule
•	Hardening
o	Pagination + loading states
o	Accessibility & responsiveness
o	Tests for conflict and transitions
14) Hand offs & Dependencies
•	From Anchuga (consume): client info (search) and booking requests (if you choose to convert requests into bookings).
•	To Anchuga: package list for request dropdown (read only) & booking history endpoint for client view.
•	From Thiviyanath: (optional) staff availability/assignment feeds if resource level conflicts are added.
•	To Abisheka: booking totals per month/type (for finance charts) — expose a read API if requested.
•	To Abishek: booking status (Completed) can trigger photo delivery readiness (event hook later).

