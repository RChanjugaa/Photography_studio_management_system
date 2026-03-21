import { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

function BookingRequest() {

  const [formData, setFormData] = useState({
    serviceType: "",
    preferredDate: "",
    preferredTime: "",
    notes: ""
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.serviceType || !formData.preferredDate || !formData.preferredTime) {
      alert("Please fill all required fields");
      return;
    }

    console.log("Booking Request:", formData);

    // Later this will go to backend API
    setSuccess(true);

    // Reset form
    setFormData({
      serviceType: "",
      preferredDate: "",
      preferredTime: "",
      notes: ""
    });
  };

  return (
    <Container className="mt-4" style={{ maxWidth: "700px" }}>
      <Card className="shadow-sm">
        <Card.Body>

          <h3 className="mb-4">Request a Booking</h3>

          {success && (
            <Alert variant="success">
              Booking request submitted successfully!
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>

            {/* Service Type */}
            <Form.Group className="mb-3">
              <Form.Label>Service Type</Form.Label>
              <Form.Select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                required
              >
                <option value="">Select Service</option>
                <option value="Wedding">Wedding</option>
                <option value="Event">Event</option>
                <option value="Studio">Studio</option>
                <option value="Outdoor">Outdoor</option>
              </Form.Select>
            </Form.Group>

            {/* Preferred Date */}
            <Form.Group className="mb-3">
              <Form.Label>Preferred Date</Form.Label>
              <Form.Control
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Preferred Time Window */}
            <Form.Group className="mb-3">
              <Form.Label>Preferred Time Window</Form.Label>
              <Form.Select
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                required
              >
                <option value="">Select Time</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </Form.Select>
            </Form.Group>

            {/* Notes */}
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                placeholder="Any additional details (optional)"
                value={formData.notes}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Submit */}
            <Button variant="primary" type="submit">
              Submit Request
            </Button>

          </Form>

        </Card.Body>
      </Card>
    </Container>
  );
}

export default BookingRequest;