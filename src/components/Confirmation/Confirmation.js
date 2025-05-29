import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Confirmation.css";

const Confirmation = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Hämta order details från sessionStorage
    const storedOrderDetails = sessionStorage.getItem("orderDetails");

    if (!storedOrderDetails) {
      // Inga order details, redirect to home
      navigate("/");
      return;
    }

    setOrderDetails(JSON.parse(storedOrderDetails));

  }, [navigate]);

  if (!orderDetails) {
    return null; // Kommer inte att rendera något om orderDetails inte finns
  }

  return (
    <div className="confirmation-page">
      

      <div className="confirmation-content">
        <div className="confirmation-icon">
          <i className="fas fa-check-circle"></i>
        </div>

        <h1>Thank You for Your Order!</h1>

        <div className="order-info">
          <p className="order-id">Order #{orderDetails.orderId}</p>
          <p className="estimated-delivery">
            Estimated delivery: <span>{orderDetails.estimatedDelivery}</span>
          </p>
        </div>

        <div className="confirmation-details">
          <div className="detail-section">
            <h3>Delivery Address</h3>
            <p>{orderDetails.deliveryAddress.name}</p>
            <p>{orderDetails.deliveryAddress.street}</p>
            <p>
              {orderDetails.deliveryAddress.city},{" "}
              {orderDetails.deliveryAddress.postalCode}
            </p>
          </div>

          <div className="detail-section">
            <h3>Payment Method</h3>
            <p>
              {orderDetails.paymentMethod === "creditcard"
                ? "Credit Card"
                : "Swish"}
            </p>
          </div>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <ul className="ordered-items">
            {orderDetails.items.map((item) => (
              <li key={item.id} className="ordered-item">
                <span>
                  {item.quantity} × {item.name}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="ordered-total">
            <span>Total:</span>
            <span>${orderDetails.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="action-buttons">
          <Link to="/menu" className="btn-secondary">
            Order More Food
          </Link>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
