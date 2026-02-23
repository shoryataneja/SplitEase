import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import API from "../services/api";
import "../styles/Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
        setNewName(res.data.name);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleUpdateName = async () => {
    try {
      setError("");
      setMessage("");
      const res = await API.put("/auth/update-name", { name: newName });
      setUser(res.data);
      setEditingName(false);
      setMessage("Name updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update name");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setMessage("");
      await API.put("/auth/change-password", { currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setChangingPassword(false);
      setMessage("Password changed successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      await API.delete("/auth/delete-account");
      localStorage.clear();
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account");
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <DashboardNavbar />
        <div className="profile-container">
          <p className="loading-text">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const initial = user.name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="profile-page">
      <DashboardNavbar />

      <div className="profile-container">
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        {/* Card 1 - Profile Information */}
        <div className="profile-card">
          <div className="avatar">{initial}</div>
          <h1 className="user-name">{user.name}</h1>
          <p className="user-email">{user.email}</p>
          
          <div className="profile-details">
            <p className="detail-line">
              <span className="detail-label">Name:</span> {user.name}
            </p>
            <p className="detail-line">
              <span className="detail-label">Email:</span> {user.email}
            </p>
          </div>
        </div>

        {/* Card 2 - Account Settings */}
        <div className="settings-card">
          <h2>Account Settings</h2>
          
          {editingName ? (
            <div className="edit-name-section">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="name-input"
                placeholder="Enter new name"
              />
              <div className="edit-actions">
                <button onClick={handleUpdateName} className="save-btn">Save</button>
                <button onClick={() => setEditingName(false)} className="cancel-btn">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="settings-actions">
              <button className="settings-btn" onClick={() => setEditingName(true)}>
                Edit Name
              </button>
              <button 
                className="settings-btn" 
                onClick={() => setChangingPassword(!changingPassword)}
              >
                Change Password
              </button>
            </div>
          )}

          {changingPassword && !editingName && (
            <form onSubmit={handleChangePassword} className="password-form">
              <div className="password-input-wrapper">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="password-input"
                  required
                />
                <span
                  className="eye-toggle"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 7.449-11.985 7.449c-7.18 0-12.015-7.449-12.015-7.449s4.446-6.551 12.015-6.551c7.694 0 11.985 6.551 11.985 6.551zm-7 .449c0-2.761-2.238-5-5-5-2.761 0-5 2.239-5 5 0 2.762 2.239 5 5 5 2.762 0 5-2.238 5-5z"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11.885 14.988l3.104-3.098.011.11c0 1.654-1.346 3-3 3l-.115-.012zm8.048-8.032l-3.274 3.268c.212.554.341 1.149.341 1.776 0 2.757-2.243 5-5 5-.631 0-1.229-.13-1.785-.344l-2.377 2.372c1.276.588 2.671.972 4.177.972 7.733 0 11.985-8.449 11.985-8.449s-1.415-2.478-4.067-4.595zm1.431-3.536l-18.619 18.58-1.382-1.422 3.455-3.447c-3.022-2.45-4.818-5.58-4.818-5.58s4.446-7.551 12.015-7.551c1.825 0 3.456.426 4.886 1.075l3.081-3.075 1.382 1.42zm-13.751 10.922l1.519-1.515c-.077-.264-.132-.538-.132-.827 0-1.654 1.346-3 3-3 .291 0 .567.055.833.134l1.518-1.515c-.704-.382-1.496-.619-2.351-.619-2.757 0-5 2.243-5 5 0 .852.235 1.641.613 2.342z"/></svg>
                  )}
                </span>
              </div>
              <div className="password-input-wrapper">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="password-input"
                  required
                />
                <span
                  className="eye-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 7.449-11.985 7.449c-7.18 0-12.015-7.449-12.015-7.449s4.446-6.551 12.015-6.551c7.694 0 11.985 6.551 11.985 6.551zm-7 .449c0-2.761-2.238-5-5-5-2.761 0-5 2.239-5 5 0 2.762 2.239 5 5 5 2.762 0 5-2.238 5-5z"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11.885 14.988l3.104-3.098.011.11c0 1.654-1.346 3-3 3l-.115-.012zm8.048-8.032l-3.274 3.268c.212.554.341 1.149.341 1.776 0 2.757-2.243 5-5 5-.631 0-1.229-.13-1.785-.344l-2.377 2.372c1.276.588 2.671.972 4.177.972 7.733 0 11.985-8.449 11.985-8.449s-1.415-2.478-4.067-4.595zm1.431-3.536l-18.619 18.58-1.382-1.422 3.455-3.447c-3.022-2.45-4.818-5.58-4.818-5.58s4.446-7.551 12.015-7.551c1.825 0 3.456.426 4.886 1.075l3.081-3.075 1.382 1.42zm-13.751 10.922l1.519-1.515c-.077-.264-.132-.538-.132-.827 0-1.654 1.346-3 3-3 .291 0 .567.055.833.134l1.518-1.515c-.704-.382-1.496-.619-2.351-.619-2.757 0-5 2.243-5 5 0 .852.235 1.641.613 2.342z"/></svg>
                  )}
                </span>
              </div>
              <button type="submit" className="submit-password-btn">
                Update Password
              </button>
            </form>
          )}
        </div>

        {/* Card 3 - Danger Zone */}
        <div className="danger-card">
          <p className="danger-warning">
            Deleting your account is permanent and cannot be undone.
          </p>
          <button className="delete-account-btn" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
