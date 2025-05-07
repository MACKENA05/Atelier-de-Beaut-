import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const UserCharts = () => {
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAnalytics = async () => {
      try {
        const response = await api.get('/analytic/users');
        setUserAnalytics(response.data);
      } catch (err) {
        setError('Failed to fetch user analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAnalytics();
  }, []);

  if (loading) return <div>Loading user analytics...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h3>User Analytics</h3>
      {userAnalytics ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Metric</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(userAnalytics).map(([key, value]) => (
              <tr key={key}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{key}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {value !== null ? value.toString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No user analytics data available.</p>
      )}
    </div>
  );
};

export default UserCharts;