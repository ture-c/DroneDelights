import './css/Hero.css';

const Hero = () => {
  return (
    <div className="hero-container">
      <div className="hero-overlay">
        <div className="hero-content">
          <div className="logo">
            <img src="../../images/Logo.png" alt="Drone Delights Logo" />
          </div>
          <h1 className="hero-title"></h1>
          <p className="hero-slogan">
            "We believe in a world free of human delivery. Where people order by drone when they
            want, whenever they want, because they love it."
          </p>
          {/*<button className="order-now-btn">Order Now</button> */}
        </div>
      </div>
    </div>
  );
};

export default Hero;