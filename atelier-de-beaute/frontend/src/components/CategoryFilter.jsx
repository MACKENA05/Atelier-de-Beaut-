import React from 'react';
import './CategoryFilter.css';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="category-filter">
      <h4>Filter by Category</h4>
      <ul>
        <li
          className={!selectedCategory ? 'active' : ''}
          onClick={() => onSelectCategory(null)}
        >
          All
        </li>
        {categories.map((category) => (
          <li
            key={category}
            className={selectedCategory === category ? 'active' : ''}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryFilter;
