import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvoices } from '../slice/invoiceSlice';

const InvoicesTable = () => {
  const dispatch = useDispatch();
  const invoices = useSelector(state => state.invoices.invoices);
  const loading = useSelector(state => state.invoices.loading);
  const error = useSelector(state => state.invoices.error);

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  return (
    <div>
      <h2>Invoices</h2>
      {loading && <p>Loading invoices...</p>}
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
      <table border="1" cellPadding="8" cellSpacing="0" style={{width: '100%', marginBottom: '1rem'}}>
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>User</th>
            <th>Order ID</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {invoices && invoices.map(invoice => (
            <tr key={invoice.id}>
              <td>{invoice.id}</td>
              <td>{invoice.user?.username || invoice.user?.email || 'N/A'}</td>
              <td>{invoice.order?.id || 'N/A'}</td>
              <td>KES {invoice.amount}</td>
              <td>{new Date(invoice.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoicesTable;
