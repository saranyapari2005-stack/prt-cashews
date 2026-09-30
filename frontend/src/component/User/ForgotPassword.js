import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, clearErrors } from "../../actions/userAction";
import { toast } from "react-toastify";
import "./Auth.css";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const { error, message, loading } = useSelector((state) => state.profile);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (message) {
      toast.success(message);
    }
  }, [dispatch, error, message]);

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={submitHandler}>
        <h2>Forgot Password</h2>
        <p style={{ fontSize: "0.85rem", color: "#666" }}>
          Enter your registered email and we'll send you a reset link.
        </p>
        <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit" disabled={loading}>Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
