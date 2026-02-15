import { useEffect, useState } from "react";
import API from "../services/api";

function Invitations() {
  const [invitations, setInvitations] = useState([]);
  const [error, setError] = useState("");

  const fetchInvitations = async () => {
    try {
      setError("");
      const res = await API.get("/invitations");
      setInvitations(res.data.invitations);
    } catch (err) {
      setError("Failed to load invitations");
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  return (
    <div>
      <h2>My Invitations</h2>

      {error && <p>{error}</p>}

      {invitations.length === 0 ? (
        <p>No pending invitations</p>
      ) : (
        <ul>
          {invitations.map((invite) => (
            <li key={invite._id}>
              {invite.from.name} invited you to join {invite.trip.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Invitations;
