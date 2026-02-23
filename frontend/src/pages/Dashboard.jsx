import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import API from "../services/api";
import "../styles/Dashboard.css";

function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [tripName, setTripName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await API.get("/trips");
      setTrips(res.data.trips || []);
    } catch (err) {
      if (err.response?.status === 401) {
        setTrips([]);
      } else {
        setError("Unable to load trips right now.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    if (!tripName.trim()) return;

    try {
      setError("");
      await API.post("/trips", { name: tripName });
      setTripName("");
      fetchTrips();
    } catch (err) {
      setError("Failed to create trip");
    }
  };

  const recentTrips = trips.slice(0, 3);

  return (
    <div className="dashboard-page">
      <DashboardNavbar />

      <div className="dashboard-container">
        <div className="create-section">
          <h2>Create New Trip</h2>
          <form onSubmit={handleCreateTrip}>
            <input
              type="text"
              placeholder="Enter trip name..."
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
            />
            <button type="submit">Create</button>
          </form>
          {error && <p className="error-text">{error}</p>}
        </div>

        <div className="recent-section">
          <div className="recent-header">
            <h2>Recent Trips</h2>
          </div>

          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : recentTrips.length === 0 ? (
            <div className="empty-state">
              <p className="empty-title">No trips created yet.</p>
              <p className="empty-subtitle">Start by creating your first trip.</p>
            </div>
          ) : (
            <>
              <div className="recent-list">
                {recentTrips.map((trip) => (
                  <div
                    key={trip._id}
                    className="trip-item"
                    onClick={() => navigate(`/trips/${trip._id}`)}
                  >
                    <span className="trip-name">{trip.name}</span>
                    <span className="trip-arrow">→</span>
                  </div>
                ))}
              </div>
              <div className="view-all-link" onClick={() => navigate("/trips")}>
                View All Trips →
              </div>
            </>
          )}
        </div>

        <div className="stats-strip">
          <div className="stat-item">
            <span className="stat-value">{trips.length}</span>
            <span className="stat-label">Total Trips</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">0</span>
            <span className="stat-label">Pending Invitations</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
