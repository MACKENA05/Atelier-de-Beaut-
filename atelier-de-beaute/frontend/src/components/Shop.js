import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchProducts,
  fetchProductsBySearch,
  fetchProductsByCategory,
} from '../slice/productSlice';
import { addToCart, removeFromCart, updateQuantity } from '../slice/cartSlice';
import { Link } from 'react-router-dom';
import './Shop.css';

const Shop = ({ selectedCategoryId, searchTerm, priceFilter }) => {
  const dispatch = useDispatch();
  const {
    loading,
    error,
  } = useSelector((state) => state.products);
  const cartItems = useSelector((state) => state.cart.items);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [addedProductIds, setAddedProductIds] = useState(new Set());
  const [allProducts, setAllProducts] = useState([]);
  const [loadingAll, setLoadingAll] = useState(false);

  // Helper function to fetch all pages of products for search or category or all
  const fetchAllProducts = async () => {
    setLoadingAll(true);
    let allItems = [];
    let currentPage = 1;
    let totalPages = 1;

    try {
      do {
        let result;
        if (selectedCategoryId) {
          result = await dispatch(fetchProductsByCategory({ categoryId: selectedCategoryId, page: currentPage, per_page: 50, priceOrder: priceFilter })).unwrap();
          totalPages = result.products.pages;
          allItems = allItems.concat(result.products.items);
        } else if (searchTerm) {
          result = await dispatch(fetchProductsBySearch({ searchTerm, page: currentPage, per_page: 50, priceOrder: priceFilter })).unwrap();
          totalPages = result.pages;
          allItems = allItems.concat(result.items);
        } else {
          result = await dispatch(fetchProducts({ page: currentPage, per_page: 50, priceOrder: priceFilter })).unwrap();
          totalPages = result.pages;
          allItems = allItems.concat(result.items);
        }
        currentPage++;
      } while (currentPage <= totalPages);
    } catch (error) {
      console.error('Error fetching all products:', error);
    }

    setAllProducts(allItems);
    setLoadingAll(false);
  };

  useEffect(() => {
    fetchAllProducts();
  }, [selectedCategoryId, searchTerm, priceFilter]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    setAddedProductIds((prev) => new Set(prev).add(product.id));
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      setAddedProductIds(new Set());
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(allProducts.length / perPage);
    if (page < totalPages) {
      setPage(page + 1);
      setAddedProductIds(new Set());
    }
  };

  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value));
    setPage(1);
    setAddedProductIds(new Set());
  };

  if (loading || loadingAll) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  // Pagination for allProducts in frontend
  const totalPages = Math.ceil(allProducts.length / perPage);
  const paginatedProducts = allProducts.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <div className="product-grid">
        {paginatedProducts.map((product) => {
          const isOutOfStock = product.stock_quantity === 0;
          const discountPercent =
            typeof product.discount_percentage === 'number' ? product.discount_percentage : 0;
          const imageUrl =
            product.image_urls && product.image_urls.length > 0 && typeof product.image_urls[0] === 'string'
              ? product.image_urls[0]
              : '';
          const productName = typeof product.name === 'string' ? product.name : 'Unnamed Product';
          const productPrice = typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A';
          const cartItem = cartItems.find((item) => item.id === product.id);
          const quantityInCart = cartItem ? cartItem.quantity : 0;
          const justAdded = addedProductIds.has(product.id);

          const showQuantityControls = quantityInCart > 0 || justAdded;

          return (
            <div key={product.id} className="product-card">
              <Link
                to={`/product/${product.id}`}
                className="product-card-link"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="product-image-wrapper">
                  {imageUrl ? (
                    <img src={imageUrl} alt={productName} className="product-image" />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                  {discountPercent > 0 && <div className="discount-badge">{discountPercent}% OFF</div>}
                  {isOutOfStock && <div className="out-of-stock-badge">Out of Stock</div>}
                </div>
                <h3 className="product-name">{productName}</h3>
                <p className="product-price">${productPrice}</p>
              </Link>
              {!isOutOfStock &&
                (showQuantityControls ? (
                  <div className="quantity-control" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="quantity-button"
                      onClick={() => {
                        if (quantityInCart > 1) {
                          dispatch(updateQuantity({ id: product.id, quantity: quantityInCart - 1 }));
                        } else {
                          dispatch(removeFromCart(product.id));
                          setAddedProductIds((prev) => {
                            const newSet = new Set(prev);
                            newSet.delete(product.id);
                            return newSet;
                          });
                        }
                      }}
                      title="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="quantity-display">{quantityInCart > 0 ? quantityInCart : 1}</span>
                    <button
                      className="quantity-button"
                      onClick={() => {
                        dispatch(updateQuantity({ id: product.id, quantity: quantityInCart + 1 }));
                      }}
                      title="Increase quantity"
                      disabled={quantityInCart >= product.stock_quantity}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button className="add-to-cart-button" onClick={() => handleAddToCart(product)}>
                    Add to Cart
                  </button>
                ))}
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '20px',
        }}
      >
        <div>
          <button onClick={handlePrevPage} disabled={page === 1} aria-label="Previous page">
            &#8592;
          </button>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            aria-label="Next page"
            style={{ marginLeft: '10px' }}
          >
            &#8594;
          </button>
        </div>
        <div style={{ flexGrow: 1, textAlign: 'center' }}>
          <span>
            Page {page} of {totalPages}
          </span>
        </div>
        <div>
          <label htmlFor="perPageSelect">Products per page: </label>
          <select id="perPageSelect" value={perPage} onChange={handlePerPageChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Shop;
