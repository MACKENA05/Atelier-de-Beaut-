import React, { useState, useEffect } from 'react';
import './Shop.css';
import CategoryFilter from '../components/CategoryFilter';
import { useDispatch } from 'react-redux';
import { addToCartThunk } from '../redux/cartSlice';
import { toast } from 'react-toastify';
import apiClient from '../services/apiClient';
import { useLocation } from 'react-router-dom';

const Shop = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['Skincare', 'Haircare', 'Makeup', 'Fragrance'];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || '';
    setSearchTerm(search);
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchMinPrice = minPrice ? product.price >= parseFloat(minPrice) : true;
    const matchMaxPrice = maxPrice ? product.price <= parseFloat(maxPrice) : true;
    const matchSearch = searchTerm
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    return matchCategory && matchMinPrice && matchMaxPrice && matchSearch;
  });

  const handleAddToCart = (product) => {
    dispatch(addToCartThunk(product));
    toast.success(`${product.name} added to cart!`, {
      className: 'custom-toast',
      bodyClassName: 'custom-toast-body',
      progressClassName: 'custom-toast-progress',
    });
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container-with-filterbar">
      <h1 className="title">Shop</h1>
      <div className="filter-bar">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <div className="price-filter-bar">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min="0"
            className="price-input-bar"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min="0"
            className="price-input-bar"
          />
        </div>
      </div>
      <main className="main-content">
        <div className="grid">
          {filteredProducts.map(({ id, name, price, image }) => (
            <div key={id} className="card">
              <img src={image} alt={name} className="image" />
              <h2 className="productName">{name}</h2>
              <p className="price">${price.toFixed(2)}</p>
              <button className="button" onClick={() => handleAddToCart({ id, name, price, image })}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Shop;
