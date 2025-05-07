import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    imageUrl: '',
    category: '',
    price: '',
    discount: '',
    sku: '',
    brand: '',
    isActive: true,
    stockQuantity: '',
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingProduct, setEditingProduct] = useState({
    name: '',
    description: '',
    imageUrl: '',
    category: '',
    price: '',
    discount: '',
    sku: '',
    brand: '',
    isActive: true,
    stockQuantity: '',
  });
  const [reviews, setReviews] = useState({});
  const [userReviews, setUserReviews] = useState({});
  const [reviewInputs, setReviewInputs] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
        // Fetch reviews for each product
        const reviewsData = {};
        const userReviewsData = {};
        for (const product of response.data) {
          const resReviews = await api.get(`/products/${product.id}/reviews`);
          reviewsData[product.id] = resReviews.data.reviews;
          const resUserReviews = await api.get('/user/reviews');
          // Find user review for this product
          const userReview = resUserReviews.data.reviews.find(r => r.product_id === product.id);
          if (userReview) {
            userReviewsData[product.id] = userReview;
            setReviewInputs(prev => ({
              ...prev,
              [product.id]: { rating: userReview.rating, comment: userReview.comment || '' }
            }));
          } else {
            setReviewInputs(prev => ({
              ...prev,
              [product.id]: { rating: 0, comment: '' }
            }));
          }
        }
        setReviews(reviewsData);
        setUserReviews(userReviewsData);
      } catch (err) {
        setError('Failed to fetch products or reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e, isEditing = false) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    if (isEditing) {
      setEditingProduct({ ...editingProduct, [name]: val });
    } else {
      setNewProduct({ ...newProduct, [name]: val });
    }
  };

  const handleReviewInputChange = (productId, field, value) => {
    setReviewInputs(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      }
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/products', newProduct);
      setProducts([...products, response.data]);
      setNewProduct({
        name: '',
        description: '',
        imageUrl: '',
        category: '',
        price: '',
        discount: '',
        sku: '',
        brand: '',
        isActive: true,
        stockQuantity: '',
      });
    } catch (err) {
      setError('Failed to add product');
    }
  };

  const handleEditClick = (product) => {
    setEditingProductId(product.id);
    setEditingProduct({
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      category: product.category,
      price: product.price,
      discount: product.discount,
      sku: product.sku,
      brand: product.brand,
      isActive: product.isActive,
      stockQuantity: product.stockQuantity,
    });
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setEditingProduct({
      name: '',
      description: '',
      imageUrl: '',
      category: '',
      price: '',
      discount: '',
      sku: '',
      brand: '',
      isActive: true,
      stockQuantity: '',
    });
  };

  const handleSaveEdit = async (productId) => {
    try {
      const response = await api.put(`/products/${productId}`, editingProduct);
      setProducts(products.map(p => (p.id === productId ? response.data : p)));
      setEditingProductId(null);
      setEditingProduct({
        name: '',
        description: '',
        imageUrl: '',
        category: '',
        price: '',
        discount: '',
        sku: '',
        brand: '',
        isActive: true,
        stockQuantity: '',
      });
    } catch (err) {
      setError('Failed to update product');
    }
  };

  const handleDelete = async (productId) => {
    try {
      await api.delete(`/products/${productId}`);
      setProducts(products.filter(p => p.id !== productId));
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const handleSubmitReview = async (productId) => {
    try {
      const reviewData = reviewInputs[productId];
      if (!reviewData) return;
      const existingReview = userReviews[productId];
      if (existingReview) {
        // Update review
        await api.put(`/reviews/${existingReview.id}`, reviewData);
      } else {
        // Create review
        await api.post('/reviews', { ...reviewData, product_id: productId });
      }
      // Refresh reviews
      const resReviews = await api.get(`/products/${productId}/reviews`);
      setReviews(prev => ({ ...prev, [productId]: resReviews.data.reviews }));
      // Refresh user review
      const resUserReviews = await api.get('/user/reviews');
      const userReview = resUserReviews.data.reviews.find(r => r.product_id === productId);
      setUserReviews(prev => ({ ...prev, [productId]: userReview }));
      alert('Review submitted successfully');
    } catch (err) {
      alert('Failed to submit review');
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Manage Products</h2>
      <form onSubmit={handleAddProduct} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newProduct.name}
          onChange={handleInputChange}
          required
          style={{ marginRight: '0.5rem' }}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleInputChange}
          style={{ marginRight: '0.5rem' }}
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={newProduct.imageUrl}
          onChange={handleInputChange}
          style={{ marginRight: '0.5rem' }}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newProduct.category}
          onChange={handleInputChange}
          style={{ marginRight: '0.5rem' }}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleInputChange}
          style={{ marginRight: '0.5rem' }}
        />
        <input
          type="number"
          name="discount"
          placeholder="Discount"
          value={newProduct.discount}
          onChange={handleInputChange}
          style={{ marginRight: '0.5rem' }}
        />
        <input
          type="text"
          name="sku"
          placeholder="SKU"
          value={newProduct.sku}
          onChange={handleInputChange}
          style={{ marginRight: '0.5rem' }}
        />
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={newProduct.brand}
          onChange={handleInputChange}
          style={{ marginRight: '0.5rem' }}
        />
        <label style={{ marginRight: '0.5rem' }}>
          Active:
          <input
            type="checkbox"
            name="isActive"
            checked={newProduct.isActive}
            onChange={handleInputChange}
            style={{ marginLeft: '0.25rem' }}
          />
        </label>
        <input
          type="number"
          name="stockQuantity"
          placeholder="Stock Quantity"
          value={newProduct.stockQuantity}
          onChange={handleInputChange}
          style={{ marginRight: '0.5rem' }}
        />
        <button type="submit">Add Product</button>
      </form>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Description</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Image</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Category</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Price</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Discount</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>SKU</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Brand</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Active</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Stock Quantity</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Top Reviews</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Customer Reviews</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Your Rating</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Your Review</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              {editingProductId === product.id ? (
                <>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <input
                      type="text"
                      name="name"
                      value={editingProduct.name}
                      onChange={(e) => handleInputChange(e, true)}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <input
                      type="text"
                      name="description"
                      value={editingProduct.description}
                      onChange={(e) => handleInputChange(e, true)}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <input
                      type="text"
                      name="imageUrl"
                      value={editingProduct.imageUrl}
                      onChange={(e) => handleInputChange(e, true)}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <input
                      type="text"
                      name="category"
                      value={editingProduct.category}
                      onChange={(e) => handleInputChange(e, true)}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <input
                      type="number"
                      name="price"
                      value={editingProduct.price}
                      onChange={(e) => handleInputChange(e, true)}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <input
                      type="number"
                      name="discount"
                      value={editingProduct.discount}
                      onChange={(e) => handleInputChange(e, true)}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <input
                      type="text"
                      name="sku"
                      value={editingProduct.sku}
                      onChange={(e) => handleInputChange(e, true)}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <input
                      type="text"
                      name="brand"
                      value={editingProduct.brand}
                      onChange={(e) => handleInputChange(e, true)}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={editingProduct.isActive}
                      onChange={(e) => handleInputChange(e, true)}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <input
                      type="number"
                      name="stockQuantity"
                      value={editingProduct.stockQuantity}
                      onChange={(e) => handleInputChange(e, true)}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {/* Display top reviews */}
                    {reviews[product.id] && reviews[product.id].length > 0 ? (
                      <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
                        {reviews[product.id]
                          .filter(r => r.featured)
                          .map(r => (
                            <li key={r.id}>
                              {r.comment} - Rating: {r.rating}
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <span>No top reviews</span>
                    )}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {/* Display customer reviews */}
                    {reviews[product.id] && reviews[product.id].length > 0 ? (
                      <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
                        {reviews[product.id].map(r => (
                          <li key={r.id}>
                            {r.comment} - Rating: {r.rating}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span>No customer reviews</span>
                    )}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {/* Display your rating */}
                    {reviewInputs[product.id] ? reviewInputs[product.id].rating : 0}
                    <br />
                    <select
                      value={reviewInputs[product.id] ? reviewInputs[product.id].rating : 0}
                      onChange={(e) => handleReviewInputChange(product.id, 'rating', parseInt(e.target.value))}
                    >
                      <option value={0}>Select rating</option>
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {/* Display your review */}
                    <textarea
                      value={reviewInputs[product.id] ? reviewInputs[product.id].comment : ''}
                      onChange={(e) => handleReviewInputChange(product.id, 'comment', e.target.value)}
                      rows={3}
                      cols={20}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <button onClick={() => handleSaveEdit(product.id)} style={{ marginRight: '0.5rem' }}>Save</button>
                    <button onClick={() => handleDelete(product.id)} style={{ marginRight: '0.5rem' }}>Delete</button>
                    <button onClick={() => handleSubmitReview(product.id)}>Submit Review</button>
                  </td>
                </>
              ) : (
                <>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.description}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <img src={product.imageUrl} alt={product.name} style={{ width: '50px', height: '50px' }} />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.category}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>KES {product.price}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.discount}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.sku}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.brand}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{product.isActive ? 'Yes' : 'No'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.stockQuantity}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {/* Display top reviews */}
                    {reviews[product.id] && reviews[product.id].length > 0 ? (
                      <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
                        {reviews[product.id]
                          .filter(r => r.featured)
                          .map(r => (
                            <li key={r.id}>
                              {r.comment} - Rating: {r.rating}
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <span>No top reviews</span>
                    )}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {/* Display customer reviews */}
                    {reviews[product.id] && reviews[product.id].length > 0 ? (
                      <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
                        {reviews[product.id].map(r => (
                          <li key={r.id}>
                            {r.comment} - Rating: {r.rating}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span>No customer reviews</span>
                    )}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {/* Display your rating */}
                    {reviewInputs[product.id] ? reviewInputs[product.id].rating : 0}
                    <br />
                    <select
                      value={reviewInputs[product.id] ? reviewInputs[product.id].rating : 0}
                      onChange={(e) => handleReviewInputChange(product.id, 'rating', parseInt(e.target.value))}
                    >
                      <option value={0}>Select rating</option>
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {/* Display your review */}
                    <textarea
                      value={reviewInputs[product.id] ? reviewInputs[product.id].comment : ''}
                      onChange={(e) => handleReviewInputChange(product.id, 'comment', e.target.value)}
                      rows={3}
                      cols={20}
                    />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <button onClick={() => handleEditClick(product)} style={{ marginRight: '0.5rem' }}>Edit</button>
                    <button onClick={() => handleDelete(product.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
