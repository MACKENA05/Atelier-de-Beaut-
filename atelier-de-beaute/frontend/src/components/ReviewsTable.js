import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews, deleteReview } from '../slice/reviewSlice';

const ReviewsTable = () => {
  const dispatch = useDispatch();
  const reviews = useSelector(state => state.review.reviews);
  const loading = useSelector(state => state.review.loading);
  const error = useSelector(state => state.review.error);

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  const handleDeleteReview = (id) => {
    if(window.confirm('Are you sure you want to delete this review?')) {
      dispatch(deleteReview(id));
    }
  };

  return (
    <div>
      <h2>Reviews</h2>
      {loading && <p>Loading reviews...</p>}
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
      <table border="1" cellPadding="8" cellSpacing="0" style={{width: '100%', marginBottom: '1rem'}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Product</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews && reviews.map(review => (
            <tr key={review.id}>
              <td>{review.id}</td>
              <td>{review.user?.username || review.user?.email || 'N/A'}</td>
              <td>{review.product?.name || 'N/A'}</td>
              <td>{review.rating}</td>
              <td>{review.comment}</td>
              <td>
                <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewsTable;
