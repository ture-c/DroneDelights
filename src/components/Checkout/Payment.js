import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import "./Payment.css";

const Payment = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: currentUser?.username || "",
    email: currentUser?.email || "",
    street: currentUser?.address?.street || "",
    houseNumber: currentUser?.address?.houseNumber || "",
    city: currentUser?.address?.city || "",
    zipCode: currentUser?.address?.zipCode || "",
    phone: currentUser?.address?.phone || currentUser?.phone || "",
    paymentMethod: "card",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      paymentMethod: e.target.value,
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (
      !formData.name ||
      !formData.street ||
      !formData.city ||
      !formData.zipCode ||
      !formData.email
    ) {
      setError("Please fill in all required delivery details.");
      setLoading(false);
      return;
    }
    if (formData.paymentMethod === "card") {
      if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvc) {
        setError("Please fill in all card details.");
        setLoading(false);
        return;
      }
    }
    if (formData.paymentMethod === "swish" && !formData.phone) {
      setError("Please provide a phone number for Swish payment.");
      setLoading(false);
      return;
    }

    console.log("Processing payment with:", formData);
    console.log("Order items:", cartItems);
    console.log("Total price:", totalPrice);

    setTimeout(() => {
      setLoading(false);
      const orderDetails = {
        items: [...cartItems],
        total: totalPrice,
        deliveryAddress: {
          name: formData.name,
          street: formData.street,
          houseNumber: formData.houseNumber,
          city: formData.city,
          zipCode: formData.zipCode,
        },
        paymentMethod: formData.paymentMethod,
        timestamp: new Date().toISOString(),
      };

      clearCart();
      navigate("/confirmation", { state: { order: orderDetails } });
    }, 2000); // Två sekunders väntan
  };

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="payment-page">
        <h2>Payment</h2>
        <p>
          Your cart is empty. Please add items to your cart before proceeding to
          payment.
        </p>
        <button onClick={() => navigate("/menu")} className="btn-primary">
          Go to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <h2>Checkout</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="payment-form">
        <section className="delivery-details">
          <h3>Delivery Details</h3>
          <div className="form-group">
            <label htmlFor="name">Full Name*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="street">Street Name*</label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="houseNumber">House Number</label>
            <input
              type="text"
              id="houseNumber"
              name="houseNumber"
              value={formData.houseNumber}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City*</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="zipCode">Zip Code*</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </section>

        <section className="payment-method">
          <h3>Payment Method</h3>
          <div className="form-group-radio">
            <input
              type="radio"
              id="paymentCard"
              name="paymentMethod"
              value="card"
              checked={formData.paymentMethod === "card"}
              onChange={handlePaymentMethodChange}
            />
            <label htmlFor="paymentCard">Card</label>
          </div>
          <div className="form-group-radio">
            <input
              type="radio"
              id="paymentSwish"
              name="paymentMethod"
              value="swish"
              checked={formData.paymentMethod === "swish"}
              onChange={handlePaymentMethodChange}
            />
            <label htmlFor="paymentSwish">Swish</label>
          </div>

          {formData.paymentMethod === "card" && (
            <div className="card-details">
              <h4>Card Details</h4>
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number*</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="0000 0000 0000 0000"
                  required={formData.paymentMethod === "card"}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cardExpiry">Expiry Date (MM/YY)*</label>
                  <input
                    type="text"
                    id="cardExpiry"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    required={formData.paymentMethod === "card"}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cardCvc">CVC*</label>
                  <input
                    type="text"
                    id="cardCvc"
                    name="cardCvc"
                    value={formData.cardCvc}
                    onChange={handleChange}
                    placeholder="123"
                    required={formData.paymentMethod === "card"}
                  />
                </div>
              </div>
            </div>
          )}

          {formData.paymentMethod === "swish" && (
            <div className="swish-details">
              <h4>Swish Payment</h4>
              <p>
                You will be prompted to complete the payment in your Swish app
                using the phone number:{" "}
                <strong>
                  {formData.phone || "(Please enter phone number above)"}
                </strong>
                .
              </p>
              {!formData.phone && (
                <p className="error-message-inline">
                  A phone number is required for Swish.
                </p>
              )}
            </div>
          )}
        </section>

        <div className="payment-summary">
          <h3>Order Total: ${totalPrice.toFixed(2)}</h3>
        </div>

        <button type="submit" className="btn-submit-payment" disabled={loading}>
          {loading ? "Processing..." : `Pay $${totalPrice.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
};

export default Payment;
