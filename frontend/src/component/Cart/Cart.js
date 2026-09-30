import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addItemsToCart, removeItemsFromCart } from "../../actions/cartAction";
import "./Cart.css";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);

  // Rebuild the variant object (if any) from the cart line so quantity
  // changes keep using the same weight/price/stock the item was added with.
  const variantOf = (item) =>
    item.variant ? { label: item.variant, price: item.price, stock: item.stock } : null;

  const increaseQty = (item) => {
    if (item.quantity >= item.stock) return;
    dispatch(addItemsToCart(item.product, item.quantity + 1, variantOf(item)));
  };

  const decreaseQty = (item) => {
    if (item.quantity <= 1) return;
    dispatch(addItemsToCart(item.product, item.quantity - 1, variantOf(item)));
  };

  const removeItem = (item) => {
    dispatch(removeItemsFromCart(item.product, item.variant));
  };

  const checkoutHandler = () => {
    navigate("/shipping");
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <i className="fa fa-shopping-cart"></i>
        <p>Your cart is empty</p>
        <Link to="/products">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-items">
        {cartItems.map((item) => (
          <div className="cart-item" key={`${item.product}-${item.variant || "default"}`}>
            <img src={item.image} alt={item.name} />
            <div className="cart-item-info">
              <Link to={`/product/${item.product}`}>{item.name}</Link>
              {item.variant && <span className="cart-item-variant">{item.variant}</span>}
              <span className="cart-item-price">₹{item.price}</span>
            </div>
            <div className="cart-item-qty">
              <button onClick={() => decreaseQty(item)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => increaseQty(item)}>+</button>
            </div>
            <span className="cart-item-subtotal">₹{item.price * item.quantity}</span>
            <button className="cart-item-remove" onClick={() => removeItem(item)}>
              <i className="fa fa-trash"></i>
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Order Summary</h3>
        <div className="cart-summary-row">
          <span>Subtotal</span>
          <span>₹{totalPrice}</span>
        </div>
        <button className="checkout-btn" onClick={checkoutHandler}>Checkout</button>
      </div>
    </div>
  );
};

export default Cart;