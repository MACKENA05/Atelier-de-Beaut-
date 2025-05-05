import React, { useEffect, useState } from 'react';
import api from '../services/api';

const SalesRepPanel = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics/sales');
        setAnalytics(response.data);
      } catch (err) {
        setError('Failed to fetch sales analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading sales analytics...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Sales Representative Panel</h1>
      <h2>Sales Analytics</h2>
      <pre>{JSON.stringify(analytics, null, 2)}</pre>
      {/* Add more detailed analytics and features here */}
    </div>
  );
};

export default SalesRepPanel;
