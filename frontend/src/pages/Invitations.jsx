import { useEffect, useState } from "react";
import API from "../services/api";

function Invitations() {
  const [invitations, setInvitations] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  

  const fetchInvitations = async () => {
    try {
      setError("");
      const res = await API.get("/invitations");
      setInvitations(res.data.invitations);
    } catch {
      setError("Failed to load invitations");
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleAccept = async (id) => {
    try {
      await API.post(`/invitations/${id}/accept`);
      setMessage("Invitation accepted");
      fetchInvitations();
    } catch {
      setError("Failed to accept invitation");
    }
  };

  const handleReject = async (id) => {
    try {
      await API.post(`/invitations/${id}/reject`);
      setMessage("Invitation rejected");
      fetchInvitations();
    } catch {
      setError("Failed to reject invitation");
    }
  };

  return (
    <div>
      <h2>My Invitations</h2>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      {invitations.length === 0 ? (
        <p>No pending invitations</p>
      ) : (
        <ul>
          {invitations.map((invite) => (
            <li key={invite._id}>
              <p>
                {invite.from.name} invited you to join {invite.trip.name}
              </p>

              <button onClick={() => handleAccept(invite._id)}>
                Accept
              </button>

              <button onClick={() => handleReject(invite._id)}>
                Reject
              </button>

              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Invitations;
