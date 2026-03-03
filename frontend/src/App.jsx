import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/client/Login";
import Register from "./pages/client/Register";
import Dashboard from "./pages/client/Dashboard";
import Profile from "./pages/client/Profile";
import BookingRequest from "./pages/client/BookingRequest";
import ClientLayout from "./layouts/ClientLayout";

function App() {
  const isAuthenticated = localStorage.getItem("clientAuth");

  return (
    <Router>
      <Routes>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/client/login" />} />

        {/* Public Routes */}
        <Route path="/client/login" element={<Login />} />
        <Route path="/client/register" element={<Register />} />

        {/* Protected Routes */}
        {isAuthenticated && (
          <Route path="/client" element={<ClientLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="booking-request" element={<BookingRequest />} />
          </Route>
        )}

        {/* If user tries to access protected page without login */}
        {!isAuthenticated && (
          <Route path="/client/*" element={<Navigate to="/client/login" />} />
        )}

      </Routes>
    </Router>
  );
}

export default App;