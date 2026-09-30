import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAdminProducts } from "../../actions/productAction";
import { getAllOrders } from "../../actions/orderAction";
import { getAllUsers } from "../../actions/userAction";
import Sidebar from "./Sidebar";
import "./Admin.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { orders, totalAmount } = useSelector((state) => state.allOrders);
  const { users } = useSelector((state) => state.allUsers);

  useEffect(() => {
    dispatch(getAdminProducts());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  const outOfStock = products?.filter((p) => p.stock === 0).length || 0;

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <h2>Dashboard</h2>
        <div className="admin-stats">
          <div className="admin-stat-card">
            <h4>Total Revenue</h4>
            <p>₹{totalAmount || 0}</p>
          </div>
          <div className="admin-stat-card">
            <h4>Products</h4>
            <p>{products?.length || 0}</p>
          </div>
          <div className="admin-stat-card">
            <h4>Orders</h4>
            <p>{orders?.length || 0}</p>
          </div>
          <div className="admin-stat-card">
            <h4>Users</h4>
            <p>{users?.length || 0}</p>
          </div>
          <div className="admin-stat-card">
            <h4>Out of Stock</h4>
            <p style={{ color: outOfStock > 0 ? "#c0392b" : "#3e2a1c" }}>{outOfStock}</p>
          </div>
        </div>

        <p>
          Need to change a price? Go to <Link to="/admin/products">Products</Link>, click the edit
          icon next to any item, update the price, and save — it goes live immediately.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
