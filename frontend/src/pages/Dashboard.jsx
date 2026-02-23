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
  const [totalOwed, setTotalOwed] = useState(0);
  const [totalOwe, setTotalOwe] = useState(0);
  const navigate = useNavigate();

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await API.get("/trips");
      setTrips(res.data.trips);
      calculateBalances(res.data.trips);
    } catch (err) {
      setError("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  const calculateBalances = async (tripsList) => {
    let owed = 0;
    let owe = 0;
    const userId = localStorage.getItem("userId");

    for (const trip of tripsList) {
      try {
        const res = await API.get(`/trips/${trip._id}`);
        const balances = res.data.balances || [];
        const userBalance = balances.find(b => b.userId.toString() === userId);
        
        if (userBalance) {
          if (userBalance.amount > 0) {
            owed += userBalance.amount;
          } else if (userBalance.amount < 0) {
            owe += Math.abs(userBalance.amount);
          }
        }
      } catch (err) {
        console.error(`Failed to fetch trip ${trip._id}:`, err);
      }
    }

    setTotalOwed(Math.round(owed * 100) / 100);
    setTotalOwe(Math.round(owe * 100) / 100);
  };

  useEffect(() => {
    fetchTrips();

    const handleTripUpdate = () => {
      fetchTrips();
    };

    window.addEventListener('tripUpdated', handleTripUpdate);
    return () => window.removeEventListener('tripUpdated', handleTripUpdate);
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
        <div className="dashboard-top">
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

          <div className="balance-section">
            <h2>Your Balance</h2>
            <div className="balance-summary">
              <div className="balance-item">
                <span className="balance-label">You are owed</span>
                <span className="balance-amount">₹{totalOwed.toFixed(2)}</span>
              </div>
              <div className="balance-item">
                <span className="balance-label">You owe</span>
                <span className="balance-amount">₹{totalOwe.toFixed(2)}</span>
              </div>
              <div className="balance-net">
                <span className="net-label">Net Balance</span>
                <span className="net-amount">₹{(totalOwed - totalOwe).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="recent-section">
          <div className="recent-header">
            <h2>Recent Trips</h2>
          </div>

          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : recentTrips.length === 0 ? (
            <p className="empty-text">No trips yet. Create your first trip above.</p>
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
