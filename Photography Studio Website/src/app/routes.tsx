import { createBrowserRouter } from "react-router";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Cinematography from "./pages/Cinematography";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Packages from "./pages/Packages";
import PackageDetails from "./pages/PackageDetails";
import NotFound from "./pages/NotFound";
import ClientLogin from "./pages/client/ClientLogin";
import ClientRegister from "./pages/client/ClientRegister";
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientProfile from "./pages/client/ClientProfile";
import ClientBookingRequest from "./pages/client/ClientBookingRequest";
import ClientBookings from "./pages/client/ClientBookings";
import EventManagement from "./pages/events/EventManagement";
import EventDetails from "./pages/events/EventDetails";
import BookingsManagement from "./pages/bookings/BookingsManagement";
import BookingsList from "./pages/bookings/BookingsList";
import BookingDetails from "./pages/bookings/BookingDetails";
import CreateBooking from "./pages/bookings/CreateBooking";
import PackagesManagement from "./pages/bookings/PackagesManagement";
import CalendarView from "./pages/bookings/CalendarView";
import EmployeeDirectory from "./pages/public/EmployeeDirectory";
import EmployeeProfile from "./pages/public/EmployeeProfile";
import EventsGallery from "./pages/public/EventsGallery";
import PublicEventDetail from "./pages/public/PublicEventDetail";
import StaffSelfService from "./pages/staff/StaffSelfService";
import StaffLogin from "./pages/staff/StaffLogin";
import AdminClients from "./pages/admin/AdminClients";
import AdminEmployees from "./pages/admin/AdminEmployees";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEventManagement from "./pages/admin/AdminEventManagement";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminInvoiceDetail from "./pages/admin/AdminInvoiceDetail";
import AdminFinanceReports from "./pages/admin/AdminFinanceReports";
import AdminGalleryReports from "./pages/admin/AdminGalleryReports";
import GalleriesList from "./pages/gallery/GalleriesList";
import GalleryView from "./pages/gallery/GalleryView";
import GalleryUpload from "./pages/gallery/GalleryUpload";
import GalleryFeedback from "./pages/gallery/GalleryFeedback";
import TestPaymentsRoute from "./pages/TestPaymentsRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "test-payments", element: <TestPaymentsRoute /> },
      { path: "about", element: <About /> },
      { path: "cinematography", element: <Cinematography /> },
      { path: "blog", element: <Blog /> },
      { path: "contact", element: <Contact /> },
      { path: "packages", element: <Packages /> },
      { path: "packages/:packageId", element: <PackageDetails /> },
      { path: "not-found", element: <NotFound /> },
      
      // Client routes
      { path: "client/login", element: <ClientLogin /> },
      { path: "client/register", element: <ClientRegister /> },
      { path: "client/dashboard", element: <ClientDashboard /> },
      { path: "client/profile", element: <ClientProfile /> },
      { path: "client/book", element: <ClientBookingRequest /> },
      { path: "client/bookings", element: <ClientBookings /> },
      
      // Employee routes (public)
      { path: "employees", element: <EmployeeDirectory /> },
      { path: "employees/:employeeId", element: <EmployeeProfile /> },
      { path: "events/gallery", element: <EventsGallery /> },
      { path: "events/gallery/:eventId", element: <PublicEventDetail /> },
      
      // Staff routes
      { path: "staff/me", element: <StaffSelfService /> },
      { path: "staff/login", element: <StaffLogin /> },
      
      // Admin routes
      { path: "admin/employees", element: <AdminEmployees /> },
      { path: "admin/clients", element: <AdminClients /> },
      { path: "admin/login", element: <AdminLogin /> },
      { path: "admin/dashboard", element: <AdminDashboard /> },
      { path: "admin/events", element: <AdminEventManagement /> },
      { path: "admin/payments", element: <AdminPayments /> },
      { path: "admin/invoices/:invoiceId", element: <AdminInvoiceDetail /> },
      { path: "admin/reports/finance", element: <AdminFinanceReports /> },
      { path: "admin/reports/gallery", element: <AdminGalleryReports /> },
      
      // Admin Booking Management
      { path: "admin/bookings", element: <BookingsManagement /> },
      { path: "admin/bookings/list", element: <BookingsList /> },
      { path: "admin/bookings/new", element: <CreateBooking /> },
      { path: "admin/bookings/:id", element: <BookingDetails /> },
      { path: "admin/calendar", element: <CalendarView /> },
      { path: "admin/packages", element: <PackagesManagement /> },
      
      // Gallery routes
      { path: "gallery", element: <GalleriesList /> },
      { path: "gallery/:bookingId", element: <GalleryView /> },
      { path: "gallery/upload/:bookingId", element: <GalleryUpload /> },
      { path: "feedback/:bookingId", element: <GalleryFeedback /> },
      
      // Event Management
      { path: "events", element: <EventManagement /> },
      { path: "events/:eventId", element: <EventDetails /> },
      
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;