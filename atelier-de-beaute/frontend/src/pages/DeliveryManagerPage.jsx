import React, { useState } from 'react';

const initialDeliveries = [
  { id: 1, orderId: 101, customerName: 'Alice Johnson', status: 'Pending' },
  { id: 2, orderId: 102, customerName: 'Bob Smith', status: 'In Transit' },
  { id: 3, orderId: 103, customerName: 'Charlie Brown', status: 'Delivered' },
];

const DeliveryManagerPage = () => {
  const [deliveries, setDeliveries] = useState(initialDeliveries);

  const updateStatus = (id, newStatus) => {
    setDeliveries((prev) =>
      prev.map((delivery) =>
        delivery.id === id ? { ...delivery, status: newStatus } : delivery
      )
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Delivery Manager Dashboard</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Order ID</th>
            <th style={styles.th}>Customer Name</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map(({ id, orderId, customerName, status }) => (
            <tr key={id} style={styles.tr}>
              <td style={styles.td}>{id}</td>
              <td style={styles.td}>{orderId}</td>
              <td style={styles.td}>{customerName}</td>
              <td style={styles.td}>{status}</td>
              <td style={styles.td}>
                <select
                  value={status}
                  onChange={(e) => updateStatus(id, e.target.value)}
                  style={styles.select}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
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
  select: {
    padding: '0.25rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#16213e',
    color: '#eaeaea',
    cursor: 'pointer',
  },
};

export default DeliveryManagerPage;
