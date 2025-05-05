import React, { useEffect, useState } from 'react';
import api from '../services/api';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Admin Panel</h1>
      <h2>Manage Products</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - KES {product.price} - Category: {product.category}
          </li>
        ))}
      </ul>
      {/* Add CRUD operations UI here */}
    </div>
  );
};

export default AdminPanel;
