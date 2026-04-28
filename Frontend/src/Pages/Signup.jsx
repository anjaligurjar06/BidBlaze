import React, { useState } from "react";
import "../styles/Signup.css";
import { Link } from "react-router-dom";


function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    uniqueId: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    const generatedId =
      "UID" + Math.floor(1000 + Math.random() * 9000);

    // Save in localStorage
    localStorage.setItem("name", formData.name);
    localStorage.setItem("email", formData.email);
    localStorage.setItem("password", formData.password);
    localStorage.setItem("uniqueId", generatedId);

    // Show generated ID on screen
    setFormData({
      ...formData,
      uniqueId: generatedId,
    });

    alert("Signup Successful");
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Signup Page</h2>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            name="name"
            placeholder="Enter Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Signup</button>
        </form>

        {formData.uniqueId && (
          <p className="uid-text">
            Your Unique ID: {formData.uniqueId}
          </p>
        )}

        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;