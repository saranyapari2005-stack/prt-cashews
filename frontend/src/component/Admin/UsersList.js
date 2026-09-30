import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllUsers, deleteUser, clearErrors } from "../../actions/userAction";
import { toast } from "react-toastify";
import Loader from "../layout/Loader/Loader";
import Sidebar from "./Sidebar";
import "./Admin.css";
import { DELETE_USER_RESET } from "../../constants/actionTypes";

const UsersList = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.allUsers);
  const { isDeleted, error: deleteError } = useSelector((state) => state.userUpdate);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      toast.success("User deleted successfully");
      dispatch({ type: DELETE_USER_RESET });
    }
    dispatch(getAllUsers());
  }, [dispatch, error, deleteError, isDeleted]);

  const deleteHandler = (id) => {
    if (window.confirm("Delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <h2>Users ({users?.length || 0})</h2>

        {loading ? (
          <Loader />
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users &&
                  users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>
                        <div className="admin-actions">
                          <Link to={`/admin/user/${u._id}`} className="edit-icon">
                            <i className="fa fa-pen"></i>
                          </Link>
                          <button className="delete-icon" onClick={() => deleteHandler(u._id)}>
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;
