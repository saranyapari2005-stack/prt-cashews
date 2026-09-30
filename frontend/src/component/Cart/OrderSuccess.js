import React from "react";
import { Link } from "react-router-dom";
import "./OrderSuccess.css";

const OrderSuccess = () => (
  <div className="order-success-page">
    <i className="fa fa-check-circle"></i>
    <h2>Your order has been placed successfully!</h2>
    <Link to="/orders">View Orders</Link>
  </div>
);

export default OrderSuccess;
