import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await API.get("/trips");
        setTrips(res.data.trips);
      } catch (err) {
        setError("Failed to load trips");
      }
    };

    fetchTrips();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>

      {error && <p>{error}</p>}

      {trips.length === 0 ? (
        <p>No trips found</p>
      ) : (
        <ul>
          {trips.map((trip) => (
            <li key={trip._id}>{trip.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
