import { useState } from "react";

function BookingRequest() {
  const [formData, setFormData] = useState({
    eventType: "",
    eventDate: "",
    location: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // For now just store locally
    const existingRequests =
      JSON.parse(localStorage.getItem("bookingRequests")) || [];

    localStorage.setItem(
      "bookingRequests",
      JSON.stringify([...existingRequests, formData])
    );

    alert("Booking request submitted successfully 🎉");

    setFormData({
      eventType: "",
      eventDate: "",
      location: "",
      message: ""
    });
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>New Booking Request</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "500px",
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}
      >
        <input
          type="text"
          name="eventType"
          placeholder="Event Type (Wedding, Birthday, etc.)"
          value={formData.eventType}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="eventDate"
          value={formData.eventDate}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Event Location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <textarea
          name="message"
          placeholder="Additional Details"
          value={formData.message}
          onChange={handleChange}
          rows="4"
        />

        <button
          type="submit"
          style={{
            padding: "10px",
            background: "#2c3e50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}

export default BookingRequest;