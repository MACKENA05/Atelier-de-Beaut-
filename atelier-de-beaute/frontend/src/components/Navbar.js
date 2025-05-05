import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ onSearch, onFilterPrice }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handlePriceFilterChange = (e) => {
    const value = e.target.value;
    setPriceFilter(value);
    if (onFilterPrice) {
      onFilterPrice(value);
    }
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(searchTerm); // Trigger search when button is clicked
    }
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">All Products</li>
        <li className="navbar-item">Brands</li>
        <li className="navbar-item">Makeup</li>
        <li className="navbar-item">Fragrance</li>
        <li className="navbar-item">Haircare</li>
        <li className="navbar-item">Skincare</li>
        <li className="navbar-item">Accessories</li>
        <li className="navbar-item">Deals</li>
      </ul>
      <div className="navbar-controls">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="navbar-search"
        />
        <button
          onClick={handleSearchClick}
          className="navbar-search-button"
        >
          <i className="fas fa-search"></i> Search
        </button>
        <select
          value={priceFilter}
          onChange={handlePriceFilterChange}
          className="navbar-price-filter"
        >
          <option value="">Filter by price</option>
          <option value="low">Low to High</option>
          <option value="high">High to Low</option>
        </select>
      </div>
    </nav>
  );
};

export default Navbar;
