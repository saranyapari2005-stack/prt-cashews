import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearErrors } from "../../actions/userAction";
import { toast } from "react-toastify";
import "./Auth.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, error, loading } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const redirect = new URLSearchParams(location.search).get("redirect") || "/account";

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [dispatch, error, isAuthenticated, navigate, redirect]);

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={submitHandler}>
        <h2>Login</h2>
        <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="forgot-link">
          <Link to="/password/forgot">Forgot Password?</Link>
        </div>
        <button type="submit" disabled={loading}>Login</button>
        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
