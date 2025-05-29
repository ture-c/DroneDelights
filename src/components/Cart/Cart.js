import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import "./Cart.css";

const Cart = () => {
  const cartContextValue = useCart();
  const navigate = useNavigate();

  if (!cartContextValue) {
    console.error("Cart.js: CartContext value is undefined!");
    return <div>Loading cart or error...</div>;
  }

  const {
    cartItems,
    totalPrice,
    removeFromCart,
    updateQuantity,
  } = // totalItems borttagen om den inte används direkt här
    cartContextValue;

  if (!cartItems) {
    console.error("Cart.js: cartItems is undefined after destructuring!");
    return (
      <div>
        Your cart is currently empty or there was an issue loading items.
      </div>
    );
  }

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) {
      updateQuantity(item.id, 1);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  // Funktion för att ta bort ett objekt helt, oavsett kvantitet
  const handleRemoveItemCompletely = (itemId) => {
    const itemToRemove = cartItems.find((cartItem) => cartItem.id === itemId);
    if (itemToRemove) {
      removeFromCart(itemToRemove); 
    }
  };

  return (
    <div className="cart-page">
      <h1>Your Shopping Cart</h1>

      <div className="cart-main-area">
        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <h2>Your Cart is Empty</h2>
            <p>Add some delicious items from our menu!</p>
            <Link to="/menu" className="btn-primary">
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="cart-items">
            {cartItems.map((item) => {
              // Logga varje item här för att inspektera dess struktur
              console.log("Cart.js - Rendering item:", item);
              return (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.imageUrl || "/placeholder.jpg"} 
                    alt={item.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p className="cart-item-price">
                      ${item.price ? item.price.toFixed(2) : "N/A"}
                    </p>
                  </div>
                  <div className="cart-item-quantity">
                    <button
                      onClick={() =>
                        handleQuantityChange(item, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1} // Inaktivera om kvantitet är 1 för att inte gå under
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-item-total">
                    $
                    {item.price && item.quantity
                      ? (item.price * item.quantity).toFixed(2)
                      : "N/A"}
                  </div>
                  {/* Knapp för att ta bort hela produkten från varukorgen */}
                  <div className="cart-item-remove">
                    <button onClick={() => handleRemoveItemCompletely(item.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="cart-summary">
          <div className="cart-total">
            <span>Total:</span>
            <span className="total-price">
              ${totalPrice ? totalPrice.toFixed(2) : "0.00"}
            </span>
          </div>
          <button onClick={() => navigate("/payment")} className="btn-checkout">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
