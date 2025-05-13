import React from 'react';
import { useNavigate } from 'react-router-dom';
import FeaturedProducts from './FeaturedProducts';
import TopReviews from './TopReviews';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  
  const handleShopClick = () => {
    navigate('/shop');
  };
  
  return (
    <div className="landing-page-container">
      <div className="video-background-card">
        <video className="landing-video" autoPlay loop muted>
          <source src="/assets/landingpage1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <button
          onClick={handleShopClick}
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            padding: '10px 20px',
            fontSize: '1rem',
            backgroundColor: '#cc6c9c',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          Shop
        </button>
      </div>
      <div className="cards-container">
        <FeaturedProducts />
        <TopReviews />
      </div>
    </div>
  );
};

export default LandingPage;
