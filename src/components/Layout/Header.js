import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext"; // Import useCart
import "./Header.css";

const Header = () => {
  const { currentUser, logout, loadingAuth } = useAuth();
  const { totalItems } = useCart(); // Get totalItems from CartContext
  const navigate = useNavigate();

  console.log("Header: totalItems received from useCart():", totalItems); // Debug

  const handleLogout = async () => {
    await logout();
    navigate("/"); // Redirect to homepage after logout
  };

  if (loadingAuth) {
    return (
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container">
            <Link to="/" className="logo-link">
              <span className="logo-text">DroneDelights</span>
            </Link>
          </div>
          <nav className="main-nav">
            <div>Loading...</div>
          </nav>
        </div>
      </header>
    ); // Or some other loading indicator
  }

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <span className="logo-text">DroneDelights</span>
          </Link>
        </div>
        <nav className="main-nav">
          <ul>
            <li>
              <Link to="/menu">Menu</Link>
            </li>
            <li>
              <Link to="/cart" className="cart-link">
                Cart
                {totalItems > 0 && (
                  <span className="cart-notification-badge">{totalItems}</span>
                )}
              </Link>
            </li>
            {currentUser ? (
              <>
                <li className="user-greeting">
                  <span>Welcome, {currentUser.username}!</span>
                </li>
                <li>
                  <button onClick={handleLogout} className="logout-button">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
