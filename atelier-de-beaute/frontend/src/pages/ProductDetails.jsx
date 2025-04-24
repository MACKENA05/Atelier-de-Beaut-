import React, { useState } from 'react';
import './ProductDetails.css';

const mockProduct = {
  id: 1,
  name: 'Luxury Face Cream',
  description:
    'A luxurious face cream that hydrates and rejuvenates your skin for a radiant glow.',
  price: 49.99,
  image: 'https://via.placeholder.com/300',
  reviews: [
    { id: 1, user: 'Alice', comment: 'Amazing product!', rating: 5 },
    { id: 2, user: 'Bob', comment: 'Very moisturizing.', rating: 4 },
  ],
};

const ProductDetails = () => {
  const [product, setProduct] = useState(mockProduct);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ user: '', comment: '', rating: 5 });

  const addToCart = () => {
    alert(`Added ${quantity} of ${product.name} to cart! (Mock)`);
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const submitReview = (e) => {
    e.preventDefault();
    if (!newReview.user.trim() || !newReview.comment.trim()) {
      alert('Please enter your name and comment.');
      return;
    }
    const reviewToAdd = {
      id: product.reviews.length + 1,
      user: newReview.user.trim(),
      comment: newReview.comment.trim(),
      rating: parseInt(newReview.rating),
    };
    setProduct((prev) => ({
      ...prev,
      reviews: [...prev.reviews, reviewToAdd],
    }));
    setNewReview({ user: '', comment: '', rating: 5 });
  };

  return (
    <div className="container">
      <h1 className="title">{product.name}</h1>
      <div className="content">
        <img src={product.image} alt={product.name} className="image" />
        <div className="details">
          <p className="description">{product.description}</p>
          <p className="price">${product.price.toFixed(2)}</p>
          <div className="quantity-container">
            <label htmlFor="quantity" className="label">
              Quantity:
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
              className="quantity-input"
            />
          </div>
          <button className="button" onClick={addToCart}>
            Add to Cart
          </button>
          <div className="reviews">
            <h2 className="reviews-title">Reviews</h2>
            {product.reviews.map(({ id, user, comment, rating }) => (
              <div key={id} className="review">
                <strong>{user}</strong> - {rating}⭐
                <p>{comment}</p>
              </div>
            ))}
            <form onSubmit={submitReview} className="review-form">
              <h3 className="form-title">Submit Your Review</h3>
              <input
                type="text"
                name="user"
                placeholder="Your Name"
                value={newReview.user}
                onChange={handleReviewChange}
                className="input"
                required
              />
              <textarea
                name="comment"
                placeholder="Your Review"
                value={newReview.comment}
                onChange={handleReviewChange}
                className="textarea"
                required
              />
              <label className="rating-label">
                Rating:
                <select
                  name="rating"
                  value={newReview.rating}
                  onChange={handleReviewChange}
                  className="select"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} Star{r > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit" className="submit-button">
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
