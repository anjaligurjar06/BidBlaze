import React, { useState } from "react";
import "../Styles/Signup.css";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";

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

 const handleSignup = async (e) => {
  e.preventDefault();
  try {
    const data = await apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
    });
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("name", data.name);
    localStorage.setItem("uniqueId", data.unique_id);
    localStorage.setItem("userId", data.id);
    setFormData({ ...formData, uniqueId: data.unique_id });
    alert(`Signup Successful! Your Unique ID: ${data.unique_id} — save this for login!`);
  } catch (err) {
    alert(err.message);
  }
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