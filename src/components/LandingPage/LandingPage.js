import React from 'react';
import Hero from './Hero';
import PopularItems from './PopularItems';
import './css/LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Hero />
      <PopularItems />
    </div>
  );
};

export default LandingPage;