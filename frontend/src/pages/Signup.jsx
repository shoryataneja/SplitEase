import { useState } from "react";
import API from "../services/api";
import "../styles/Signup.css";
import "../styles/global.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/signup", {
        name,
        email,
        password,
      });

      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Signup failed");
    }
  };

return (
  <div className="signup-page">
    <div className="signup-wrapper">
      <div className="signup-card">

        <h2>Join SplitEase</h2>
        <p className="subtitle">
          Start splitting expenses the smarter way.
        </p>
        <div className="signup-icon">
         <img src="/rocket_6172512.gif" alt="Rocket" />
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="signup-btn">
            Create Account
          </button>
        </form>

        {message && (
          <p className="signup-message">
            {message}
          </p>
        )}

        <p className="login-link">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  </div>
);
}

export default Signup;
