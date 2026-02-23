import { useEffect, useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import API from "../services/api";
import "../styles/Invitations.css";

function Invitations() {
  const [invitations, setInvitations] = useState([]);
  const [filteredInvitations, setFilteredInvitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [processingId, setProcessingId] = useState(null);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/invitations");
      setInvitations(res.data.invitations || []);
      setFilteredInvitations(res.data.invitations || []);
    } catch (err) {
      setError("Failed to load invitations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  useEffect(() => {
    let result = [...invitations];

    if (filter === "pending") {
      result = result.filter((inv) => inv.status === "pending");
    } else if (filter === "accepted") {
      result = result.filter((inv) => inv.status === "accepted");
    } else if (filter === "rejected") {
      result = result.filter((inv) => inv.status === "rejected");
    }

    setFilteredInvitations(result);
  }, [filter, invitations]);

  const handleAccept = async (invitationId) => {
    try {
      setProcessingId(invitationId);
      await API.post(`/invitations/${invitationId}/accept`);
      await fetchInvitations();
      window.dispatchEvent(new Event('tripUpdated'));
    } catch (err) {
      setError("Failed to accept invitation");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (invitationId) => {
    try {
      setProcessingId(invitationId);
      await API.post(`/invitations/${invitationId}/reject`);
      fetchInvitations();
    } catch (err) {
      setError("Failed to reject invitation");
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = invitations.filter((inv) => inv.status === "pending").length;

  const getStatusBadge = (status) => {
    if (status === "pending") return <span className="status-badge pending">🟡 Pending</span>;
    if (status === "accepted") return <span className="status-badge accepted">🟢 Accepted</span>;
    if (status === "rejected") return <span className="status-badge rejected">🔴 Rejected</span>;
  };

  return (
    <div className="invitations-page">
      <DashboardNavbar />

      <div className="invitations-container">
        <div className="invitations-header">
          <div className="invitations-title-section">
            <h1>Invitations</h1>
            <p className="invitations-subtitle">Manage your trip invitations</p>
          </div>
          <div className="pending-badge">
            {pendingCount} Pending Invitation{pendingCount !== 1 ? "s" : ""}
          </div>
        </div>

        {loading ? (
          <p className="invitations-loading">Loading invitations...</p>
        ) : error ? (
          <p className="invitations-error">{error}</p>
        ) : invitations.length === 0 ? (
          <div className="invitations-empty">
            <h2>No invitations yet</h2>
            <p>When someone invites you to a trip, it will appear here.</p>
          </div>
        ) : (
          <>
            <div className="invitations-stats">
              <div className="stat-box">
                <span className="stat-label">Pending Invitations</span>
                <span className="stat-value">{pendingCount}</span>
              </div>
            </div>

            <div className="invitations-filter">
              <select
                className="filter-dropdown"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {filteredInvitations.length === 0 ? (
              <p className="no-results">No invitations match this filter</p>
            ) : (
              <div className="invitations-list">
                {filteredInvitations.map((invitation) => (
                  <div key={invitation._id} className="invitation-card">
                    <div className="invitation-content">
                      <div className="invitation-info">
                        <p className="invitation-message">
                          <span className="highlight">{invitation.from?.name || "Unknown User"}</span>
                          {" "}invited you to join the trip –{" "}
                          <span className="highlight">{invitation.trip?.name || "Unknown Trip"}</span>
                        </p>
                        {invitation.createdAt && (
                          <span className="invitation-date">
                            {new Date(invitation.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <div className="invitation-actions">
                        {invitation.status === "pending" ? (
                          <>
                            <button
                              className="accept-btn"
                              onClick={() => handleAccept(invitation._id)}
                              disabled={processingId === invitation._id}
                            >
                              {processingId === invitation._id ? "..." : "Accept"}
                            </button>
                            <button
                              className="reject-btn"
                              onClick={() => handleReject(invitation._id)}
                              disabled={processingId === invitation._id}
                            >
                              {processingId === invitation._id ? "..." : "Reject"}
                            </button>
                          </>
                        ) : (
                          getStatusBadge(invitation.status)
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Invitations;
