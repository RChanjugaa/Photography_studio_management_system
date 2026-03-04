import { useEffect, useState } from "react";
import { Table, Badge, Container, Card } from "react-bootstrap";

function BookingHistory() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("bookingRequests")) || [];
    setRequests(stored);
  }, []);

  return (
    <Container className="py-5">
      <Card className="card-custom p-4">
        <h2 className="mb-4">Booking History</h2>

        <Table bordered hover>
          <thead>
            <tr>
              <th>Service</th>
              <th>Preferred Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, i) => (
              <tr key={i}>
                <td>{req.serviceType}</td>
                <td>{req.preferredDate}</td>
                <td>
                  <Badge bg="primary">
                    {req.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
}

export default BookingHistory;