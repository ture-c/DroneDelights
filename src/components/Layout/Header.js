import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">Drone Delights</Link>
        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item"><Link to="/">Home</Link></li>
            <li className="nav-item"><Link to="/menu">Menu</Link></li>
            {currentUser ? (
              <>
                <li className="nav-item">
                  <span className="user-greeting">Hello, {currentUser.name}</span>
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
      </div>
    </header>
  );
};

export default Header;