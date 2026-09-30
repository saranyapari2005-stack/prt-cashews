import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createOrder } from "../../actions/orderAction";
import CheckoutSteps from "./CheckoutSteps";
import "./ConfirmOrder.css";

// Your WhatsApp business number in international format, no + or spaces.
// e.g. India number 98765 43210 -> "919876543210"
const WHATSAPP_NUMBER = process.env.REACT_APP_WHATSAPP_NUMBER || "911234567890";

const ConfirmOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const shippingCharges = subtotal > 1000 ? 0 : 60;
  const totalPrice = subtotal + shippingCharges;

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.country} - ${shippingInfo.pinCode}`;

  const buildWhatsAppMessage = () => {
    const itemLines = cartItems
      .map((item) => `- ${item.name}${item.variant ? ` (${item.variant})` : ""} x${item.quantity} = ₹${item.quantity * item.price}`)
      .join("\n");

    return (
      `Hi, I'd like to place an order:\n\n` +
      `${itemLines}\n\n` +
      `Subtotal: ₹${subtotal}\n` +
      `Shipping: ₹${shippingCharges}\n` +
      `Total: ₹${totalPrice}\n\n` +
      `Name: ${user?.name || ""}\n` +
      `Phone: ${shippingInfo.phoneNo}\n` +
      `Delivery Address: ${address}\n\n` +
      `Please confirm and share payment details.`
    );
  };

  const placeOrderHandler = () => {
    // Save the order in your database as unpaid / COD so you keep a record,
    // even though payment itself is handled manually over WhatsApp.
    const order = {
      shippingInfo,
      orderItems: cartItems.map((item) => ({
        name: item.variant ? `${item.name} (${item.variant})` : item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        product: item.product,
      })),
      paymentInfo: { id: "WHATSAPP_COD", status: "Not Paid" },
      itemsPrice: subtotal,
      taxPrice: 0,
      shippingPrice: shippingCharges,
      totalPrice,
    };

    dispatch(createOrder(order));

    const message = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");

    navigate("/success");
  };

  return (
    <>
      <CheckoutSteps activeStep={1} />
      <div className="confirm-order-page">
        <div className="confirm-order-left">
          <div className="confirm-block">
            <h3>Shipping Info</h3>
            <p><b>Name:</b> {user?.name}</p>
            <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
            <p><b>Address:</b> {address}</p>
          </div>

          <div className="confirm-block">
            <h3>Your Cart Items</h3>
            {cartItems.map((item) => (
              <div className="confirm-cart-item" key={item.product}>
                <img src={item.image} alt={item.name} />
                <Link to={`/product/${item.product}`}>{item.name}</Link>
                <span>{item.quantity} x ₹{item.price} = <b>₹{item.quantity * item.price}</b></span>
              </div>
            ))}
          </div>
        </div>

        <div className="confirm-order-summary">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div className="summary-row"><span>Shipping</span><span>₹{shippingCharges}</span></div>
          <div className="summary-row total"><span>Total</span><span>₹{totalPrice}</span></div>
          <button className="whatsapp-btn" onClick={placeOrderHandler}>
            <i className="fa fa-whatsapp"></i> Order via WhatsApp
          </button>
          <p className="whatsapp-note">
            This opens WhatsApp with your order pre-filled. Just hit send — we'll confirm
            payment details with you there.
          </p>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;