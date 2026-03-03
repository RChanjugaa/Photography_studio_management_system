function Profile() {
  return (
    <div>
      <h2>My Profile</h2>
      <p>This is your profile information.</p>

      <div style={{ marginTop: "20px" }}>
        <label>Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          style={{ display: "block", marginTop: "5px", padding: "8px", width: "300px" }}
        />
      </div>

      <div style={{ marginTop: "15px" }}>
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          style={{ display: "block", marginTop: "5px", padding: "8px", width: "300px" }}
        />
      </div>

      <button
        style={{
          marginTop: "20px",
          padding: "8px 15px",
          background: "#4a90e2",
          color: "white",
          border: "none",
          borderRadius: "6px",
        }}
      >
        Update Profile
      </button>
    </div>
  );
}

export default Profile;