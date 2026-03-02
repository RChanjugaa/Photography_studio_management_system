import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
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
    <div style={{ padding: "50px" }}>
      <h1>Client Dashboard</h1>
      <p>You are successfully logged in 🎉</p>

      <button
        onClick={handleLogout}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4a90e2",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;