import React, { useState } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../actions/userAction";
import { toast } from "react-toastify";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [logoFailed, setLogoFailed] = useState(false);

  const logoutHandler = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/");
  };

  const searchSubmitHandler = (e) => {
    e.preventDefault();

    navigate(
      searchKeyword.trim()
        ? `/products/${searchKeyword}`
        : "/products"
    );
  };

  return (
    <nav className="header">

      {/* Logo */}
      <div className="header-left">
        <Link to="/" className="header-logo">
          {!logoFailed ? (
            <img
              src="/logo.png"
              alt="PRT Cashews"
              className="header-logo-img"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            "🥜 PRT Cashews"
          )}
        </Link>
      </div>

      {/* Search */}
      <form className="header-search" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search almonds, cashews, dates..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />

        <button type="submit">
          <i className="fa fa-search"></i>
        </button>
      </form>

      {/* Right side */}
      <div className="header-right">

        <Link to="/products" className="header-link">
          Shop
        </Link>

        <Link to="/cart" className="header-link cart-link">
          <i className="fa fa-shopping-cart"></i>

          {cartItems.length > 0 && (
            <span className="cart-count">
              {cartItems.length}
            </span>
          )}
        </Link>

        {isAuthenticated ? (
          <div className="header-profile">

            <button
              className="header-avatar-btn"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <img
                src={
                  user?.avatar?.url ||
                  "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg"
                }
                alt={user?.name || "User"}
              />

              <span>{user?.name}</span>
            </button>

            {menuOpen && (
              <div className="header-dropdown">

                {/* Admin Dashboard */}
                {user?.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}

                {/* Profile */}
                <Link
                  to="/account"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>

                {/* Orders */}
                <Link
                  to="/orders"
                  onClick={() => setMenuOpen(false)}
                >
                  Orders
                </Link>

                {/* Logout */}
                <button onClick={logoutHandler}>
                  Logout
                </button>

              </div>
            )}

          </div>
        ) : (
          <Link to="/login" className="header-link">
            Login
          </Link>
        )}

      </div>
    </nav>
  );
};

export default Header;