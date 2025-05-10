import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../slice/productSlice';

const ProductsTable = () => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.product.products);
  const loading = useSelector(state => state.product.loading);
  const error = useSelector(state => state.product.error);

  const [editingProductId, setEditingProductId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleAddProduct = () => {
    dispatch(addProduct(formData));
    setFormData({ name: '', description: '', price: '', stock: '' });
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);
    setFormData({ name: product.name, description: product.description, price: product.price, stock: product.stock });
  };

  const handleUpdateProduct = () => {
    dispatch(updateProduct({ id: editingProductId, ...formData }));
    setEditingProductId(null);
    setFormData({ name: '', description: '', price: '', stock: '' });
  };

  const handleDeleteProduct = (id) => {
    dispatch(deleteProduct(id));
  };

  return (
    <div>
      <h2>Products</h2>
      {loading && <p>Loading products...</p>}
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
      <table border="1" cellPadding="8" cellSpacing="0" style={{width: '100%', marginBottom: '1rem'}}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products && products.map(product => (
            <tr key={product.id}>
              <td>{editingProductId === product.id ? (
                <input name="name" value={formData.name} onChange={handleInputChange} />
              ) : product.name}</td>
              <td>{editingProductId === product.id ? (
                <input name="description" value={formData.description} onChange={handleInputChange} />
              ) : product.description}</td>
              <td>{editingProductId === product.id ? (
                <input name="price" type="number" value={formData.price} onChange={handleInputChange} />
              ) : product.price}</td>
              <td>{editingProductId === product.id ? (
                <input name="stock" type="number" value={formData.stock} onChange={handleInputChange} />
              ) : product.stock}</td>
              <td>
                {editingProductId === product.id ? (
                  <>
                    <button onClick={handleUpdateProduct}>Save</button>
                    <button onClick={() => setEditingProductId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditProduct(product)}>Edit</button>
                    <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {editingProductId === null && (
            <tr>
              <td><input name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" /></td>
              <td><input name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" /></td>
              <td><input name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="Price" /></td>
              <td><input name="stock" type="number" value={formData.stock} onChange={handleInputChange} placeholder="Stock" /></td>
              <td><button onClick={handleAddProduct}>Add Product</button></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
