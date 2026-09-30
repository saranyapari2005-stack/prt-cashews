import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearErrors } from "../../actions/userAction";
import { toast } from "react-toastify";
import "./Auth.css";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(resetPassword(token, { password, confirmPassword }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      toast.success("Password updated successfully");
      navigate("/login");
    }
  }, [dispatch, error, isUpdated, navigate]);

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={submitHandler}>
        <h2>Reset Password</h2>
        <input type="password" placeholder="New Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="password" placeholder="Confirm Password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <button type="submit" disabled={loading}>Update Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
