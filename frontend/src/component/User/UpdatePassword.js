import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updatePassword, clearErrors } from "../../actions/userAction";
import { toast } from "react-toastify";
import { UPDATE_PASSWORD_RESET } from "../../constants/actionTypes";
import "./Auth.css";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updatePassword({ oldPassword, newPassword, confirmPassword }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      toast.success("Password updated successfully");
      dispatch({ type: UPDATE_PASSWORD_RESET });
      navigate("/account");
    }
  }, [dispatch, error, isUpdated, navigate]);

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={submitHandler}>
        <h2>Change Password</h2>
        <input type="password" placeholder="Old Password" required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
        <input type="password" placeholder="New Password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <input type="password" placeholder="Confirm New Password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <button type="submit" disabled={loading}>Update Password</button>
      </form>
    </div>
  );
};

export default UpdatePassword;
