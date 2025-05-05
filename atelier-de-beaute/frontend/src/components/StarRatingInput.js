import React, { useState } from 'react';
import './StarRating.css';

const StarRatingInput = ({ rating, setRating }) => {
  const [hover, setHover] = useState(0);
  const totalStars = 5;

  return (
    <div className="star-rating-input">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        const starClass = starValue <= (hover || rating) ? 'star filled' : 'star';
        return (
          <span
            key={index}
            className={starClass}
            onClick={() => setRating(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setRating(starValue);
              }
            }}
            aria-label={`${starValue} Star`}
          >
            &#9733;
          </span>
        );
      })}
    </div>
  );
};

export default StarRatingInput;
