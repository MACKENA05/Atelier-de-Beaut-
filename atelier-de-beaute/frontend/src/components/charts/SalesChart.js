import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const SalesChart = () => {
  const [salesAnalytics, setSalesAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesAnalytics = async () => {
      try {
        const response = await api.get('/analytic/sales');
        setSalesAnalytics(response.data);
      } catch (err) {
        setError('Failed to fetch sales analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchSalesAnalytics();
  }, []);

  if (loading) return <div>Loading sales analytics...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h3>Sales Analytics</h3>
      {salesAnalytics ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Period</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(salesAnalytics.monthly_revenue) ? (
              salesAnalytics.monthly_revenue.map((entry, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{entry.period}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    KES {entry.revenue}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" style={{ border: '1px solid #ddd', padding: '8px' }}>
                  No detailed monthly revenue data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <p>No sales analytics data available.</p>
      )}
    </div>
  );
};

export default SalesChart;