import { useState } from "react";
import { useNavigate } from "react-router-dom";   // ✅ ADD THIS
import "../Styles/Login.css";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";
function Login() {
  const navigate = useNavigate();   // ✅ ADD THIS

  const [formData, setFormData] = useState({
    email: "",
    unique_id: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("name", data.name);
    localStorage.setItem("uniqueId", data.unique_id);
    localStorage.setItem("userId", data.id);
    alert("Login Successful");
    navigate("/dashboard");
  } catch (err) {
    alert(err.message);
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
            name="unique_id"
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