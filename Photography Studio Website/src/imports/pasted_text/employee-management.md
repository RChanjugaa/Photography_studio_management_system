EMPLOYEE MANAGEMENT PAGE

Developer: M. Thiviyanath
Primary Routes:
•	/employees (public directory + profiles)
•	/employees/:employeeId (public profile + work)
•	/staff/me (staff self service: profile, work, salary)
•	/admin/employees (owner controls: CRUD, salaries, tasks, visibility)
Theme: ShootProof style SaaS (clean, neutral, minimal) with pastel accents (blue/mint/lavender).
Access Matrix:
•	Public/Customer: read only directory + employee public profiles
•	Staff: edit own profile & work; view own salary details
•	Owner/Admin: full access to all CRUD + salary + task assignment + visibility settings

Purpose
Provide a single, consistent module where:
•	Customers can discover the studio team and see their work;
•	Staff can keep their own information and portfolio up to date and privately view salary info;
•	Owner can maintain the employee database (CRUD), set who is publicly visible, manage salaries, and assign tasks (bookings/events/other ops).






Page Sections
1) Public Employee Directory — /employees
What customers see (no login needed).
Toolbar
•	Search: name/role/specialty (e.g., weddings, retouching)
•	Filters: Role (Photographer/Editor/Assistant), Location (optional), Sort (Most experienced / Most reviewed)
Employee Cards (public data only)
•	Avatar/cover image
•	Name & Role
•	Short bio (2–3 lines)
•	Tags (weddings, studio, events, editing…)
•	CTA: View Profile
UI rules
•	Clean white cards, rounded corners, subtle shadows, large spacing, pastel role tags.










2) Public Employee Profile — /employees/:employeeId
Goal: Let customers see the person’s work & story (no private info).
Sections
•	Header: Name, Role, years of experience, average rating (if enabled)
•	About/Bio: 3–5 short paragraphs
•	Portfolio: grid of curated images/videos (square 1080×1080 recommended for consistency)
•	Specialties & Certifications: badges
•	Work Highlights: selected weddings/events shot (link to galleries if allowed)
•	Contact/Booking handoff: “Request this photographer for my event” → opens general booking flow (not direct contact details)
Visibility controls (admin side): owner can mark a staff profile “Publicly visible” ON/OFF; only visible staff appear here.

3) Staff Self Service — /staff/me
(Signed in Staff only; private)
Tabs:
1.	My Profile
o	Edit: avatar, cover, bio, phone (masked on public), specialties, social (optional)
o	Read only: role, join date (set by admin)
2.	My Work / Portfolio
o	Add portfolio items: title, description, media (enforce 1080×1080 if you want uniform display), visibility: Public/Private
o	Reorder / delete items


3.	My Assignments
o	Upcoming bookings/events assigned to me, with dates, status
o	Quick action: mark progress / add note (if enabled)
4.	My Salary (Private)
o	Salary breakdown (base, allowances, deductions)
o	Pay periods & slips (PDF links)
o	Policy text (upload by admin)
o	IMPORTANT: Only visible to the logged in staff member and admin
UI rules
•	Clear privacy labels (“Only you can see this”).
•	No salary fields in any public endpoint or public page.

4) Owner/Admin Console — /admin/employees
(Owner/Admin only)
Sub sections:
A) Directory Management
•	Toolbar: + Add Employee, search, filters (role/status/visibility)
•	Table/Grid columns: Name, Role, Visibility (Public/Hidden), Status (Active/Inactive), Last login, Actions
•	Row Actions: View / Edit / Deactivate / Make Public / Make Hidden
B) Employee CRUD (Drawer or Page)
•	Identity: first/last name, email (unique), phone
•	Job: role, team, join date, manager
•	Public Profile: bio, specialties, cover image, “Publicly visible” toggle
•	Status: Active/Inactive
•	Save/Cancel
C) Salary Management (per employee)
•	Compensation: base, allowances, deductions, pay cycle
•	History: previous changes with timestamps
•	Payslips: upload/generate links (PDF)
•	Visibility: always private (staff self + admin), never public
D) Task Assignment
•	Assign staff to bookings/events/ops tasks
•	Date/time, notes, priority
•	Conflict check with existing assignments (reuse your availability logic)
•	Notify staff (email/in app)
E) Visibility Controls
•	Toggle “Publicly visible” → includes/excludes from /employees and /employees/:id
F) Bulk operations
•	Import CSV (optional later)
•	Bulk set visibility/role/status

UI Components Required
•	EmployeePublicCard (directory)
•	EmployeePublicProfile (sections: header, about, portfolio, highlights)
•	PortfolioGrid (enforce 1080×1080 option; lazy load)
•	EmployeeSearchBar + FilterChips
•	EmployeeFormDrawer (admin CRUD)
•	SalaryPanel (admin; staff private view for own salary)
•	TaskAssignModal (owner assigns tasks)
•	AssignmentsList (staff & admin views)
•	VisibilityToggle (public/hidden)
•	StatusBadge & RoleBadge
Shared helpers in src/components/common/; API helpers in src/utils/apiEmployees.js.
________________________________________
CRUD Scope (Explicit)
•	Create (Admin): employee, salary record, task
•	Read (Public): only public fields (directory + profile + public portfolio)
•	Read (Staff): self profile, self assignments, self salary
•	Update (Staff): own profile, own public/private portfolio items
•	Update (Admin): any employee profile, visibility, status, salary, tasks
•	Delete (Admin): portfolio items (if needed), tasks; prefer soft delete for employees

