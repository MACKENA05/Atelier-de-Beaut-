import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../slice/productSlice';
import { FaTrash, FaSave, FaEdit, FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmDialog from './ConfirmDialog';
import './ProductsTable.css';

const ProductsTable = () => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.products.products);
  const loading = useSelector(state => state.products.loading);
  const error = useSelector(state => state.products.error);

  const [editingProductId, setEditingProductId] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    slug: '',
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    image_urls: '',
    sku: '',
    discount_price: '',
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  // New state for user-selectable page size
  const [pageSize, setPageSize] = useState(10); // default to 10 products per page

  // State for confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage, per_page: pageSize }));
  }, [dispatch, currentPage, pageSize]);

  // Effect to show toast notifications on add, update, delete success or error
  const productStatus = useSelector(state => state.products.status);
  const productError = useSelector(state => state.products.error);

  useEffect(() => {
    if (productStatus === 'add_success') {
      toast.success('Product added successfully');
    } else if (productStatus === 'add_error') {
      toast.error('Failed to add product: ' + productError);
    } else if (productStatus === 'update_success') {
      toast.success('Product updated successfully');
    } else if (productStatus === 'update_error') {
      toast.error('Failed to update product: ' + productError);
    } else if (productStatus === 'delete_success') {
      toast.success('Product deleted successfully');
    } else if (productStatus === 'delete_error') {
      toast.error('Failed to delete product: ' + productError);
    }
  }, [productStatus, productError]);

  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleAddProduct = () => {
    // Remove id and slug before adding product
    const { id, slug, image_urls, ...rest } = formData;
    const productData = {
      ...rest,
      image_urls: image_urls ? image_urls.split(',').map(url => url.trim()) : [],
    };
    dispatch(addProduct(productData));
    setFormData({ id: '', slug: '', name: '', description: '', price: '', stock_quantity: '', image_urls: '', sku: '', discount_price: '' });
    setEditingProductId(null);
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product.slug);
    setFormData({ 
      id: product.id,
      slug: product.slug,
      name: product.name, 
      description: product.description, 
      price: product.price, 
      stock_quantity: product.stock_quantity,
      image_urls: product.image_urls ? product.image_urls.join(', ') : '',
      sku: product.sku || '',
      discount_price: product.discount_price || '',
    });
  };

  const handleUpdateProduct = () => {
    const { id, slug, image_urls, discount_price, price, stock_quantity, ...rest } = formData;
    const productData = {
      ...rest,
      image_urls: image_urls ? image_urls.split(',').map(url => url.trim()) : [],
      discount_price: discount_price === '' ? null : parseFloat(discount_price),
      price: price === '' ? null : parseFloat(price),
      stock_quantity: stock_quantity === '' ? null : parseInt(stock_quantity, 10),
    };
    // Remove slug completely from the update payload
    dispatch(updateProduct({ slug: editingProductId, ...productData }));
    setEditingProductId(null);
    setFormData({ id: '', slug: '', name: '', description: '', price: '', stock_quantity: '', image_urls: '', sku: '', discount_price: '' });
  };

  // Open confirmation dialog before deleting
  const confirmDeleteProduct = (slug) => {
    setProductToDelete(slug);
    setConfirmDialogOpen(true);
  };

  // Confirmed delete action
  const handleDeleteProduct = () => {
    if (productToDelete) {
      dispatch(deleteProduct(productToDelete));
      setProductToDelete(null);
      setConfirmDialogOpen(false);
    }
  };

  // Cancel delete action
  const cancelDeleteProduct = () => {
    setProductToDelete(null);
    setConfirmDialogOpen(false);
  };

  // Pagination helpers
  const total = useSelector(state => state.products.total);
  const totalPages = Math.ceil(total / pageSize);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Handler for changing number of products per page
  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    if (!isNaN(newSize) && newSize > 0) {
      setPageSize(newSize);
      setCurrentPage(1); // Reset to first page when page size changes
    }
  };

  return (
    <div className="products-table-container">
      <h2>Products</h2>

      {/* Add Product Form at top */}
      {editingProductId === 'new' ? (
        <div className="add-product-form" style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
          <input name="id" value={formData.id} onChange={handleInputChange} placeholder="ID" />
          <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" />
          <input name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" />
          <input name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="Price" />
          <input name="stock_quantity" type="number" value={formData.stock_quantity} onChange={handleInputChange} placeholder="Stock Quantity" />
          <input name="image_urls" value={formData.image_urls} onChange={handleInputChange} placeholder="Image URLs" />
          <input name="sku" value={formData.sku} onChange={handleInputChange} placeholder="SKU" />
          <input name="discount_price" type="number" value={formData.discount_price} onChange={handleInputChange} placeholder="Discount Price" />
          <button onClick={handleAddProduct} title="Add Product">Add</button>
          <button onClick={() => setEditingProductId(null)} title="Cancel" style={{ marginLeft: '0.5rem' }}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setEditingProductId('new')} style={{ marginBottom: '1rem' }}> + Add New Product</button>
      )}

      {loading && <p>Loading products...</p>}
      {error && <p style={{color: 'red'}}>Error: {error}</p>}

      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock Quantity</th>
            <th>Image URLs</th>
            <th>SKU</th>
            <th>Discount Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products && products.map(product => (
            <tr key={product.id}>
              <td>{editingProductId === product.slug ? (
                <input name="id" value={formData.id} onChange={handleInputChange} disabled />
              ) : product.id}</td>
              <td>{editingProductId === product.slug ? (
                <input name="name" value={formData.name} onChange={handleInputChange} />
              ) : product.name}</td>
              <td>{editingProductId === product.slug ? (
                <input name="description" value={formData.description} onChange={handleInputChange} />
              ) : product.description}</td>
              <td>{editingProductId === product.slug ? (
                <input name="price" type="number" value={formData.price} onChange={handleInputChange} />
              ) : product.price}</td>
              <td>{editingProductId === product.slug ? (
                <input name="stock_quantity" type="number" value={formData.stock_quantity} onChange={handleInputChange} />
              ) : product.stock_quantity}</td>
              <td>{editingProductId === product.slug ? (
                <input name="image_urls" value={formData.image_urls} onChange={handleInputChange} />
              ) : (
                product.image_urls ? product.image_urls.join(', ') : 'No Images'
              )}</td>
              <td>{editingProductId === product.slug ? (
                <input name="sku" value={formData.sku} onChange={handleInputChange} />
              ) : product.sku}</td>
              <td>{editingProductId === product.slug ? (
                <input name="discount_price" type="number" value={formData.discount_price} onChange={handleInputChange} />
              ) : product.discount_price}</td>
              <td>
                {editingProductId === product.slug ? (
                  <>
                    <button onClick={handleUpdateProduct} title="Save"><FaSave /></button>
                    <button onClick={() => setEditingProductId(null)} title="Cancel"><FaTimes /></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditProduct(product)} title="Edit"><FaEdit /></button>
                    <button onClick={() => confirmDeleteProduct(product.slug)} title="Delete"><FaTrash /></button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="pagination" style={{ marginTop: '1rem' }}>
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        <span style={{ margin: '0 1rem' }}>Page {currentPage} of {totalPages}</span>
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
      </div>
        {/* Control to select number of products per page */}
        <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="pageSizeSelect">Products per page: </label>
        <select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange}>
          {[5, 10, 20, 50].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>

      <ConfirmDialog
        title="Confirm Delete"
        message="Are you sure you want to delete this product?"
        onConfirm={handleDeleteProduct}
        onCancel={cancelDeleteProduct}
        open={confirmDialogOpen}
      />

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default ProductsTable;
