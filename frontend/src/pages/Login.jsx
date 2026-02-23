import { useState } from "react";
import API from "../services/api";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login form submitted");
    console.log("Email:", email);
    console.log("Password length:", password.length);

    try {
      console.log("Sending login request...");
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("Login response:", res.data);

      // store token
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        console.log("Token stored successfully");
        console.log("Token value:", res.data.token.substring(0, 20) + "...");
        console.log("Verify token in localStorage:", localStorage.getItem("token") ? "✓ Token exists" : "✗ Token missing");
      } else {
        console.error("No token in response!");
        setMessage("Login failed: No token received");
        return;
      }
      
      console.log("Token stored, navigating to dashboard");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      setMessage(error.response?.data?.message || "Login failed. Please try again.");
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
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

                      <span
  className="eye-toggle"
  onClick={() => setShowPassword(!showPassword)}
>
  {showPassword ? (
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 7.449-11.985 7.449c-7.18 0-12.015-7.449-12.015-7.449s4.446-6.551 12.015-6.551c7.694 0 11.985 6.551 11.985 6.551zm-7 .449c0-2.761-2.238-5-5-5-2.761 0-5 2.239-5 5 0 2.762 2.239 5 5 5 2.762 0 5-2.238 5-5z"/></svg>
  ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11.885 14.988l3.104-3.098.011.11c0 1.654-1.346 3-3 3l-.115-.012zm8.048-8.032l-3.274 3.268c.212.554.341 1.149.341 1.776 0 2.757-2.243 5-5 5-.631 0-1.229-.13-1.785-.344l-2.377 2.372c1.276.588 2.671.972 4.177.972 7.733 0 11.985-8.449 11.985-8.449s-1.415-2.478-4.067-4.595zm1.431-3.536l-18.619 18.58-1.382-1.422 3.455-3.447c-3.022-2.45-4.818-5.58-4.818-5.58s4.446-7.551 12.015-7.551c1.825 0 3.456.426 4.886 1.075l3.081-3.075 1.382 1.42zm-13.751 10.922l1.519-1.515c-.077-.264-.132-.538-.132-.827 0-1.654 1.346-3 3-3 .291 0 .567.055.833.134l1.518-1.515c-.704-.382-1.496-.619-2.351-.619-2.757 0-5 2.243-5 5 0 .852.235 1.641.613 2.342z"/></svg>
  )}
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
