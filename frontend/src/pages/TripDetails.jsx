import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function TripDetails() {
  const { tripId } = useParams();

  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
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

  const handleAddExpense = async (e) => {
    e.preventDefault();

    if (!description || !amount) return;

    try {
      await API.post("/expenses", {
        description,
        amount: Number(amount),
        tripId,
      });

      setDescription("");
      setAmount("");

      fetchTripData(); // refresh expenses + balances
    } catch (err) {
      setError("Failed to add expense");
    }
  };

  return (
    <div>
      <h2>Trip Details</h2>

      {error && <p>{error}</p>}

      {/* Add Expense Form */}
      <h3>Add Expense</h3>
      <form onSubmit={handleAddExpense}>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <br />

        <button type="submit">Add Expense</button>
      </form>

      {/* Expenses List */}
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

      {/* Balances */}
      <h3>Balances</h3>
      {Object.keys(balances).length === 0 ? (
        <p>No balances yet</p>
      ) : (
        <ul>
          {Object.values(balances).map((user, index) => (
            <li key={index}>
              {user.name}: {user.balance.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TripDetails;