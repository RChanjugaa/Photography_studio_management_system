import { Routes, Route } from "react-router-dom";
import BookingList from "./BookingsPackages/Bookings/Pages/BookingList";

function App() {
  return (
    <>
      <div style={{background:'#ff0',padding:'10px',textAlign:'center'}}>APP ROOT</div>
      <div id="hello" style={{padding:'20px'}}>HELLO WORLD - STATIC</div>
      <Routes>
        <Route path="/" element={<BookingList />} />
        <Route path="/bookings" element={<BookingList />} />
        <Route path="*" element={<BookingList />} />
      </Routes>
    </>
  );
}

export default App;