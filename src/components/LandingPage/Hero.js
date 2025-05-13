import React from 'react';
import '../../components/LandingPage/css/Hero.css';

const Hero = () => {
  return (
    <div className="hero-container">
      <div className="hero-overlay">
        <div className="hero-content">
          <div className="logo-placeholder" style={{ width: '120px', height: '120px', background: '#f8b500', margin: '0 auto 20px', borderRadius: '50%' }}></div>
          <h1 className="hero-title">Drone Delights</h1>
          <p className="hero-slogan">Gourmet meals delivered at lightning speed</p>
          <button className="order-now-btn">Order Now</button>
        </div>
      </div>
      <div className="hero-image-container" style={{ backgroundColor: '#282c34' }}>
        {/* Placeholder for hero image */}
      </div>
    </div>
  );
};

export default Hero;