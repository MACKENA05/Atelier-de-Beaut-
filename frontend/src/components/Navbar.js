import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Navbar.css';

const Navbar = ({ onSearch, onFilterPrice, onCategorySelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    api.get('/products/categories')
      .then(response => {
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error('Categories data is not an array:', response.data);
          setCategories([]);
        }
      })
      .catch(error => {
        console.error('Failed to fetch categories:', error);
        setCategories([]);
      });
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

  const handleCategoryClick = (categoryId) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
    setMenuOpen(false); // Close menu on category select
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // New state to track open dropdowns on mobile
  const [openDropdowns, setOpenDropdowns] = React.useState({});

  const toggleDropdown = (categoryId, e) => {
    e.stopPropagation();
    setOpenDropdowns(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const renderSubcategories = (subcategories, parentId) => {
    if (!subcategories || subcategories.length === 0) return null;
    return (
      <ul className="dropdown-menu" style={{ display: openDropdowns[parentId] ? 'block' : 'none' }}>
        {subcategories.map(subcat => (
          <li
            key={subcat.id}
            className={`dropdown-item ${subcat.subcategories && subcat.subcategories.length > 0 ? 'has-submenu' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleCategoryClick(subcat.id);
            }}
          >
            {subcat.name}
            {renderSubcategories(subcat.subcategories, subcat.id)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <nav className="navbar">
      <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
        ☰
      </button>
      <ul className={`navbar-list ${menuOpen ? 'open' : ''}`}>
        <li
          key="all-products"
          className="navbar-item"
          onClick={() => handleCategoryClick(null)}
        >
          All Products
        </li>
        {categories.length > 0 ? (
          categories.map(category => (
            <li
              key={category.id}
              className={`navbar-item dropdown ${category.subcategories && category.subcategories.length > 0 ? 'has-submenu' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
              {renderSubcategories(category.subcategories)}
            </li>
          ))
        ) : (
          <li className="navbar-item">No categories available</li>
        )}
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
          <option value="">Sort by price</option>
          <option value="low">Low to High</option>
          <option value="high">High to Low</option>
        </select>
      </div>
    </nav>
  );
};

export default Navbar;
