import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Temporary authentication logic
    if (email && password) {
      localStorage.setItem("clientAuth", "true");
      navigate("/client/dashboard");
    } else {
      alert("Please enter email and password");
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2>Client Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label><br />
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>Password</label><br />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" style={{ marginTop: "15px" }}>
          Login
        </button>
      </form>

      <p style={{ marginTop: "15px" }}>
        Don’t have an account?{" "}
        <Link to="/client/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;