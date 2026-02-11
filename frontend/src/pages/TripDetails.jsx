import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function TripDetails() {
  const { tripId } = useParams();
  const [balances, setBalances] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const res = await API.get(`/expenses/trip/${tripId}/balances`);
        setBalances(res.data.balances);
      } catch (err) {
        setError("Failed to load balances");
      }
    };

    fetchBalances();
  }, [tripId]);

  return (
    <div>
      <h2>Trip Details</h2>

      {error && <p>{error}</p>}

      <h3>Balances</h3>

      {Object.keys(balances).length === 0 ? (
        <p>No balances yet</p>
      ) : (
        <ul>
          {Object.values(balances).map((user, index) => (
            <li key={index}>
              {user.name}: {user.balance}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TripDetails;
