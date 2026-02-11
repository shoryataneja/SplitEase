import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function TripDetails() {
  const { tripId } = useParams();

  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [error, setError] = useState("");

  const fetchTripData = async () => {
    try {
      setError("");

      const expensesRes = await API.get(`/expenses/trip/${tripId}`);
      setExpenses(expensesRes.data.expenses);

      const balancesRes = await API.get(
        `/expenses/trip/${tripId}/balances`
      );
      setBalances(balancesRes.data.balances);
    } catch (err) {
      setError("Failed to load trip data");
    }
  };

  useEffect(() => {
    fetchTripData();
  }, [tripId]);

  return (
    <div>
      <h2>Trip Details</h2>

      {error && <p>{error}</p>}

      <h3>Expenses</h3>
      {expenses.length === 0 ? (
        <p>No expenses yet</p>
      ) : (
        <ul>
          {expenses.map((expense) => (
            <li key={expense._id}>
              {expense.description} — ₹{expense.amount}
            </li>
          ))}
        </ul>
      )}

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
