import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("clientAuth");
    navigate("/client/login");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ marginBottom: "10px" }}>Client Dashboard</h1>
      <p style={{ marginBottom: "30px", color: "#555" }}>
        Welcome back! 🎉 Here is your account overview.
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px"
      }}>
        <div style={cardStyle}>
          <h3>Total Bookings</h3>
          <p style={numberStyle}>5</p>
        </div>

        <div style={cardStyle}>
          <h3>Pending Requests</h3>
          <p style={numberStyle}>2</p>
        </div>

        <div style={cardStyle}>
          <h3>Completed Shoots</h3>
          <p style={numberStyle}>3</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "40px",
          padding: "10px 20px",
          background: "#e74c3c",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const numberStyle = {
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "10px"
};

export default Dashboard;