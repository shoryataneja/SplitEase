import { Link } from "react-router-dom";
import "../styles/Landing.css";
import rocket from "/rocket_6172512.gif";

function Landing() {
  return (
    <div className="landing-page">

      {/* Navbar */}
      <nav className="navbar">
        <h2 className="logo">SplitEase</h2>
        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/signup" className="signup-btn">Register</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">

        {/* LEFT SIDE */}
        <div className="hero-left">
          <h1>
            Splitting expenses has <br />
            never been easier.
          </h1>

          <ul className="feature-list">
            <li>Share trip bills and expenses.</li>
            <li>Make sure everyone gets paid back.</li>
            <li>Track balances in real-time.</li>
            <li>Completely free and easy to use.</li>
          </ul>

          <Link to="/signup" className="primary-btn">
            Get Started
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="hero-right">
          <img src={rocket} alt="SplitEase Illustration" />
        </div>

      </section>

    </div>
  );
}

export default Landing;