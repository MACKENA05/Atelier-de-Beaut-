import React, { useState } from 'react';

const initialProducts = [
  { id: 1, name: 'Luxury Face Cream', price: 49.99, description: 'A luxurious face cream.', category: 'Skincare', imageUrl: '' },
  { id: 2, name: 'Silk Hair Serum', price: 29.99, description: 'Smooth and silky hair serum.', category: 'Haircare', imageUrl: '' },
];

const ProductManagerPage = () => {
  const [products, setProducts] = useState(initialProducts);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    imageUrl: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const addProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.description && newProduct.category) {
      const newProd = {
        id: products.length + 1,
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        description: newProduct.description,
        category: newProduct.category,
        imageUrl: newProduct.imageUrl,
      };
      setProducts((prev) => [...prev, newProd]);
      setNewProduct({ name: '', price: '', description: '', category: '', imageUrl: '' });
    }
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Product Manager Dashboard</h1>
      <div style={styles.form}>
        <input
          style={styles.input}
          type="text"
          name="name"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={handleInputChange}
        />
        <input
          style={styles.input}
          type="number"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleInputChange}
        />
        <input
          style={styles.input}
          type="text"
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleInputChange}
        />
        <input
          style={styles.input}
          type="text"
          name="category"
          placeholder="Category"
          value={newProduct.category}
          onChange={handleInputChange}
        />
        <input
          style={styles.input}
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={newProduct.imageUrl}
          onChange={handleInputChange}
        />
        <button style={styles.button} onClick={addProduct}>Add Product</button>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Category</th>
            <th style={styles.th}>Image</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(({ id, name, price, description, category, imageUrl }) => (
            <tr key={id} style={styles.tr}>
              <td style={styles.td}>{id}</td>
              <td style={styles.td}>{name}</td>
              <td style={styles.td}>${price.toFixed(2)}</td>
              <td style={styles.td}>{description}</td>
              <td style={styles.td}>{category}</td>
              <td style={styles.td}>
                {imageUrl ? <img src={imageUrl} alt={name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} /> : 'No Image'}
              </td>
              <td style={styles.td}>
                <button style={styles.deleteButton} onClick={() => deleteProduct(id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#1a1a2e',
    color: '#eaeaea',
    minHeight: '100vh',
  },
  title: {
    fontWeight: '700',
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '2rem',
  },
  input: {
    flex: '1 1 200px',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    backgroundColor: '#16213e',
    color: '#eaeaea',
    boxShadow: '0 0 8px #0f3460',
    transition: 'box-shadow 0.3s ease',
  },
  button: {
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#0f3460',
    color: '#eaeaea',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 0 12px #0f3460',
    transition: 'background-color 0.3s ease',
    alignSelf: 'center',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    borderBottom: '2px solid #0f3460',
    padding: '0.75rem',
    textAlign: 'left',
    fontWeight: '600',
  },
  tr: {
    borderBottom: '1px solid #0f3460',
  },
  td: {
    padding: '0.75rem',
    verticalAlign: 'middle',
  },
  deleteButton: {
    padding: '0.25rem 0.5rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#f44336',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default ProductManagerPage;
