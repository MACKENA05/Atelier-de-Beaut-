import React, { useState, useMemo } from 'react';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';
import './Shop.css';

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

  const categories = useMemo(() => {
    const cats = new Set(mockProducts.map((p) => p.category));
    return Array.from(cats);
  }, []);

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchCategory = selectedCategory ? product.category === selectedCategory : true;
      const matchMinPrice = minPrice ? product.price >= parseFloat(minPrice) : true;
      const matchMaxPrice = maxPrice ? product.price <= parseFloat(maxPrice) : true;
      return matchCategory && matchMinPrice && matchMaxPrice;
    });
  }, [selectedCategory, minPrice, maxPrice]);

  return (
    <div className="container-with-sidebar">
      <aside className="sidebar">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <div className="price-filter">
          <h4>Filter by Price</h4>
          <div className="price-inputs">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              min="0"
              className="price-input"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min="0"
              className="price-input"
            />
          </div>
        </div>
      </aside>
      <main className="main-content">
        <h1 className="title">Shop</h1>
        <ProductGrid products={filteredProducts} />
      </main>
    </div>
  );
};

export default Shop;
