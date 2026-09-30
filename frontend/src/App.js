import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadUser } from "./actions/userAction";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./component/layout/Header/Header";
import Footer from "./component/layout/Footer/Footer";
import Home from "./component/Home/Home";
import ProductDetails from "./component/Product/ProductDetails";
import Products from "./component/Product/Products";
import Search from "./component/Product/Search";

import Login from "./component/User/Login";
import Register from "./component/User/Register";
import Profile from "./component/User/Profile";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword";

import Cart from "./component/Cart/Cart";
import Shipping from "./component/Cart/Shipping";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import OrderSuccess from "./component/Cart/OrderSuccess";

import MyOrders from "./component/Order/MyOrders";
import OrderDetails from "./component/Order/OrderDetails";

import Dashboard from "./component/Admin/Dashboard";
import ProductList from "./component/Admin/ProductList";
import NewProduct from "./component/Admin/NewProduct";
import UpdateProduct from "./component/Admin/UpdateProduct";
import OrderList from "./component/Admin/OrderList";
import ProcessOrder from "./component/Admin/ProcessOrder";
import UsersList from "./component/Admin/UsersList";
import UpdateUser from "./component/Admin/UpdateUser";
import ProductReviews from "./component/Admin/ProductReviews";

import ProtectedRoute from "./component/Route/ProtectedRoute";
import NotFound from "./component/NotFound/NotFound";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      <Header />
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:keyword" element={<Products />} />
          <Route path="/search" element={<Search />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/account" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/me/update" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
          <Route path="/password/update" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />

          <Route path="/shipping" element={<ProtectedRoute><Shipping /></ProtectedRoute>} />
          <Route path="/order/confirm" element={<ProtectedRoute><ConfirmOrder /></ProtectedRoute>} />
          <Route path="/success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />

          <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/order/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />

          <Route path="/admin/dashboard" element={<ProtectedRoute isAdmin={true}><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute isAdmin={true}><ProductList /></ProtectedRoute>} />
          <Route path="/admin/product/new" element={<ProtectedRoute isAdmin={true}><NewProduct /></ProtectedRoute>} />
          <Route path="/admin/product/:id" element={<ProtectedRoute isAdmin={true}><UpdateProduct /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute isAdmin={true}><OrderList /></ProtectedRoute>} />
          <Route path="/admin/order/:id" element={<ProtectedRoute isAdmin={true}><ProcessOrder /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute isAdmin={true}><UsersList /></ProtectedRoute>} />
          <Route path="/admin/user/:id" element={<ProtectedRoute isAdmin={true}><UpdateUser /></ProtectedRoute>} />
          <Route path="/admin/reviews" element={<ProtectedRoute isAdmin={true}><ProductReviews /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