Form & Validation Rules
•	Email unique; phone numeric; role required
•	Staff cannot set their own visibility=Public; only Admin can toggle
•	Salary numbers must be non negative; changes logged with who/when
•	Portfolio upload: accept JPG/PNG/WebP; max size (e.g., 5–10 MB), enforce 1080×1080 if uniform look is desired
•	Public bio length (e.g., max 800 chars); profanity filter optional

Permissions / Access Control
•	Public: GET /employees (public subset), GET /employees/:id (public subset, only visible profiles)
•	Staff: GET/PATCH /staff/me, GET /staff/me/salary, CRUD /staff/me/portfolio
•	Admin: Full CRUD on /admin/employees, salaries, tasks, visibility
•	Guard: Salary and private fields never returned by public endpoints; use role based serializers

Suggested API Endpoints (to confirm with backend)
Public
•	GET /api/public/employees?q=&role=&sort= → list of visible employees
•	GET /api/public/employees/:id → public profile + public portfolio
Staff (self service)
•	GET /api/staff/me
•	PATCH /api/staff/me (own profile fields only)
•	GET /api/staff/me/portfolio | POST /api/staff/me/portfolio | PATCH /api/staff/me/portfolio/:itemId | DELETE ...
•	GET /api/staff/me/assignments
•	GET /api/staff/me/salary (private; staff only)
Admin/Owner
•	GET /api/admin/employees?role=&status=&visibility=
•	POST /api/admin/employees
•	GET /api/admin/employees/:id
•	PATCH /api/admin/employees/:id (profile, role, status, visibility)
•	DELETE /api/admin/employees/:id (soft delete)
•	Salary:
o	GET /api/admin/employees/:id/salary
o	POST /api/admin/employees/:id/salary (create/update period)
o	GET /api/admin/employees/:id/payslips | POST /api/admin/employees/:id/payslips
•	Tasks/Assignments:
o	POST /api/admin/tasks (targetType: booking|event|ops, assigneeId, start, end, priority, note)
o	GET /api/admin/tasks?assigneeId=&from=&to=
o	PATCH /api/admin/tasks/:id | DELETE /api/admin/tasks/:id

Proposed DB Tables (key fields)
employees
id, first_name, last_name, email (unique), phone, role, bio, specialties (JSON/array), cover_url, avatar_url, visible_public (bool), status (active/inactive), join_date, last_login_at, created_at, updated_at
employee_portfolio_items
id, employee_id (FK), title, description, media_url, visibility ('public'|'private'), created_at, updated_at
employee_salaries
id, employee_id (FK), base_amount, allowances, deductions, cycle ('monthly' etc.), effective_from, effective_to (nullable), created_by, created_at
employee_payslips
id, employee_id (FK), period_from, period_to, pdf_url, created_at
tasks (assignments)
id, assignee_id (employee_id), target_type ('booking'|'event'|'ops'), target_id, start_at, end_at, priority, status, note, created_by, created_at
Indexes on employees.visible_public, employees.role, tasks.assignee_id, employee_salaries.employee_id.

Security & Privacy
•	Salary endpoints protected by role checks; responses must never leak to public.
•	Use field level serialization: public endpoints omit email/phone unless you explicitly decide to show masked phone.
•	Audit logs on salary changes & visibility toggles (actor, time, old→new).
•	Rate limit public listing endpoints to prevent scraping; consider watermarking public portfolio images.

Accessibility & Responsiveness
•	Public directory & profiles keyboard navigable; alt text for images; readable contrast
•	Staff/Admin drawers have focus traps; clear aria labels
•	Mobile: directory becomes 1 column; profile sections stack; admin tables scroll horizontally with sticky headers

Testing Checklist
Public
•	Directory shows only visible_public = true employees
•	Profile hides private fields; portfolio shows only public items
Staff
•	Can edit own profile; cannot flip public visibility; can CRUD own portfolio; can view own salary only
Admin
•	Can CRUD any employee; toggle visibility; assign tasks; manage salaries & payslips
Security
•	Public endpoints never return salary/private fields
•	Salary endpoints reject non admin/non owner; staff can only access /me/salary
Regression
•	Toggling visibility immediately reflects in /employees
•	Deactivating employee blocks login but keeps public profile off the directory








Styling & Theme Notes (match rest of app)
•	Colors:
o	Primary blue #4C8BF5
o	Light grey #F3F4F6
o	Borders #D1D5DB
o	Text #1F2937
o	Pastel chips for specialties/roles (mint/lavender/peach)
•	Cards: white, rounded 10–12px, soft shadow
•	Buttons: rounded 6–8px; hover slightly darker; disabled states clear
•	Images: 1080×1080 for portfolio grid (uniform, IG ready), lazy load
________________________________________
Delivery Plan (suggested)
•	Day 1–2: Public directory + public profile pages (read only)
•	Day 3: Staff self service /staff/me (profile + portfolio)
•	Day 4: Salary panel (self view) + admin salary CRUD
•	Day 5: Admin CRUD + visibility toggles + bulk actions
•	Day 6: Task assignment modal + staff assignments list
•	Day 7: QA pass, access guards, empty/error states, screenshots & docs
________________________________________
Copy (UI Text Snippets)
•	“Profile updated successfully.”
•	“Portfolio item added.”
•	“This profile is publicly visible.” / “This profile is hidden from the public directory.”
•	“Salary details are private to you and the owner.”
•	“Task assigned.”
•	“You don’t have permission to perform this action.”


