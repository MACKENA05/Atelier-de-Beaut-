import React, { useState } from 'react';
import './Shop.css';
import CategoryFilter from '../components/CategoryFilter';

const mockProducts = [
  { id: 1, name: 'Luxury Face Cream', price: 49.99, category: 'Skincare', image: 'https://via.placeholder.com/200' },
  { id: 2, name: 'Silk Hair Serum', price: 29.99, category: 'Haircare', image: 'https://via.placeholder.com/200' },
  { id: 3, name: 'Organic Lip Balm', price: 9.99, category: 'Makeup', image: 'https://via.placeholder.com/200' },
  { id: 4, name: 'Hydrating Toner', price: 19.99, category: 'Skincare', image: 'https://via.placeholder.com/200' },
  { id: 5, name: 'Volumizing Shampoo', price: 15.99, category: 'Haircare', image: 'https://via.placeholder.com/200' },
  { id: 6, name: 'Matte Lipstick', price: 12.99, category: 'Makeup', image: 'https://via.placeholder.com/200' },
  { id: 7, name: 'Anti-Aging Serum', price: 59.99, category: 'Skincare', image: 'https://via.placeholder.com/200' },
  { id: 8, name: 'Curl Defining Cream', price: 22.99, category: 'Haircare', image: 'https://via.placeholder.com/200' },
  { id: 9, name: 'Eyeliner Pencil', price: 8.99, category: 'Makeup', image: 'https://via.placeholder.com/200' },
  { id: 10, name: 'Face Sunscreen SPF 50', price: 25.99, category: 'Skincare', image: 'https://via.placeholder.com/200' },
  { id: 11, name: 'Deep Conditioning Mask', price: 18.99, category: 'Haircare', image: 'https://via.placeholder.com/200' },
  { id: 12, name: 'Blush Powder', price: 14.99, category: 'Makeup', image: 'https://via.placeholder.com/200' },
  { id: 13, name: 'Night Repair Cream', price: 45.99, category: 'Skincare', image: 'https://via.placeholder.com/200' },
  { id: 14, name: 'Hair Growth Oil', price: 27.99, category: 'Haircare', image: 'https://via.placeholder.com/200' },
  { id: 15, name: 'Liquid Foundation', price: 34.99, category: 'Makeup', image: 'https://via.placeholder.com/200' },
  { id: 16, name: 'Brightening Serum', price: 39.99, category: 'Skincare', image: 'https://via.placeholder.com/200' },
  { id: 17, name: 'Heat Protectant Spray', price: 16.99, category: 'Haircare', image: 'https://via.placeholder.com/200' },
  { id: 18, name: 'Mascara', price: 13.99, category: 'Makeup', image: 'https://via.placeholder.com/200' },
  { id: 19, name: 'Exfoliating Scrub', price: 21.99, category: 'Skincare', image: 'https://via.placeholder.com/200' },
  { id: 20, name: 'Hair Detangler', price: 14.99, category: 'Haircare', image: 'https://via.placeholder.com/200' },
  { id: 21, name: 'Lip Gloss', price: 10.99, category: 'Makeup', image: 'https://via.placeholder.com/200' },
  { id: 22, name: 'Moisturizing Cream', price: 29.99, category: 'Skincare', image: 'https://via.placeholder.com/200' },
  { id: 23, name: 'Dry Shampoo', price: 19.99, category: 'Haircare', image: 'https://via.placeholder.com/200' },
  { id: 24, name: 'Concealer', price: 15.99, category: 'Makeup', image: 'https://via.placeholder.com/200' },
  { id: 25, name: 'Face Mask', price: 22.99, category: 'Skincare', image: 'https://via.placeholder.com/200' },
  { id: 26, name: 'Hair Serum', price: 24.99, category: 'Haircare', image: 'https://via.placeholder.com/200' },
  { id: 27, name: 'Eyeshadow Palette', price: 39.99, category: 'Makeup', image: 'https://via.placeholder.com/200' },
  { id: 28, name: 'Cleansing Oil', price: 18.99, category: 'Skincare', image: 'https://via.placeholder.com/200' },
  { id: 29, name: 'Hair Mousse', price: 17.99, category: 'Haircare', image: 'https://via.placeholder.com/200' },
  { id: 30, name: 'Highlighter', price: 16.99, category: 'Makeup', image: 'https://via.placeholder.com/200' },
];

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const categories = ['Skincare', 'Haircare', 'Makeup', 'Fragrance'];

  const filteredProducts = mockProducts.filter((product) => {
    const matchCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchMinPrice = minPrice ? product.price >= parseFloat(minPrice) : true;
    const matchMaxPrice = maxPrice ? product.price <= parseFloat(maxPrice) : true;
    return matchCategory && matchMinPrice && matchMaxPrice;
  });

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
              <button className="button">Add to Cart</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Shop;
