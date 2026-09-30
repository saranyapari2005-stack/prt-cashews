import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOrderDetails, updateOrder, clearErrors } from "../../actions/orderAction";
import { toast } from "react-toastify";
import Loader from "../layout/Loader/Loader";
import Sidebar from "./Sidebar";
import "./Admin.css";
import { UPDATE_ORDER_RESET } from "../../constants/actionTypes";

const ProcessOrder = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { order, loading } = useSelector((state) => state.orderDetails);
  const { error, isUpdated } = useSelector((state) => state.order);

  const [status, setStatus] = useState("");

  useEffect(() => {
    dispatch(getOrderDetails(id));
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      toast.success("Order updated successfully");
      dispatch({ type: UPDATE_ORDER_RESET });
      dispatch(getOrderDetails(id));
    }
  }, [dispatch, id, error, isUpdated]);

  const updateOrderHandler = (e) => {
    e.preventDefault();
    dispatch(updateOrder(id, { status }));
  };

  if (loading || !order || !order._id) return <div className="admin-layout"><Sidebar /><Loader /></div>;

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <h2>Order #{order._id}</h2>

        <div className="admin-form" style={{ marginBottom: "1.5rem" }}>
          <p><b>Customer:</b> {order.user?.name} ({order.user?.email})</p>
          <p>
            <b>Address:</b> {order.shippingInfo?.address}, {order.shippingInfo?.city},{" "}
            {order.shippingInfo?.state} - {order.shippingInfo?.pinCode}
          </p>
          <p><b>Payment:</b> {order.paymentInfo?.status}</p>
          <p><b>Total:</b> ₹{order.totalPrice}</p>
        </div>

        <div className="admin-form">
          <h3>Order Items</h3>
          {order.orderItems?.map((item) => (
            <p key={item.product}>{item.name} x {item.quantity} = ₹{item.price * item.quantity}</p>
          ))}
        </div>

        <form className="admin-form" onSubmit={updateOrderHandler} style={{ marginTop: "1.5rem" }}>
          <h3>Update Status</h3>
          <select value={status || order.orderStatus} onChange={(e) => setStatus(e.target.value)}>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
          <button type="submit">Update Status</button>
        </form>
      </div>
    </div>
  );
};

export default ProcessOrder;
