import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  if (cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your Cart is Empty</h2>
        <p>Add some delicious items from our menu!</p>
        <Link to="/menu" className="btn-primary">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      
      <div className="cart-items">
        {cart.items.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p className="cart-item-price">${item.price.toFixed(2)}</p>
            </div>
            <div className="cart-item-quantity">
              <button onClick={() => removeFromCart(item)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => addToCart(item)}>+</button>
            </div>
            <div className="cart-item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="cart-total">
          <span>Total ({cart.totalItems} items):</span>
          <span className="total-price">${cart.totalPrice.toFixed(2)}</span>
        </div>
        <button 
          className="btn-checkout" 
          onClick={() => navigate('/payment')}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;