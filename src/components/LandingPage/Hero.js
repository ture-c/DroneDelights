import './css/Hero.css';

const Hero = () => {
  return (
    <div className="hero-container">
      <div className="hero-overlay">
        <div className="hero-content">
          <div className="logo-placeholder">
            <img src='../../images/Logo.png' alt="Drone Delights Logo" style={{ width: '120px', height: '120px', borderRadius: '50%' }} />
          </div>
          <h1 className="hero-title">Drone Delights</h1>
          <p className="hero-slogan">Meals delivered at drone strike speed</p>
          <button className="order-now-btn">Order Now</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;