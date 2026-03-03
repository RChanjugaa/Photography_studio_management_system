import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function ClientLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem("clientAuth");
    if (!isAuth) {
      navigate("/client/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("clientAuth");
    navigate("/client/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div
        style={{
          width: "250px",
          background: "#1f2d3d",
          color: "white",
          padding: "20px",
        }}
      >
        <h3>Client Panel</h3>

        <nav style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <Link to="/client/dashboard" style={{ color: "white", textDecoration: "none" }}>
            Dashboard
          </Link>
        <Link to="/client/profile" style={{ color: "white", textDecoration: "none" }}>
            Profile
           </Link> 
           <Link to="/client/booking-request">Booking Request</Link>
          <button
            onClick={handleLogout}
            style={{
              marginTop: "30px",
              padding: "8px",
              border: "none",
              background: "#e74c3c",
              color: "white",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </nav>
      </div>

      <div style={{ flex: 1, padding: "40px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default ClientLayout;