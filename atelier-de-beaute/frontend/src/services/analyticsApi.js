import api from './api';

export const fetchSalesAnalytics = (period = 'monthly') => {
  return api.get(`/analytic/sales?period=${period}`);
};

export const fetchOrderAnalytics = () => {
  return api.get('/analytic/orders');
};

export const fetchUserAnalytics = () => {
  return api.get('/analytic/users');
};

export const fetchTopProducts = () => {
  return api.get('/analytic/top-products');
};

export const fetchRevenueByCategory = () => {
  return api.get('/analytic/revenue-by-category');
};

export const fetchConversionRates = () => {
  return api.get('/analytic/conversion-rates');
};

export const fetchAnalyticsOverview = () => {
  return api.get('/analytic/overview');
};
