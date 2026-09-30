import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfile, loadUser, clearErrors } from "../../actions/userAction";
import { toast } from "react-toastify";
import { UPDATE_PROFILE_RESET } from "../../constants/actionTypes";
import "./Auth.css";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || "");

  const onAvatarChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateProfile({ name, email, avatar }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      toast.success("Profile updated successfully");
      dispatch(loadUser());
      dispatch({ type: UPDATE_PROFILE_RESET });
      navigate("/account");
    }
  }, [dispatch, error, isUpdated, navigate]);

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={submitHandler}>
        <h2>Update Profile</h2>
        {avatarPreview && <img src={avatarPreview} alt="avatar" className="auth-avatar-preview" />}
        <input type="text" placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="file" accept="image/*" onChange={onAvatarChange} />
        <button type="submit" disabled={loading}>Save Changes</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
