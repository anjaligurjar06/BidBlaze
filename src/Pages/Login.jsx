import { useState } from "react";
import { useNavigate } from "react-router-dom";   // ✅ ADD THIS
import "../Styles/Login.css";
import { Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();   // ✅ ADD THIS

  const [formData, setFormData] = useState({
    email: "",
    uniqueId: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const savedEmail = localStorage.getItem("email");
    const savedId = localStorage.getItem("uniqueId");
    const savedPassword = localStorage.getItem("password");

    if (
      formData.email === savedEmail &&
      formData.uniqueId === savedId &&
      formData.password === savedPassword
    ) {
      alert("Login Successful");

      navigate("/dashboard");   // ✅ THIS IS THE FIX
    } else {
      alert("Wrong Credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login Page</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="uniqueId"
            placeholder="Enter Unique ID"
            value={formData.uniqueId}
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

          <button type="submit">Login</button>
        </form>

        <p>
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;