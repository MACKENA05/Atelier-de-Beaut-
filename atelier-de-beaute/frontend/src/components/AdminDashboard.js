import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSales,
  fetchOrders,
  fetchUsers,
  fetchTopProductsThunk,
  fetchRevenueByCategoryThunk,
  fetchOverviewThunk,
} from '../slice/analyticsSlice';
import './AdminDashboard.css';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#33AA99', '#9933AA'];

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const {
    sales,
    orders,
    users,
    topProducts,
    revenueByCategory,
    overview,
    loading,
    error,
  } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchSales());
    dispatch(fetchOrders());
    dispatch(fetchUsers());
    dispatch(fetchTopProductsThunk());
    dispatch(fetchRevenueByCategoryThunk());
    dispatch(fetchOverviewThunk());

    // Setting interval to refresh analytics data every 30 seconds for real-time updates
    const intervalId = setInterval(() => {
      dispatch(fetchSales());
      dispatch(fetchOrders());
      dispatch(fetchUsers());
      dispatch(fetchTopProductsThunk());
      dispatch(fetchRevenueByCategoryThunk());
      dispatch(fetchOverviewThunk());
    }, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div>Error loading analytics: {error}</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Analytics Dashboard</h1>

      <section className="summary-cards">
        <div className="summary-card">
          <h3>Total Revenue</h3>
          <p>KES {overview.total_revenue?.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Total Orders</h3>
          <p>{overview.total_orders}</p>
        </div>
        <div className="summary-card">
          <h3>Total Users</h3>
          <p>{users.total_users}</p>
        </div>
      </section>

      <section>
        <h2>Sales Analytics (Period: {sales.period})</h2>
        <p>Total Revenue: KES {sales.total_revenue?.toFixed(2)}</p>
        <p>Start Date: {sales.start_date}</p>
      </section>

      <section>
        <h2>Order Analytics</h2>
        <ul>
          <li>Total Orders: {orders.total_orders}</li>
          <li>Pending: {orders.pending}</li>
          <li>Processing: {orders.processing}</li>
          <li>Completed: {orders.completed}</li>
          <li>Cancelled: {orders.cancelled}</li>
        </ul>
      </section>

      <section>
        <h2>User Analytics</h2>
        <ul>
          <li>Total Users: {users.total_users}</li>
          <li>New Users Last 30 Days: {users.new_users_last_30_days}</li>
        </ul>
      </section>

      <section>
        <h2>Top 10 Best-Selling Products</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProducts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total_quantity_sold" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section>
        <h2>Revenue by Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={revenueByCategory}
              dataKey="total_revenue"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#82ca9d"
              label
            >
              {revenueByCategory.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default AdminDashboard;
