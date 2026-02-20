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
    padding: "20px 60px",
    backgroundColor: "white",
    borderBottom: "1px solid #eee",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1F8A8A",
  },
  links: {
    display: "flex",
    gap: "20px",
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
    padding: "8px 18px",
    borderRadius: "6px",
    fontWeight: "600",
  },
};

export default PublicNavbar;
