import { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Image } from "react-bootstrap";

function Profile() {
  const storedProfile =
    JSON.parse(localStorage.getItem("clientProfile")) || {
      name: "Client User",
      email: "client@example.com",
      phone: "",
      avatar: ""
    };

  const [profile, setProfile] = useState(storedProfile);
  const [preview, setPreview] = useState(profile.avatar);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);
      setProfile({ ...profile, avatar: reader.result });
    };

    if (file) reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("clientProfile", JSON.stringify(profile));
    alert("Profile updated successfully ✅");
  };

  return (
    <Container className="py-5" style={{ maxWidth: "1000px" }}>
      <Card className="p-4 shadow-sm">

        <Row>

          {/* Avatar Column */}
          <Col md={4} className="text-center">
            <Image
              src={
                preview ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              roundedCircle
              width={150}
              height={150}
              style={{ objectFit: "cover" }}
            />

            <Form.Group className="mt-3">
              <Form.Control type="file" onChange={handleImage} />
            </Form.Group>
          </Col>

          {/* Form Column */}
          <Col md={8}>
            <h4 className="mb-3">Profile Information</h4>

            <Form onSubmit={handleSave}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control value={profile.email} disabled />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                />
              </Form.Group>

              <Button type="submit" className="btn-primary-custom">
                Save Changes
              </Button>
            </Form>
          </Col>

        </Row>

      </Card>
    </Container>
  );
}

export default Profile;