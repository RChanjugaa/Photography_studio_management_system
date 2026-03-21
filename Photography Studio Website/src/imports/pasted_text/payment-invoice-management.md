PAYMENT & INVOICE MANAGEMENT PAGE
Developer: P. Abisheka
Primary Routes:
•	/payments (list + quick record)
•	/invoices (list)
•	/invoices/:invoiceId (viewer)
•	/reports/finance (finance dashboard)
Theme: ShootProof style SaaS (clean, neutral, minimal) with your pastel accents (blue/mint).
Currency: LKR (Rs.)

Purpose
Enable the studio to record payments, generate and share invoices, track deposits and balances, and view financial reports—all in a clean, simple, and reliable interface.

Page Sections
1) Header / Toolbar
•	Title: Payments & Invoices
•	Global actions:
o	+ Add Payment (opens a slide in drawer)
o	Generate Invoice (new invoice flow)
•	Search & Filters: quick search by client / invoice # / booking ID; filter by status (Paid, Partial, Overdue, Draft), method, and date range.
UI: White bar, thin bottom border, primary button in soft blue; compact chips for filters.
________________________________________


2) Record Payment (Drawer)
Fields
•	Client (autocomplete)
•	Booking (autocomplete; required for revenue mapping)
•	Optional: Link existing invoice (auto select if open)
•	Amount (Rs.)
•	Method (Cash / Bank / Card / Online)
•	Date (defaults to today)
•	Notes (optional)
Behavior
•	Balance preview shows Total, Paid, Outstanding for the linked booking/invoice.
•	Validation: amount > 0; cannot exceed outstanding if invoice attached.
•	On Save → create payment, update outstanding & status (Unpaid/Partial/Paid/Overdue).
•	Toast notifications: success or error; “Add another” toggle for rapid entries.

3) Invoices List (Table)
Columns
•	Invoice #
•	Client
•	Booking ID
•	Issue Date → Due Date
•	Amount | Paid | Outstanding
•	Status (Draft / Unpaid / Partial / Paid / Overdue / Void)
•	Actions: View / Share / Download / Void

Table Interactions
•	Row click → Invoice Viewer
•	Bulk select → Share or Download (admin/staff)
•	Filters persist across navigation (store in URL query)
UI
•	Compact density; row hover tint; status shown as color badges; sticky header on scroll.

4) Invoice Viewer (Page or Modal)
Layout Blocks
1.	Header: Studio logo/name & contact; Invoice meta (number, issue, due, status badge)
2.	Bill To: Client name, phone, email
3.	Items Table: Package(s) & line items (name, qty, unit price, line total)
4.	Totals Panel: Subtotal, Discount (optional), Tax (optional), Total, Payments Received, Outstanding
5.	Notes & Terms: Refunds, reschedules, bank details (optional)
Actions
•	Download PDF
•	Share Link (public token URL with expiry)
•	Mark as Paid (if outstanding becomes 0)
•	Edit (only when Draft/Unpaid)
Print/PDF
•	A4 portrait; slim dividers; monochrome friendly; no heavy fills; totals right aligned.



5) Finance Reports (Dashboard)
Summary Cards
•	Total Revenue (period)
•	Received vs Outstanding
•	Overdue (count & value)
Charts
•	Monthly Revenue (line)
•	Payment Method Breakdown (pie)
•	Revenue by Package (bar)
Filters
•	Date range (quick: 7d / 30d / YTD)
•	Package type
•	(Optional) Photographer filter for performance insights

UI Components Required
•	PaymentFormDrawer (slide in, validated)
•	InvoicesTable (with filters, bulk actions)
•	InvoiceView (print/PDF ready)
•	StatusBadge (Draft/Unpaid/Partial/Paid/Overdue/Void)
•	FinanceSummaryCards
•	FinanceCharts (Line, Bar, Pie)
•	ShareLinkPopover (copy link, expiry date)
•	FilterChips & DateRangePicker
Place API helpers in src/utils/apiPayments.js and shared UI elements in src/components/common/.

Form & Validation Rules
•	Required: Client, Booking (for payments), at least one line item (for invoice).
•	Amount must be positive numeric; format to 2 decimals.
•	Due date must be ≥ Issue date.
•	Prevent overpayment when invoice is linked (display “Overpayment not allowed”).
•	Show inline messages & disable submit until valid.

Business Logic Rules
•	Auto status (on save / nightly cron):
o	Paid if outstanding = 0
o	Partial if 0 < paid < total
o	Overdue if today > due and outstanding > 0
o	Unpaid if paid = 0 and today ≤ due
•	Void invoice locks edits, keeps audit trail, excludes from revenue.
•	Payment posting updates invoice & booking aggregates atomically; roll back on failure.

Accessibility & Responsiveness
•	Keyboard navigable drawers/modals; focus management on open/close.
•	Labels tied to inputs; descriptive aria labels for status badges.
•	Mobile: stack layout; sticky action bar for “Add Payment” and “Generate Invoice”.





Testing Checklist (QA can reuse)
•	Happy paths: create invoice → add payment → status transitions to Paid.
•	Edge cases: overpayment blocked; void invoice excluded from reports; due < issue blocked.
•	Filters & search: by client, status, date range; results persist after reload.
•	PDF: totals correct; layout printable; footer contact visible.
•	Reports: charts reflect date range; revenue sums match invoices & payments.
________________________________________
Suggested API Endpoints (to confirm with backend)
•	Payments
o	POST /api/payments
o	GET /api/payments?clientId=&bookingId=&dateFrom=&dateTo=&method=
o	GET /api/payments/:id
o	PATCH /api/payments/:id
o	DELETE /api/payments/:id
•	Invoices
o	POST /api/invoices (create from booking)
o	GET /api/invoices?status=&clientId=&dateFrom=&dateTo=
o	GET /api/invoices/:id
o	PATCH /api/invoices/:id (items, dates, discount, tax)
o	POST /api/invoices/:id/share (token + expiry)
o	POST /api/invoices/:id/close (mark paid if outstanding = 0)
•	Reports
o	GET /api/reports/finance?dateFrom=&dateTo=


Proposed DB Tables (with key fields)
invoices
id, client_id, booking_id, issue_date, due_date, status, subtotal, discount, tax, total, paid_amount, outstanding_amount, share_token, share_expiry, created_at, updated_at
invoice_items
id, invoice_id, name, qty, unit_price, line_total
payments
id, client_id, booking_id, invoice_id (nullable), amount, method, date, note, created_by, created_at
(Indexes on client_id, booking_id, status, date.)

Styling & Theme Notes (match rest of app)
•	Colors:
o	Primary blue #4C8BF5
o	Mint accents #DBF5E6 for success cards
o	Light grey backgrounds #F3F4F6
o	Text #1F2937
•	Buttons: rounded 6–8px; hover = slightly darker.
•	Forms: 1px grey borders; blue focus ring.
•	Tables: zebra optional; hover tint; sticky header.
•	Charts: soft blue/mint/lavender palette; no heavy fills.






Copy (UI Text Snippets)
•	“Payment recorded successfully.”
•	“Invoice generated.”
•	“Outstanding updated.”
•	“Overpayment not allowed.”
•	“Invoice marked as Paid.”
•	“Public link copied to clipboard.”
•	“Void this invoice? This cannot be undone.”

