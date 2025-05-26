import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./Confirmation.css";

const Confirmation = () => {
  const location = useLocation();
  const { order } = location.state || {}; 

  if (!order) {
    return (
      <div className="confirmation-page">
        <h2>Order Confirmation</h2>
        <p>No order details found. Something went wrong.</p>
        <Link to="/" className="btn-primary">
          Go to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <h2>Thank You For Your Order!</h2>
      <p>Your order has been placed successfully.</p>

      <div className="order-summary">
        <h3>Order Summary</h3>
        <p>
          <strong>Order Placed:</strong>{" "}
          {new Date(order.timestamp).toLocaleString()}
        </p>
        <p>
          <strong>Payment Method:</strong>{" "}
          {order.paymentMethod === "card" ? "Credit Card" : "Swish"}
        </p>

        <h4>Delivery To:</h4>
        <p>{order.deliveryAddress.name}</p>
        <p>
          {order.deliveryAddress.street} {order.deliveryAddress.houseNumber}
        </p>
        <p>
          {order.deliveryAddress.city}, {order.deliveryAddress.zipCode}
        </p>

        <h4>Items:</h4>
        <ul className="order-items-list">
          {order.items.map((item) => (
            <li key={item.id}>
              {item.name} (x{item.quantity}) - $
              {(item.price * item.quantity).toFixed(2)}
            </li>
          ))}
        </ul>
        <p className="order-total">
          <strong>Total Paid:</strong> ${order.total.toFixed(2)}
        </p>
      </div>

      <Link to="/menu" className="btn-primary">
        Continue Shopping
      </Link>
    </div>
  );
};

export default Confirmation;
