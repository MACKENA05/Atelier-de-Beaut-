import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../slice/productSlice';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.products);

  useEffect(() => {
    // Fetch featured products by passing is_featured=true as a param
    dispatch(fetchProducts({ page: 1, per_page: 6, priceOrder: '', is_featured: true }));
  }, [dispatch]);

  if (loading) return <div>Loading featured products...</div>;
  if (error) return <div>Error loading featured products: {error}</div>;

  return (
    <div className="featured-products-card">
      <h2>Featured Products</h2>
      <div className="featured-products-list">
        {products && products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="featured-product-item">
              <img src={product.image_urls?.[0] || '/default-product.png'} alt={product.name} />
              <h3>{product.name}</h3>
              <p>KES {product.price.toFixed(2)}</p>
            </div>
          ))
        ) : (
          <p>No featured products available.</p>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;
