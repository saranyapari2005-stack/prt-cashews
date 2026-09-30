import React from "react";
import "./CheckoutSteps.css";

const CheckoutSteps = ({ activeStep = 0 }) => {
  const steps = ["Shipping Info", "Confirm & Send Order"];
  return (
    <div className="checkout-steps">
      {steps.map((step, i) => (
        <div key={step} className={`checkout-step ${i <= activeStep ? "active" : ""}`}>
          <span className="checkout-step-num">{i + 1}</span>
          <span>{step}</span>
        </div>
      ))}
    </div>
  );
};

export default CheckoutSteps;
