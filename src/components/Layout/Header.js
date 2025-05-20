import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 
import { useCart } from '../../contexts/CartContext';
import './Header.css';

const Header = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const { cart } = useCart();

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <img src="/images/logo.png" alt="Drone Delights" />
        </Link>
        
        <nav className="nav-container">
          <ul className="nav-list">
            <li className="nav-item"><Link to="/">Home</Link></li>
            <li className="nav-item"><Link to="/menu">Menu</Link></li>
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <span className="user-greeting">Hello, {user.username}!</span>
                </li>
                <li className="nav-item">
                  <button className="logout-btn" onClick={logout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link to="/login">Login</Link></li>
                <li className="nav-item"><Link to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </nav>
        
        <div className="cart-icon-container">
          <Link to="/cart" className="cart-icon-link">
            <div className="cart-icon">
              <i className="fas fa-shopping-cart"></i>
              {cart.totalItems > 0 && (
                <span className="cart-count">{cart.totalItems}</span>
              )}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;