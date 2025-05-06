import React from 'react';
import FeaturedProducts from './FeaturedProducts';
import TopReviews from './TopReviews';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page-container">
      <div className="video-background-card">
        <video className="landing-video" autoPlay loop muted>
          <source src="/assets/landingpage1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="cards-container">
        <FeaturedProducts />
        <TopReviews />
      </div>
    </div>
  );
};

export default LandingPage;
