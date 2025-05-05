import React from 'react';
import './StarRating.css';

const StarRating = ({ rating }) => {
  // rating is a number from 0 to 5
  const totalStars = 5;

  return (
    <div className="star-rating">
      {[...Array(totalStars)].map((_, index) => {
        const starClass = index < rating ? 'star filled' : 'star';
        return <span key={index} className={starClass}>&#9733;</span>; // Unicode star character
      })}
    </div>
  );
};

export default StarRating;
