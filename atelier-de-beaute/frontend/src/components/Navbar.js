import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = ({ onSearch, onFilterPrice }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/products/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

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
      onSearch(searchTerm);
    }
  };

  const renderSubcategories = (subcategories) => {
    if (!subcategories || subcategories.length === 0) return null;
    return (
      <ul className="dropdown-menu">
        {subcategories.map(subcat => (
          <li key={subcat.id} className="dropdown-item">
            {subcat.name}
            {renderSubcategories(subcat.subcategories)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {categories.map(category => (
          <li key={category.id} className="navbar-item dropdown">
            {category.name}
            {renderSubcategories(category.subcategories)}
          </li>
        ))}
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
