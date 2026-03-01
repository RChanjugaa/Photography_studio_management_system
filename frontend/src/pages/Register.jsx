import { useState } from "react";

function Register() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Create Account</h2>

      <form className="card p-4 shadow" onSubmit={handleSubmit}>
        
        <input
          className="form-control mb-3"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button className="btn btn-dark w-100">
          Register
        </button>

      </form>
    </div>
  );
}

export default Register;