import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getUserDetails, updateUser, clearErrors } from "../../actions/userAction";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import "./Admin.css";
import { UPDATE_USER_RESET } from "../../constants/actionTypes";

const UpdateUser = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.userDetails);
  const { loading, error, isUpdated } = useSelector((state) => state.userUpdate);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (user && user._id !== id) {
      dispatch(getUserDetails(id));
    } else if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      toast.success("User updated successfully");
      dispatch({ type: UPDATE_USER_RESET });
      navigate("/admin/users");
    }
  }, [dispatch, id, user, error, isUpdated, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser(id, { name, email, role }));
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <h2>Update User</h2>
        <form className="admin-form" onSubmit={submitHandler}>
          <input type="text" placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" disabled={loading}>Update User</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
