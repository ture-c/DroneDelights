import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import "./Cart.css";

const Cart = () => {
  const cartContextValue = useCart(); // Hämta hela kontextvärdet först
  const navigate = useNavigate();

  // felsökning
  console.log(
    "Cart.js: cartContextValue received from useCart():",
    cartContextValue
  );

  // Kontrollera om cartContextValue är odefinierat innan destrukturering
  if (!cartContextValue) {
    // Detta bör helst inte hända om CartProvider är korrekt konfigurerad
    console.error("Cart.js: CartContext value is undefined!");
    return <div>Loading cart or error...</div>; 
  }

  // Destrukturera nu säkert
  const { cartItems, totalItems, totalPrice, removeFromCart, updateQuantity } =
    cartContextValue;

  // felsökning
  console.log("Cart.js: Destructured cartItems:", cartItems);
  console.log("Cart.js: Destructured totalItems:", totalItems);

  if (!cartItems) {
    console.error("Cart.js: cartItems is undefined after destructuring!");
    return (
      <div>
        Your cart is currently empty or there was an issue loading items.
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your Cart is Empty</h2>
        <p>Add some delicious items from our menu!</p>
        <Link to="/menu" className="btn-primary">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p className="cart-item-price">${item.price.toFixed(2)}</p>
            </div>
            <div className="cart-item-quantity">
              <button onClick={() => removeFromCart(item)}>-</button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <div className="cart-item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Total Items: {totalItems}</h3>
        <h3>Total Price: kr{totalPrice ? totalPrice.toFixed(2) : "0.00"}</h3>
        {cartItems.length > 0 && (
          <Link to="/payment" className="btn-checkout">
            Proceed to Checkout
          </Link>
        )}
      </div>
    </div>
  );
};

export default Cart;

