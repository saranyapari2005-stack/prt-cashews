import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllOrders, deleteOrder, clearErrors } from "../../actions/orderAction";
import { toast } from "react-toastify";
import Loader from "../layout/Loader/Loader";
import Sidebar from "./Sidebar";
import "./Admin.css";
import { DELETE_ORDER_RESET } from "../../constants/actionTypes";

const OrderList = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.allOrders);
  const { isDeleted, error: deleteError } = useSelector((state) => state.order);

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
      toast.success("Order deleted successfully");
      dispatch({ type: DELETE_ORDER_RESET });
    }
    dispatch(getAllOrders());
  }, [dispatch, error, deleteError, isDeleted]);

  const deleteHandler = (id) => {
    if (window.confirm("Delete this order?")) {
      dispatch(deleteOrder(id));
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <h2>Orders ({orders?.length || 0})</h2>

        {loading ? (
          <Loader />
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Status</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders &&
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.orderStatus}</td>
                      <td>{order.orderItems.length}</td>
                      <td>₹{order.totalPrice}</td>
                      <td>
                        <div className="admin-actions">
                          <Link to={`/admin/order/${order._id}`} className="edit-icon">
                            <i className="fa fa-pen"></i>
                          </Link>
                          <button className="delete-icon" onClick={() => deleteHandler(order._id)}>
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

export default OrderList;
