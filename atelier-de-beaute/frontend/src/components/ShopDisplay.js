import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../slice/productSlice';

const ShopDisplay = () => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.products.products);
  const loading = useSelector(state => state.products.loading);
  const error = useSelector(state => state.products.error);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div>
      <h2>Shop Products</h2>
      {loading && <p>Loading products...</p>}
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {products && products.map(product => {
          const imageUrl =
            product.image_urls && product.image_urls.length > 0 && typeof product.image_urls[0] === 'string'
              ? product.image_urls[0]
              : '';
          return (
            <div key={product.id} style={{ border: '1px solid #ccc', padding: '1rem', width: '200px' }}>
              {imageUrl ? (
                <img src={imageUrl} alt={product.name} style={{ width: '100%', height: 'auto', marginBottom: '0.5rem' }} />
              ) : (
                <div style={{ width: '100%', height: '150px', backgroundColor: '#eee', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  No Image
                </div>
              )}
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p><strong>Price:</strong> ${product.price}</p>
              <p><strong>Stock:</strong> {product.stock}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShopDisplay;
