import React, { useState } from 'react';
import './Shop.css';

const mockProducts = [
  {
    id: 1,
    name: 'Luxury Face Cream',
    price: 49.99,
    image: 'https://via.placeholder.com/200',
  },
  {
    id: 2,
    name: 'Silk Hair Serum',
    price: 29.99,
    image: 'https://via.placeholder.com/200',
  },
  {
    id: 3,
    name: 'Organic Lip Balm',
    price: 9.99,
    image: 'https://via.placeholder.com/200',
  },
];

const Shop = () => {
  const [products] = useState(mockProducts);

  return (
    <div className="container">
      <h1 className="title">Shop</h1>
      <div className="grid">
        {products.map(({ id, name, price, image }) => (
          <div key={id} className="card">
            <img src={image} alt={name} className="image" />
            <h2 className="productName">{name}</h2>
            <p className="price">${price.toFixed(2)}</p>
            <button className="button">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
