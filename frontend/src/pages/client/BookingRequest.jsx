import { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";

function BookingRequest() {
  const [formData, setFormData] = useState({
    serviceType: "",
    preferredDate: "",
    preferredTimeWindow: "",
    notes: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existing =
      JSON.parse(localStorage.getItem("bookingRequests")) || [];

    const newRequest = {
      ...formData,
      status: "RequestPending",
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(
      "bookingRequests",
      JSON.stringify([...existing, newRequest])
    );

    alert("Request submitted successfully 🎉");
  };

  return (
    <Container className="py-5" style={{ maxWidth: "800px" }}>
      <Card className="card-custom p-4">
        <h2 className="mb-4">Request a Booking</h2>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Service Type</Form.Label>
            <Form.Select
              name="serviceType"
              onChange={handleChange}
              required
            >
              <option value="">Select Service</option>
              <option>Wedding</option>
              <option>Event</option>
              <option>Studio</option>
              <option>Outdoor</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Preferred Date</Form.Label>
            <Form.Control
              type="date"
              name="preferredDate"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Preferred Time Window</Form.Label>
            <Form.Control
              type="text"
              name="preferredTimeWindow"
              placeholder="Morning / Evening"
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="notes"
              onChange={handleChange}
            />
          </Form.Group>

          <Button type="submit" className="btn-primary-custom w-100">
            Submit Request
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default BookingRequest;