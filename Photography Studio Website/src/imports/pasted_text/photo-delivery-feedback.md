PHOTO DELIVERY & FEEDBACK PAGE
Developer: R. Abishek
Primary Routes:
•	/gallery (client galleries list)
•	/gallery/:bookingId (single gallery view)
•	/gallery/upload/:bookingId (staff upload & crop)
•	/feedback/:bookingId (client feedback & ratings)
Theme: ShootProof style SaaS (clean, neutral, minimal) with pastel accents.
Access:
•	Client (signed in): View & download own gallery, give feedback/ratings
•	Staff (signed in): Upload/crop/manage gallery for assigned bookings/events
•	Owner/Admin: Full control (approve/publish galleries, delete, re invite, export)

Purpose
Provide a streamlined way to deliver photos to clients, in a uniform Instagram friendly format, collect ratings & feedback, and track satisfaction metrics—without compromising performance, security, or brand consistency.
________________________________________
Page Sections
1) Galleries List — /gallery
Client View
•	Shows only the client’s own galleries (by booking/event)
•	Card layout: cover image, event name, date, number of photos, View Gallery CTA
Staff/Admin View
•	Filterable list of all galleries with status (Draft/Published/Archived), search by client/booking/date
•	Bulk actions: Publish, Archive, Send Invite, Delete (admin only)
UI rules
•	White cards, rounded corners, soft shadow, pastel status badges (Draft = grey, Published = blue, Archived = lavender)
________________________________________
2) Single Gallery — /gallery/:bookingId
Header
•	Booking/Event title, date, location (optional)
•	Status (Draft/Published)
•	Actions (role based):
o	Client: Download All, Select & Download, Leave Feedback
o	Staff/Admin: Upload, Replace Cover, Publish/Unpublish, Share Link
Grid
•	Square tiles (Instagram style 1080×1080)
•	3 column desktop, 2 column tablet, 1 column mobile
•	Hover: light zoom (scale 1.02) + pastel overlay
Sidebar (optional on desktop)
•	Gallery info (count, size, expiry if link based)
•	“How to download” guide for clients
•	Contact/support link







3) Upload & Crop — /gallery/upload/:bookingId (Staff/Admin)
Flow
1.	Select Files (multi select; JPG/PNG/WebP; max size per file e.g., 10–20 MB)
2.	Crop (mandatory)
o	Enforce Instagram presets:
	Square: 1080 × 1080 (recommended)
	Portrait: 1080 × 1350
	Landscape: 1080 × 566
o	Default to Square; show live preview
3.	Optimize (client side compression to WebP where possible)
4.	Upload (progress bars, resumable if possible)
5.	Publish (optional immediate publish toggle)
Controls
•	Drag and drop area
•	“Apply crop to all” quick action
•	Per image crop override
UI rules
•	Minimal chrome, big previews, success toasts, clear error messages

4) Feedback & Ratings — /feedback/:bookingId
Client Form
•	5 star rating
•	Short review (max ~500 chars)
•	Optional tags (e.g., “on time”, “creative”, “friendly”)
•	Consent checkbox for public testimonial use (admin can feature it)

Display
•	Average rating on gallery header after submission
•	Admin/Staff view includes full list with moderation (approve/hide testimonials)
UI rules
•	Simple, friendly copy; validate empty rating; show receipt message (“Thanks for your feedback!”)

5) Notifications & Sharing
•	Send Invite (email/SMS) with secure token link and optional expiry
•	Remind to Review (after X days of publish)
•	Share Link (copy to clipboard, set expiry/password optional)
Admin controls
•	Regenerate link/token, revoke access, set download quota (optional)

6) Reports & Insights (Owner/Admin)
•	Gallery Delivery Rate (delivered vs pending)
•	Average Rating (period filter)
•	Feedback Keywords (top tags)
•	Downloads Count (per gallery, per image)







UI Components Required
•	GalleryCard (list view)
•	GalleryHeader (title, status, actions)
•	GalleryGrid (square tiles, lazy load, select mode)
•	UploadDropzone (drag and drop + validation)
•	InstagramCropper (presets 1080 sq/portrait/landscape with preview)
•	PublishToggle (draft/published)
•	DownloadBar (download all/selected)
•	FeedbackForm (rating + review + tags)
•	FeedbackList (admin moderation)
•	ShareLinkPopover (token, expiry, copy)
•	DeliveryInsights (small charts/cards)
Shared UI → src/components/common/
API helpers → src/utils/apiGallery.js

Form & Validation Rules
•	Upload: image type check; max size per file; max total count (configurable)
•	Crop: must pick one of the IG presets; default Square 1080×1080
•	Feedback: rating required; review optional; profanity filter optional
•	Download selected: at least one item picked; zip server side if large






