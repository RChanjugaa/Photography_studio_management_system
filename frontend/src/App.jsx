import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/client/login" />} />
        <Route path="/client/login" element={<Login />} />
        <Route path="/client/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;