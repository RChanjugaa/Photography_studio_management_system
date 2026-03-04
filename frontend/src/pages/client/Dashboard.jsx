import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0
  });

  useEffect(() => {
    const requests =
      JSON.parse(localStorage.getItem("bookingRequests")) || [];

    setStats({
      total: requests.length,
      pending: requests.filter(r => r.status === "RequestPending").length
    });
  }, []);

  return (
    <Container className="py-5" style={{ maxWidth: "1200px" }}>
      
      {/* Welcome Section */}
      <div className="mb-5">
        <h1 className="fw-bold">Welcome Back 👋</h1>
        <p className="text-muted">
          Manage your bookings and profile from here.
        </p>
      </div>

      {/* Stats Section */}
      <Row className="g-4 mb-5">
        <Col md={6}>
          <Card className="card-custom p-4">
            <h6 className="text-muted">Total Booking Requests</h6>
            <h2 className="fw-bold">{stats.total}</h2>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="card-custom p-4">
            <h6 className="text-muted">Pending Requests</h6>
            <h2 className="fw-bold text-primary">
              {stats.pending}
            </h2>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="g-4">
        <Col md={4}>
          <Card className="card-custom p-4 h-100">
            <h5>Profile</h5>
            <p className="text-muted">
              Update your personal details and avatar.
            </p>
            <Button
              className="btn-primary-custom"
              onClick={() => navigate("/client/profile")}
            >
              Go to Profile
            </Button>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="card-custom p-4 h-100">
            <h5>Request a Booking</h5>
            <p className="text-muted">
              Submit a new booking request for approval.
            </p>
            <Button
              className="btn-primary-custom"
              onClick={() => navigate("/client/book")}
            >
              New Request
            </Button>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="card-custom p-4 h-100">
            <h5>Booking History</h5>
            <p className="text-muted">
              View all your previous booking requests.
            </p>
            <Button
              className="btn-primary-custom"
              onClick={() => navigate("/client/bookings")}
            >
              View History
            </Button>
          </Card>
        </Col>
      </Row>

    </Container>
  );
}

export default Dashboard;