import { Link, useNavigate } from "react-router-dom";
import rocket from "/rocket_6172512.gif";

function DashboardNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>

      {/* Logo Section */}
      <div
        style={styles.logoContainer}
        onClick={() => navigate("/dashboard")}
      >
        <span style={styles.logoText}>SplitEase</span>
        <img src={rocket} alt="rocket" style={styles.logoIcon} />
      </div>

      {/* Right Side Links */}
      <div style={styles.links}>
        <Link to="/trips" style={styles.link}>
          Trips
        </Link>

        <Link to="/invitations" style={styles.link}>
          Invitations
        </Link>

        <Link to="/profile" style={styles.link}>
          Profile
        </Link>

        <button onClick={handleLogout} style={styles.logout}>
          Logout
        </button>
      </div>

    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 80px",
    backgroundColor: "white",
    borderBottom: "1px solid #eee",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
  },

  logoText: {
    fontSize: "28px",
    fontWeight: "700",
    fontFamily: "'Playfair Display', Georgia, serif",
    letterSpacing: "-0.5px",
    color: "#1F8A8A",
  },

  logoIcon: {
    width: "30px",
    height: "30px",
  },

  links: {
    display: "flex",
    gap: "32px",
    alignItems: "center",
  },

  link: {
    textDecoration: "none",
    color: "#333",
    fontWeight: "500",
    fontSize: "14px",
    transition: "color 0.2s",
  },

  logout: {
    background: "none",
    border: "none",
    color: "#d64545",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "color 0.2s",
  },
};

export default DashboardNavbar;