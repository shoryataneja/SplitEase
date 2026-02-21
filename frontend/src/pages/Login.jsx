import { useState } from "react";
import API from "../services/api";
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      // store token
      localStorage.setItem("token", res.data.token);

      setMessage("Login successful");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

return (
  <div className="login-page">
    <div className="login-wrapper">
      <div className="login-card">

        <div className="login-icon">
          <img src="/rocket_6172512.gif" alt="Rocket" />
        </div>

        <h2>Welcome Back</h2>
        <p className="subtitle">
          Sign in to manage your shared expenses.
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

<div className="input-group password-wrapper">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Enter your password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <span
    className="eye-toggle"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? "👁️" : "👁️"}
  </span>
</div>

          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>

        {message && (
          <p className="login-message">
            {message}
          </p>
        )}

        <p className="signup-link">
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>

      </div>
    </div>
  </div>
);
}

export default Login;
