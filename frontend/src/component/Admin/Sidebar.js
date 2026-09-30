import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => (
  <div className="admin-sidebar">
    <h3>Admin Panel</h3>
    <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
      <i className="fa fa-dashboard"></i> Dashboard
    </NavLink>
    <NavLink to="/admin/products" className={({ isActive }) => (isActive ? "active" : "")}>
      <i className="fa fa-box"></i> Products
    </NavLink>
    <NavLink to="/admin/product/new" className={({ isActive }) => (isActive ? "active" : "")}>
      <i className="fa fa-plus"></i> New Product
    </NavLink>
    <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? "active" : "")}>
      <i className="fa fa-list"></i> Orders
    </NavLink>
    <NavLink to="/admin/users" className={({ isActive }) => (isActive ? "active" : "")}>
      <i className="fa fa-users"></i> Users
    </NavLink>
    <NavLink to="/admin/reviews" className={({ isActive }) => (isActive ? "active" : "")}>
      <i className="fa fa-star"></i> Reviews
    </NavLink>
  </div>
);

export default Sidebar;
