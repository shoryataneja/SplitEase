import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import API from "../services/api";
import "../styles/Trips.css";

function Trips() {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/trips");
      setTrips(res.data.trips || []);
      setFilteredTrips(res.data.trips || []);
    } catch (err) {
      if (err.response?.status === 401) {
        setTrips([]);
        setFilteredTrips([]);
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

  useEffect(() => {
    let result = [...trips];

    // Filter by search
    if (searchQuery) {
      result = result.filter((trip) =>
        trip.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "a-z") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredTrips(result);
  }, [searchQuery, sortBy, trips]);

  return (
    <div className="trips-page">
      <DashboardNavbar />

      <div className="trips-container">
        <div className="trips-header">
          <div className="trips-title-section">
            <h1>All Trips</h1>
            <p className="trips-subtitle">Manage all your shared expense groups</p>
          </div>

          <div className="trips-controls">
            <select
              className="trips-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="a-z">A–Z</option>
            </select>

            <input
              type="text"
              className="trips-search"
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <p className="trips-loading">Loading trips...</p>
        ) : trips.length === 0 ? (
          <div className="trips-empty">
            <h2>No trips yet</h2>
            <p>Create your first trip to get started.</p>
            <button
              className="empty-create-btn"
              onClick={() => navigate("/dashboard")}
            >
              Create Trip
            </button>
          </div>
        ) : error ? (
          <p className="trips-error">{error}</p>
        ) : (
          <>
            <div className="trips-stats">
              <div className="stat">
                <span className="stat-label">Total Trips</span>
                <span className="stat-value">{trips.length}</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-label">Active Trips</span>
                <span className="stat-value">{trips.length}</span>
              </div>
            </div>

            {filteredTrips.length === 0 ? (
              <p className="no-results">No trips match your search</p>
            ) : (
              <div className="trips-grid">
                {filteredTrips.map((trip) => (
                  <div
                    key={trip._id}
                    className="trip-card"
                    onClick={() => navigate(`/trips/${trip._id}`)}
                  >
                    <div className="trip-card-content">
                      <h3 className="trip-card-name">{trip.name}</h3>
                      <p className="trip-card-subtitle">Click to view details</p>
                    </div>
                    <span className="trip-card-arrow">→</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <button
        className="floating-create-btn"
        onClick={() => navigate("/dashboard")}
        title="Create new trip"
      >
        +
      </button>
    </div>
  );
}

export default Trips;
