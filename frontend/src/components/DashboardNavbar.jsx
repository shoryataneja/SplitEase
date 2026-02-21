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
    padding: "22px 80px", // slightly reduced from 100px
    backgroundColor: "white",
    borderBottom: "1px solid #eee",
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
  },

  logoText: {
  fontSize: "32px",
  fontWeight: "800",
  letterSpacing: "-0.5px",
    color: "#1F8A8A",
  },

  logoIcon: {
    width: "34px",             // slightly bigger rocket
    height: "34px",
  },

  links: {
    display: "flex",
    gap: "30px",               // slightly tighter spacing
    alignItems: "center",
  },

  link: {
    textDecoration: "none",
    color: "#333",
    fontWeight: "500",
    fontSize: "22px",
  },

  logout: {
    background: "none",
    border: "none",
    color: "#d64545",
    fontWeight: "600",
    fontSize: "20px",
    cursor: "pointer",
  },
};

export default DashboardNavbar;