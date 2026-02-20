import { Link } from "react-router-dom";

function PublicNavbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        SplitEase
      </div>

      <div style={styles.links}>
        <Link to="/login" style={styles.login}>
          Log in
        </Link>

        <Link to="/signup" style={styles.signup}>
          Sign up
        </Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 100px",
    backgroundColor: "white",
    borderBottom: "1px solid #eee",
  },
  logo: {
  fontSize: "26px",
  fontWeight: "800",
  letterSpacing: "-0.5px",
    color: "#1F8A8A",
  },
  links: {
    display: "flex",
    gap: "28px",
    alignItems: "center",
  },
  login: {
    textDecoration: "none",
    color: "#333",
    fontWeight: "500",
  },
  signup: {
    textDecoration: "none",
    background: "linear-gradient(90deg, #1F8A8A, #00B4D8)",
    color: "white",
    padding: "10px 22px",
    borderRadius: "8px",
    fontWeight: "600",
  },
};

export default PublicNavbar;
