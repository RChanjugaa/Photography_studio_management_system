import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/client/Login";
import Register from "./pages/client/Register";
import Dashboard from "./pages/client/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/client/login" element={<Login />} />
        <Route path="/client/register" element={<Register />} />
        <Route path="/client/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;