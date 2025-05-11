
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedReviews } from '../slice/reviewSlice';
import './TopReviews.css';

const TopReviews = () => {
  const dispatch = useDispatch();
  const { reviews, loading, error } = useSelector(state => state.reviews);

  const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star' : 'star empty'}></span>
      );
    }
    return <div className="top-review-rating">{stars}</div>;
  };

  useEffect(() => {
    dispatch(fetchFeaturedReviews());
  }, [dispatch]);

  if (loading) return <div>Loading top reviews...</div>;
  if (error) return <div>Error loading top reviews: {error}</div>;

  return (
    <div className="top-reviews-card">
      <h2>Top Reviews</h2>
      <div className="top-reviews-list">
        {reviews && reviews.length > 0 ? (
          reviews.map(review => (
            <div key={review.id} className="top-review-item">
              <h3>{review.user?.username || 'Anonymous'}</h3>
              <StarRating rating={review.rating} />
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p>No top reviews available.</p>
        )}
      </div>
    </div>
  );
};

export default TopReviews;
