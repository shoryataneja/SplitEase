import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [tripName, setTripName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Fetch trips
  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/trips");
      setTrips(res.data.trips);
    } catch {
      setError("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // 🔹 Create new trip
  const handleCreateTrip = async (e) => {
    e.preventDefault();

    if (!tripName.trim()) return;

    try {
      setError("");
      await API.post("/trips", { name: tripName });

      setTripName("");
      fetchTrips(); // refresh list
    } catch {
      setError("Failed to create trip");
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>

      {/* Create Trip Form */}
      <form onSubmit={handleCreateTrip}>
        <input
          type="text"
          placeholder="Enter trip name"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
        />
        <button type="submit">Create Trip</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Your Trips</h3>

      {loading ? (
        <p>Loading...</p>
      ) : trips.length === 0 ? (
        <p>No trips found</p>
      ) : (
        <ul>
          {trips.map((trip) => (
            <li
              key={trip._id}
              onClick={() => navigate(`/trips/${trip._id}`)}
              style={{ cursor: "pointer", marginBottom: "8px" }}
            >
              {trip.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
