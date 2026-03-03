import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

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