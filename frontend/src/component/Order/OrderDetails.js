import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOrderDetails, clearErrors } from "../../actions/orderAction";
import { toast } from "react-toastify";
import Loader from "../layout/Loader/Loader";
import "./Orders.css";

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { loading, error, order } = useSelector((state) => state.orderDetails);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getOrderDetails(id));
  }, [dispatch, id, error]);

  if (loading || !order || !order._id) return <Loader />;

  return (
    <div className="order-details-page">
      <h2>Order #{order._id}</h2>

      <div className="order-details-block">
        <h3>Shipping Info</h3>
        <p><b>Name:</b> {order.user?.name}</p>
        <p><b>Phone:</b> {order.shippingInfo?.phoneNo}</p>
        <p>
          <b>Address:</b> {order.shippingInfo?.address}, {order.shippingInfo?.city},{" "}
          {order.shippingInfo?.state}, {order.shippingInfo?.country} - {order.shippingInfo?.pinCode}
        </p>
        <p>
          <b>Payment:</b>{" "}
          <span style={{ color: order.paymentInfo?.status === "succeeded" ? "green" : "red" }}>
            {order.paymentInfo?.status === "succeeded" ? "PAID" : "NOT PAID"}
          </span>
        </p>
        <p><b>Order Status:</b> {order.orderStatus}</p>
      </div>

      <div className="order-details-block">
        <h3>Order Items</h3>
        {order.orderItems?.map((item) => (
          <div className="order-details-item" key={item.product}>
            <img src={item.image} alt={item.name} />
            <span>{item.name}</span>
            <span>{item.quantity} x ₹{item.price} = ₹{item.quantity * item.price}</span>
          </div>
        ))}
      </div>

      <div className="order-details-block">
        <h3>Order Summary</h3>
        <p>Items: ₹{order.itemsPrice}</p>
        <p>Shipping: ₹{order.shippingPrice}</p>
        <p>Tax: ₹{order.taxPrice}</p>
        <p><b>Total: ₹{order.totalPrice}</b></p>
      </div>
    </div>
  );
};

export default OrderDetails;
