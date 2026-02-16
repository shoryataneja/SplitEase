import { Link } from "react-router-dom";
import "../styles/Landing.css";

function Landing() {
  return (
    <div className="landing">
      <div className="landing-hero">
        <h1 className="landing-title">SplitEase</h1>
        <p className="landing-subtitle">
          Split expenses with friends. Track balances effortlessly.
        </p>

        <div className="landing-cta">
          <Link to="/login" className="landing-btn primary">
            Login
          </Link>

          <Link to="/signup" className="landing-btn secondary">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;
