import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingInfo } from "../../actions/cartAction";
import { toast } from "react-toastify";
import CheckoutSteps from "./CheckoutSteps";
import "./Shipping.css";

const countries = ["India", "United States", "United Kingdom", "Australia", "Canada"];

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingInfo } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingInfo.address || "");
  const [city, setCity] = useState(shippingInfo.city || "");
  const [state, setStateVal] = useState(shippingInfo.state || "");
  const [country, setCountry] = useState(shippingInfo.country || "India");
  const [pinCode, setPinCode] = useState(shippingInfo.pinCode || "");
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || "");

  const submitHandler = (e) => {
    e.preventDefault();

    if (phoneNo.length !== 10) {
      toast.error("Phone number should be 10 digits");
      return;
    }

    dispatch(saveShippingInfo({ address, city, state, country, pinCode, phoneNo }));
    navigate("/order/confirm");
  };

  return (
    <>
      <CheckoutSteps activeStep={0} />
      <div className="shipping-form-wrapper">
        <form className="shipping-form" onSubmit={submitHandler}>
          <h2>Shipping Details</h2>

          <input type="text" placeholder="Address" required value={address} onChange={(e) => setAddress(e.target.value)} />
          <input type="text" placeholder="City" required value={city} onChange={(e) => setCity(e.target.value)} />
          <input type="text" placeholder="State" required value={state} onChange={(e) => setStateVal(e.target.value)} />
          <input type="number" placeholder="Pin Code" required value={pinCode} onChange={(e) => setPinCode(e.target.value)} />
          <input
            type="number"
            placeholder="Phone Number"
            required
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
          />
          <select value={country} onChange={(e) => setCountry(e.target.value)} required>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button type="submit">Continue</button>
        </form>
      </div>
    </>
  );
};

export default Shipping;
