import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCartThunk } from '../redux/cartSlice';
import { toast } from 'react-toastify';
import './ProductGrid.css';
import './ProductCard.css';
import '../styles/buttons.css';

const ProductGrid = ({ products }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCartThunk(product));
    toast.success(product.name + ' added to cart!');
  };

  return (
    <div className="product-grid">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <img src={product.image} alt={product.name} className="product-image" />
          <div className="product-info">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">${product.price.toFixed(2)}</p>
            <button
              className="button add-to-cart-button"
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
