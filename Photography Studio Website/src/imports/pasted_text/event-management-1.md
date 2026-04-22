Developer: S. Vaheesh

Page Name: Event Management
This page now supports:
•	Event creation
•	Event editing
•	Event assignment
•	Event viewing
•	Past Event Photo Gallery (NEW)

🧭 PAGE PURPOSE
Provide a centralized page where:
✔ Admin/staff can manage event details
✔ Viewers (admin, staff, clients depending on permissions) can see photos of past events
✔ Events can be updated, cancelled, filtered
✔ Photographers can be assigned
✔ Event statistics can be viewed









📄 PAGE SECTIONS (UPDATED)
Below is the final structure for the Event Management Page.

 
1️⃣ Page Header
•	Title: Event Management
•	Primary button: + Add New Event
•	Search bar (search by: event type / client / date)
2️⃣ Event Categories (Pastel Cards)
Use pastel colored event cards:
Event Type	Card Color
Wedding	Pastel Pink
Birthday	Pastel Lavender
Corporate	Pastel Blue
Cultural Event	Pastel Peach
Other Events	Pastel Mint
Each card includes:
•	Event type icon
•	Short description
•	Number of events
These filter the events table below.




3️⃣ Events List Table
Columns:
•	Event ID
•	Event Name
•	Event Type
•	Date
•	Linked Booking ID
•	Assigned Photographer
•	Status (Upcoming / Completed / Cancelled)
•	Actions (View / Edit / Delete)
Use ShootProof-style clean table:
•	Thin borders
•	Pastel hover
•	Clean typography
________________________________________
4️⃣ Event Details Drawer/Page
When user clicks View:
Show:
•	Event Name
•	Event Type
•	Event Date
•	Address / Location
•	Assigned Photographer
•	Notes
•	Booking Link
Buttons:
•	Edit Event
•	Update Status
•	Assign Photographer
 5️⃣ PAST EVENT PHOTO GALLERY (NEW FEATURE)
This is the important part you requested.
This section appears when viewing Completed Events.
📸 Gallery Requirements
•	Display past event photos
•	Use Instagram-size grid
•	Maintain square 1080 × 1080 resolution
•	Display in a 3-column grid (desktop)
•	2 column grid (tablet)
•	1 column grid (mobile)
Why square grid?
✔ Client said they want to maintain Instagram-ready photos
✔ Easier for staff to reuse
✔ Uniform gallery look
✔ ShootProof galleries often use squared/clean grid layouts
📌 Gallery Layout
✔ Grid layout (ShootProof style)
•	Soft grey background #F3F4F6
•	Square tiles with: 
o	Rounded corners (8px)
o	Subtle shadow
o	Hover zoom (scale 1.02)
o	Light pastel overlay on hover
✔ Photo handling
•	Upload photos → Force crop to 1080×1080
•	Store original + cropped versions (optional)
•	Lazy-load for smooth performance
✔ Gallery Controls
•	Sort by: Date / Photographer / Sub-event
•	Download All (admin only)
•	Download Selected
•	“Add More Photos” button
________________________________________




🎛️ NEW COMPONENT: EventGalleryGrid
You will need:
<EventGalleryGrid>
  - Accepts eventID
  - Displays 1080x1080 grid
  - Supports hover effects
  - Supports multi-select
</EventGalleryGrid>
________________________________________
6️⃣ Add Photos to Event (Admin Only)
•	Upload button
•	Multiple file upload
•	Crop tool (square)
•	Progress bar
•	Success toast message
Drag-and-drop upload supported.
________________________________________




7️⃣ Event Status Controls (Admin Only)
Options:
•	Scheduled
•	Ongoing
•	Completed
•	Cancelled
When status becomes Completed, gallery is shown.
________________________________________
8️⃣ Photographer Assignment
(Admin Only)
•	Dropdown
•	Availability check
•	Assign button
________________________________________
9️⃣ Performance Insights Section (Optional)
•	Number of photos uploaded
•	Feedback score (if linked to photo module)
•	Duration / Timeline
This connects events with customer satisfaction.
 





🧩 PAGE CONTENT SUMMARY (FINAL)
Section	Description
Header	Title + Add Event button
Categories	Pastel cards for event types
Events Table	Full event list with filters
Event Details	All event metadata
Past Event Photo Gallery	Square Instagram-style gallery
Add Photos	Upload + cropping
Assign Photographer	Dropdown + availability
Event Status	Status change controls
________________________________________
🎯 Developer Instructions for Vaheesh
To implement this page successfully:
MUST BUILD:
•	EventGalleryGrid
•	EventUploadCropper
•	EventCard
•	EventTable
•	EventDetailsDrawer





MUST FOLLOW:
•	Use pastel accents
•	Ensure uniform whitespace
•	Use same button style as other modules
•	Use React reusable components
MUST COMMUNICATE:
•	Required API routes with backend
•	Required DB fields for gallery system

