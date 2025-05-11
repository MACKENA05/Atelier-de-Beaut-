import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvoices } from '../slice/invoiceSlice';
import './InvoicesTable.css';

const InvoicesTable = () => {
  const dispatch = useDispatch();
  const invoices = useSelector(state => state.invoices.invoices);
  const loading = useSelector(state => state.invoices.loading);
  const error = useSelector(state => state.invoices.error);
  const total = useSelector(state => state.invoices.total);
  const pages = useSelector(state => state.invoices.pages);
  const currentPage = useSelector(state => state.invoices.currentPage);
  const perPage = useSelector(state => state.invoices.perPage);

  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchInvoices({ status: statusFilter, page, perPage }));
  }, [dispatch, statusFilter, page, perPage]);

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1); // Reset to first page on filter change
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'initiated':
        return 'status-initiated';
      case 'completed':
        return 'status-completed';
      case 'failed':
        return 'status-failed';
      case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < pages) setPage(page + 1);
  };

  return (
    <div className="invoices-container">
      <h2>Invoices</h2>
      <div className="status-filter">
        <label htmlFor="statusFilter">Filter by Status: </label>
        <select id="statusFilter" value={statusFilter} onChange={handleStatusChange}>
          <option value="">All</option>
          <option value="initiated">Initiated</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      {loading && <p className="loading-message">Loading invoices...</p>}
      {error && <p className="error-message">Error: {error}</p>}
      <table className="invoices-table">
        <thead>
          <tr>
            <th>Invoice Number</th>
            <th>User ID</th>
            <th>Order ID</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {invoices && invoices.map(invoice => (
            <tr key={invoice.invoice_number}>
              <td>{invoice.invoice_number}</td>
              <td>{invoice.user_id || 'N/A'}</td>
              <td>{invoice.order_id || 'N/A'}</td>
              <td>KES {invoice.total}</td>
              <td className={getStatusClass(invoice.status)}>{invoice.status}</td>
              <td>{new Date(invoice.issued_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-controls">
        <button onClick={handlePreviousPage} disabled={page === 1}>Previous</button>
        <span> Page {page} of {pages} </span>
        <button onClick={handleNextPage} disabled={page === pages}>Next</button>
      </div>
    </div>
  );
};

export default InvoicesTable;
