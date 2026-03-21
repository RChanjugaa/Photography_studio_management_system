<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/client/Login";
import Register from "./pages/client/Register";
import Dashboard from "./pages/client/Dashboard";
import Profile from "./pages/client/Profile";
import BookingRequest from "./pages/client/BookingRequest";
import BookingHistory from "./pages/client/BookingHistory";
import ClientLayout from "./layouts/ClientLayout";
=======
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
>>>>>>> e5787eaa3712cbd3db98aba4651d0d9d80ff319d

function App() {
  const isAuthenticated = localStorage.getItem("clientAuth");

  return (
    <>
      <div style={{background:'#ff0',padding:'10px',textAlign:'center'}}>APP ROOT</div>
      <div id="hello" style={{padding:'20px'}}>HELLO WORLD - STATIC</div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;