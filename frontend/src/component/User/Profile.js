import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="profile-page">
      <h2>My Profile</h2>
      <div className="profile-card">
        <img src={user?.avatar?.url || "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg"} alt={user?.name} />
        <div className="profile-info">
          <p><b>Name:</b> {user?.name}</p>
          <p><b>Email:</b> {user?.email}</p>
          <p><b>Joined On:</b> {String(user?.createdAt).substring(0, 10)}</p>

          <div className="profile-actions">
            <Link to="/me/update">Edit Profile</Link>
            <Link to="/password/update">Change Password</Link>
            <Link to="/orders">My Orders</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
