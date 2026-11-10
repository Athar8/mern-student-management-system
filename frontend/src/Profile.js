import React from "react";

function Profile({ onBack }) {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="profile-container">

      <div className="profile-box">

        <div className="profile-icon">
          👤
        </div>

        <h2>My Profile</h2>

        <div className="profile-info">
          <p>
            <strong>Name:</strong>{" "}
            {user?.name || "User"}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {user?.email || "No email"}
          </p>
        </div>

        <button
          className="back-btn"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

      </div>

    </div>
  );
}

export default Profile;