import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import API from "../services/api";
import "../styles/TripDetails.css";

function TripDetails() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Invite member state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteError, setInviteError] = useState("");
  
  // Add expense state
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseMessage, setExpenseMessage] = useState("");
  const [expenseError, setExpenseError] = useState("");

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get(`/trips/${tripId}`);
      setTrip(res.data.trip);
      setExpenses(res.data.expenses || []);
      setBalances(res.data.balances || []);
    } catch (err) {
      setError("Failed to load trip details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripDetails();
  }, [tripId]);

  const handleInviteMember = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    try {
      setInviteError("");
      setInviteMessage("");
      await API.post(`/trips/${tripId}/invite`, { email: inviteEmail });
      setInviteMessage("Invitation sent successfully");
      setInviteEmail("");
      setTimeout(() => setInviteMessage(""), 3000);
    } catch (err) {
      setInviteError(err.response?.data?.message || "Failed to send invitation");
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expenseDescription.trim() || !expenseAmount) return;

    try {
      setExpenseError("");
      setExpenseMessage("");
      await API.post(`/trips/${tripId}/expenses`, {
        description: expenseDescription,
        amount: parseFloat(expenseAmount),
      });
      setExpenseMessage("Expense added successfully");
      setExpenseDescription("");
      setExpenseAmount("");
      await fetchTripDetails();
      window.dispatchEvent(new Event('tripUpdated'));
      setTimeout(() => setExpenseMessage(""), 3000);
    } catch (err) {
      setExpenseError(err.response?.data?.message || "Failed to add expense");
    }
  };

  const getCurrentUserId = () => {
    // Get current user ID from token or API
    return localStorage.getItem("userId");
  };

  if (loading) {
    return (
      <div className="trip-details-page">
        <DashboardNavbar />
        <div className="trip-details-container">
          <p className="loading-text">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="trip-details-page">
        <DashboardNavbar />
        <div className="trip-details-container">
          <p className="error-text">{error || "Trip not found"}</p>
        </div>
      </div>
    );
  }

  const currentUserId = getCurrentUserId();

  return (
    <div className="trip-details-page">
      <DashboardNavbar />

      <div className="trip-details-container">
        {/* Trip Header */}
        <div className="trip-header">
          <h1>{trip.name}</h1>
          <div className="trip-meta">
            <span>Created {new Date(trip.createdAt).toLocaleDateString()}</span>
            <span className="meta-divider">•</span>
            <span>{trip.members?.length || 0} members</span>
          </div>
        </div>

        {/* Members Section */}
        <div className="section members-section">
          <h2>Members</h2>
          {trip.members && trip.members.length > 0 ? (
            <div className="members-list">
              {trip.members.map((member) => (
                <div key={member._id} className="member-item">
                  <div className="member-avatar">
                    {member.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <span className="member-name">
                    {member.name}
                    {member._id === currentUserId && <span className="you-badge"> (You)</span>}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">No members yet</p>
          )}
        </div>

        {/* Invite Member Section */}
        <div className="section invite-section">
          <h2>Invite Member</h2>
          <form onSubmit={handleInviteMember} className="invite-form">
            <input
              type="email"
              placeholder="Enter email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="invite-input"
            />
            <button type="submit" className="invite-btn">
              Send Invite
            </button>
          </form>
          {inviteMessage && <p className="success-message">{inviteMessage}</p>}
          {inviteError && <p className="error-message">{inviteError}</p>}
        </div>

        {/* Add Expense Section */}
        <div className="section add-expense-section">
          <h2>Add Expense</h2>
          <form onSubmit={handleAddExpense} className="expense-form">
            <input
              type="text"
              placeholder="Description"
              value={expenseDescription}
              onChange={(e) => setExpenseDescription(e.target.value)}
              className="expense-input"
            />
            <input
              type="number"
              placeholder="Amount"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              className="expense-input"
              step="0.01"
              min="0"
            />
            <button type="submit" className="expense-btn">
              Add Expense
            </button>
          </form>
          {expenseMessage && <p className="success-message">{expenseMessage}</p>}
          {expenseError && <p className="error-message">{expenseError}</p>}
        </div>

        {/* Expense List */}
        <div className="section expenses-section">
          <h2>Expenses</h2>
          {expenses.length === 0 ? (
            <p className="empty-message">No expenses added yet. Add your first expense above.</p>
          ) : (
            <div className="expenses-list-container">
              {expenses.map((expense) => (
                <div key={expense._id} className="expense-card">
                  <div className="expense-header">
                    <h3 className="expense-description">{expense.description}</h3>
                    <span className="expense-amount">₹{expense.amount}</span>
                  </div>
                  <p className="expense-paid-by">
                    Paid by {expense.paidBy?.name || "Unknown"}
                  </p>
                  <p className="expense-date">
                    {new Date(expense.createdAt).toLocaleDateString()}
                  </p>
                  <p className="expense-split">
                    Split equally among {trip.members?.length || 0} members
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Balance Summary */}
        <div className="section balances-section">
          <h2>Balances</h2>
          {balances.length === 0 ? (
            <p className="empty-message">No balances yet</p>
          ) : (
            <div className="balances-list">
              {balances.map((balance) => {
                const amount = balance.amount || balance.netBalance || 0;
                return (
                  <div key={balance.userId} className="balance-item">
                    {amount > 0 ? (
                      <span className="balance-positive">
                        {balance.name} is owed ₹{Math.abs(amount).toFixed(2)}
                      </span>
                    ) : (
                      <span className="balance-negative">
                        {balance.name} owes ₹{Math.abs(amount).toFixed(2)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TripDetails;
