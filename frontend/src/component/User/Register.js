import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, clearErrors } from "../../actions/userAction";
import { toast } from "react-toastify";
import "./Auth.css";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, error, loading } = useSelector((state) => state.user);

  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  const { name, email, password } = user;

  const onChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(register({ name, email, password, avatar }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      navigate("/account");
    }
  }, [dispatch, error, isAuthenticated, navigate]);

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={submitHandler}>
        <h2>Create Account</h2>
        {avatarPreview && <img src={avatarPreview} alt="avatar" className="auth-avatar-preview" />}
        <input type="text" name="name" placeholder="Full Name" required value={name} onChange={onChange} />
        <input type="email" name="email" placeholder="Email" required value={email} onChange={onChange} />
        <input type="password" name="password" placeholder="Password" required value={password} onChange={onChange} />
        <input type="file" name="avatar" accept="image/*" onChange={onChange} />
        <button type="submit" disabled={loading}>Register</button>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
