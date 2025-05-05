import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../slice/productSlice';
import { addToCart, removeFromCart, updateQuantity } from '../slice/cartSlice';
import StarRating from './StarRating';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { fetchReviewsByProduct, postReview } from '../slice/reviewSlice';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const products = useSelector(state => state.products.products);
  const product = products.find(p => p.id === parseInt(id));
  const user = useSelector(state => state.auth.user);
  const cartItems = useSelector(state => state.cart.items);
  const cartItem = cartItems.find(item => item.id === product?.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const { reviews, loading: reviewsLoading, error: reviewError } = useSelector(state => state.reviews);
  const averageRating = reviews && reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;

  const imageUrls = product && product.image_urls && product.image_urls.length > 0 ? product.image_urls : [];
  const [mainImage, setMainImage] = React.useState(imageUrls.length > 0 ? (typeof imageUrls[0] === 'string' ? imageUrls[0] : '') : '');

  useEffect(() => {
    if (!product) {
      dispatch(fetchProducts());
    }
    dispatch(fetchReviewsByProduct(id));
  }, [dispatch, id, product]);

  if (!product) return <div>Loading product details...</div>;

  const isOutOfStock = product.stock_quantity === 0;
  const discountPercent = product.discount_percentage || 0;

  const initialValues = {
    rating: 0,
    comment: ''
  };

  const validationSchema = Yup.object({
    rating: Yup.number().min(1, 'Please provide a rating between 1 and 5').max(5, 'Please provide a rating between 1 and 5').required('Required'),
    comment: Yup.string().required('Required')
  });

  const handleSubmit = (values, { resetForm }) => {
    if (!user) {
      alert('You must be logged in to submit a review.');
      return;
    }
    const reviewData = {
      user_id: user.id,
      product_id: id,
      rating: values.rating,
      comment: values.comment
    };
    dispatch(postReview({ productId: id, reviewData }))
      .unwrap()
      .then(() => {
        resetForm();
      });
    // No .catch here; error will be handled by reviewError state
  };

  return (
    <div className="product-detail-container">
      <div className="product-detail-image-section">
        {mainImage ? (
          <img src={mainImage} alt={product.name} className="product-detail-image" />
        ) : (
          <div className="no-image">No Image</div>
        )}
        {discountPercent > 0 && (
          <div className="discount-badge">{discountPercent}% OFF</div>
        )}
        {isOutOfStock && (
          <div className="out-of-stock-badge">Out of Stock</div>
        )}
        {imageUrls.length > 1 && (
          <div className="image-thumbnails">
            {imageUrls.map((img, idx) => {
              if (typeof img !== 'string') return null;
              return (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.name} ${idx + 1}`}
                  className={`thumbnail-image ${mainImage === img ? 'selected' : ''}`}
                  onClick={() => setMainImage(img)}
                />
              );
            })}
          </div>
        )}
      </div>
      <div className="product-detail-info-section">
        <h2 className="product-detail-name">{product.name}</h2>
        <div className="product-detail-brand">Brand: {product.brand}</div>
        <div className="product-detail-price">Price: ${product.price.toFixed(2)}</div>
        <div className="product-detail-quantity">Quantity: {product.stock_quantity}</div>
        <div className="product-detail-description">{product.description}</div>
        <div className="product-detail-rating">
          <StarRating rating={Math.round(averageRating)} />
          <span className="average-rating-text">{averageRating.toFixed(1)} / 5</span>
        </div>
        {quantityInCart === 0 ? (
          <button
            className="add-to-cart-button-detail"
            onClick={() => dispatch(addToCart(product))}
            disabled={isOutOfStock}
            title={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        ) : (
          <div className="quantity-control">
            <button
              className="quantity-button"
              onClick={() => {
                if (quantityInCart > 1) {
                  dispatch(updateQuantity({ id: product.id, quantity: quantityInCart - 1 }));
                } else {
                  dispatch(removeFromCart(product.id));
                }
              }}
              title="Decrease quantity"
            >
              -
            </button>
            <span className="quantity-display">{quantityInCart}</span>
            <button
              className="quantity-button"
              onClick={() => dispatch(updateQuantity({ id: product.id, quantity: quantityInCart + 1 }))}
              title="Increase quantity"
              disabled={quantityInCart >= product.stock_quantity}
            >
              +
            </button>
          </div>
        )}
        <div className="product-detail-reviews">
          <h3>Top Reviews</h3>
          {reviews.length === 0 && <p>No reviews yet.</p>}
          {reviews.slice(0, 5).map(review => {
            const username = review.user && typeof review.user === 'object' && review.user.username
              ? review.user.username
              : (typeof review.user === 'string' ? review.user : 'Unknown User');
            return (
              <div key={review.id} className="review-item">
                <StarRating rating={review.rating} />
                <p className="review-comment">{review.comment}</p>
                <p className="review-author">- {username}</p>
              </div>
            );
          })}
        </div>
        {user && (
          <div className="product-detail-review-form">
            <h3>Add Your Review</h3>
            {reviewError && <div className="error-message">{reviewError}</div>}
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <label htmlFor="rating">Rating:</label>
                  <div className="rating-input">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        className={values.rating >= star ? 'star filled' : 'star'}
                        onClick={() => setFieldValue('rating', star)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={() => setFieldValue('rating', star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <ErrorMessage name="rating" component="div" className="error-message" />
                  <label htmlFor="comment">Comment:</label>
                  <Field as="textarea" id="comment" name="comment" rows="4" />
                  <ErrorMessage name="comment" component="div" className="error-message" />
                  <button type="submit" className="submit-review-button" disabled={reviewsLoading}>
                    {reviewsLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        )}
        {!user && (
          <p className="login-to-review">
            Please <Link to="/auth">log in</Link> to add a review.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;