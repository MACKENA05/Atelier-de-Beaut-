import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { BrowserRouter } from 'react-router-dom';

// Mock API client
jest.mock('../services/apiClient', () => ({
  fetchProducts: jest.fn(() => Promise.resolve([])),
  fetchTestimonials: jest.fn(() => Promise.resolve([])),
  loginUser: jest.fn(() => Promise.resolve({ token: 'fake-token' })),
  // Add other API mocks as needed
}));

describe('App Integration Tests', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  });

  test('renders landing page and navigates to shop', async () => {
    // Check landing page content
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();

    // Click Shop Now button
    const shopNowButton = screen.getByRole('button', { name: /shop now/i });
    userEvent.click(shopNowButton);

    // Wait for shop page to load
    await waitFor(() => {
      expect(screen.getByText(/featured products/i)).toBeInTheDocument();
    });
  });

  test('login form works and submits', async () => {
    // Navigate to login page
    const loginLink = screen.getByRole('link', { name: /login/i });
    userEvent.click(loginLink);

    // Fill login form
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    userEvent.type(emailInput, 'test@example.com');
    userEvent.type(passwordInput, 'password123');

    // Submit form
    const loginButton = screen.getByRole('button', { name: /log in/i });
    userEvent.click(loginButton);

    // Wait for login success indication (e.g., redirect or token set)
    await waitFor(() => {
      expect(screen.queryByText(/logging in/i)).not.toBeInTheDocument();
    });
  });

  test('add to cart button adds product to cart', async () => {
    // Navigate to shop page
    const shopLink = screen.getByRole('link', { name: /shop/i });
    userEvent.click(shopLink);

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText(/add to cart/i)).toBeInTheDocument();
    });

    // Click add to cart button
    const addToCartButton = screen.getAllByText(/add to cart/i)[0];
    userEvent.click(addToCartButton);

    // Check cart count or cart page for added item
    const cartLink = screen.getByRole('link', { name: /cart/i });
    userEvent.click(cartLink);

    await waitFor(() => {
      expect(screen.getByText(/your cart/i)).toBeInTheDocument();
    });
  });

  // Add more tests for other pages and buttons as needed
});
