import React from 'react';
import OrdersChart from '../charts/OrdersChart';
import SalesChart from '../charts/SalesChart';
import UserCharts from '../charts/UserCharts';

const Analytics = () => {
  return (
    <div>
      <h2>Analytics Overview</h2>
      <div>
        <h3>Sales Analytics</h3>
        <SalesChart />
      </div>
      <div>
        <h3>User Analytics</h3>
        <UserCharts />
      </div>
      <div>
        <h3>Order Analytics</h3>
        <OrdersChart />
      </div>
    </div>
  );
};

export default Analytics;