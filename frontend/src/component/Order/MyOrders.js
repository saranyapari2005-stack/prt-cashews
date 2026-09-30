import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { myOrders, clearErrors } from "../../actions/orderAction";
import { toast } from "react-toastify";
import Loader from "../layout/Loader/Loader";
import "./Orders.css";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { loading, error, orders } = useSelector((state) => state.myOrders);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(myOrders());
  }, [dispatch, error]);

  if (loading) return <Loader />;

  return (
    <div className="orders-page">
      <h2>My Orders ({orders.length})</h2>

      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Status</th>
              <th>Items</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td className={`status-${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</td>
                <td>{order.orderItems.length}</td>
                <td>₹{order.totalPrice}</td>
                <td><Link to={`/order/${order._id}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrders;