Business Logic Rules
•	Publish workflow:
o	Draft (staff can view & edit) → Published (client can access) → Archived (hidden from client, kept for history)
•	Public testimonials: only if client consented (checkbox) and admin approved
•	Download limits: optional per gallery; track counts
•	Storage policy: originals optional; always store an IG sized delivery copy; generate thumbnails

Suggested API Endpoints (to confirm with backend)
Galleries
•	GET /api/galleries?clientId=&status=&dateFrom=&dateTo=
•	GET /api/galleries/:bookingId (role aware response)
•	PATCH /api/galleries/:bookingId (title/cover/status publish/unpublish)
Photos
•	POST /api/galleries/:bookingId/photos (multi upload; returns ids/urls)
•	GET /api/galleries/:bookingId/photos?size=thumb|delivery
•	DELETE /api/galleries/:bookingId/photos/:photoId
•	(Optional) POST /api/galleries/:bookingId/photos/reorder
Feedback
•	POST /api/feedback/:bookingId { rating, review, tags, consentPublic }
•	GET /api/feedback/:bookingId (admin/staff)
•	PATCH /api/feedback/:feedbackId (approve/hide) (admin)
Sharing
•	POST /api/galleries/:bookingId/share { expiry, password? }
•	GET /public/galleries/:token (client view without login, if enabled)
•	POST /api/galleries/:bookingId/remind (email/SMS)
Downloads
•	POST /api/galleries/:bookingId/download-all (creates zip; returns link)
•	POST /api/galleries/:bookingId/download-selected { photoIds: [] }
Reports
•	GET /api/reports/galleries?from=&to= → { delivered, pending, avgRating, topTags, downloadsByGallery }

Proposed DB Tables (key fields)
galleries
id, booking_id, title, status ('draft'|'published'|'archived'), cover_url, invite_token, invite_expiry, created_by, created_at, updated_at
gallery_photos
id, gallery_id (FK), file_url (delivery size), thumb_url, original_url (optional), position, uploaded_by, created_at
gallery_feedback
id, gallery_id (FK), client_id, rating (1–5), review, tags (JSON), consent_public (bool), status ('pending'|'approved'|'hidden'), created_at, updated_at
gallery_downloads (optional analytics)
id, gallery_id, client_id (nullable), count, last_download_at
Indexes on galleries.booking_id, galleries.status, gallery_photos.gallery_id, gallery_feedback.gallery_id.

Security & Privacy
•	A client can access only their own gallery (auth or token).
•	Token links: time bound; revokable; optional password.
•	Feedback moderation before public display.
•	Strip EXIF GPS from delivered photos (privacy).
•	Rate limit downloads to prevent abuse.

Performance
•	Client side compression to WebP where possible
•	Server side image processing into delivery (1080) and thumb sizes
•	Lazy load & infinite scroll for gallery
•	Optional CDN for images
•	Background zip creation for “Download All”

Accessibility & Responsiveness
•	Keyboard navigable grid; focus outlines on tiles & actions
•	Alt text for images (e.g., “Wedding photo, couple portrait”)
•	Mobile: 1 column grid; floating download/feedback bar

Testing Checklist (QA can reuse)
Upload & Crop
•	Accepts only valid types/sizes; crop presets enforced; progress shown; failures handled
Publish & Sharing
•	Draft not visible to client; Published visible; token link works until expiry; revoke works
Downloads
•	Download all produces valid zip; selected download respects selections and large sets
Feedback
•	Rating required; review optional; average rating updates; admin moderation hides/shows as expected


Permissions
•	Client sees only their gallery; staff/admin can manage; token viewers limited to view/download only
Performance
•	Lazy load smooth; thumbnails sharp; no layout shift on slow networks
________________________________________
Styling & Theme Notes (match rest of app)
•	Colors:
o	Primary blue #4C8BF5
o	Light grey #F3F4F6
o	Borders #D1D5DB
o	Text #1F2937
o	Pastel overlays for hover (mint/lavender/peach at ~10% opacity)
•	Tiles: square, rounded 8px, subtle shadow
•	Buttons: rounded 6–8px; blue primary; hover slightly darker
•	Modals/Drawers: generous spacing; clear headings; success/error toasts
________________________________________
Delivery Plan (suggested)
•	Day 1–2: Galleries List + Single Gallery skeleton (client & staff views)
•	Day 3: Upload & InstagramCropper (presets + batch apply)
•	Day 4: Publish/Unpublish + Share Link + Download All/Selected
•	Day 5: FeedbackForm + FeedbackList (admin moderation)
•	Day 6: Reports/Insights cards
•	Day 7: QA pass, access guards, empty/error states, docs + screenshots


Copy (UI Text Snippets)
•	“Upload complete — X photos added.”
•	“Please crop to one of the Instagram sizes (1080).”
•	“Gallery published.” / “Unpublished (draft).”
•	“Invite link copied to clipboard.”
•	“Download is preparing — we’ll start automatically.”
•	“Thanks for your feedback!”
•	“This testimonial is pending review.”

