import { Link } from "react-router-dom";
import "../styles/global.css";
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
      <div className="hero-content">

        {/* LEFT SIDE */}
        <div className="hero-left">
          <h1>
            Split Expenses. Not Friendships
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
       </div>
      </section>
        <div className="bottom-wave">
  <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
    <path
      fill="#178f87"
      fillOpacity="1"
      d="M0,224L60,208C120,192,240,160,360,154.7C480,149,600,171,720,186.7C840,203,960,213,1080,192C1200,171,1320,117,1380,90.7L1440,64L1440,320L0,320Z"
    ></path>
  </svg>
</div>
    </div>
  );
}

export default Landing;