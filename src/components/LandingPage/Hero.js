import './css/Hero.css';

const Hero = () => {
  return (
    <div className="hero-container">
      <div className="hero-overlay">
        <div className="hero-content">
          <div className="logo">
            <img src='../../images/Logo.png' alt="Drone Delights Logo"/>
          </div>
          <h1 className="hero-title"></h1> 
          <p className="hero-slogan">- "Idk slogan yet"</p>
         { /*<button className="order-now-btn">Order Now</button> */}
        </div>
      </div>
    </div>
  );
};

export default Hero;