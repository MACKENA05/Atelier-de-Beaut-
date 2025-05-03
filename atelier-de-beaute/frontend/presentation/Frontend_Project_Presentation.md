# Frontend Project Presentation - Atelier de Beauté

## 1. Project Overview
- E-commerce frontend for beauty products.
- Built with React to provide a seamless single-page application experience.
- Supports multiple user roles: customers, admins, managers, sales reps.

## 2. Architecture and Technologies
- React with react-router-dom for client-side routing.
- Redux Toolkit for state management with slices for auth, cart, products, and admin.
- Redux-persist to persist cart state in local storage.
- React-toastify for user notifications.
- CSS modules and organized stylesheets for styling.

## 3. Key Features
- User authentication and authorization with login, signup, logout, and session persistence.
- Product browsing with category and price filtering.
- Shopping cart integration with add to cart functionality.
- Role-based dashboards for admin, manager, and sales representatives.
- Responsive navigation bar and footer with role-based links and social media.

## 4. State Management
- Redux slices:
  - **authSlice**: handles user authentication, session, and wallet funds.
  - **cartSlice**: manages shopping cart state with persistence.
  - **productsSlice**: manages product data (mock data currently).
  - **adminSlice**: manages admin-related state.
- Async thunks handle API calls for authentication and cart actions.

## 5. UI Components
- **Navbar**: navigation links (Home, Shop, Cart, Account, Contact), responsive menu toggle, search input.
- **Footer**: brand info, quick links, role-based admin links, social media links.
- **Shop Page**: product grid with filtering and add to cart buttons.

## 6. User Flows
- User signs up or logs in; session is persisted.
- User browses products, filters by category and price.
- User adds products to cart; cart state is saved.
- Admins and managers access their dashboards via role-based routes.

## 7. Styling and UX
- Clean, modern UI with CSS modules.
- Toast notifications provide feedback on user actions.
- Responsive design for mobile and desktop.

## 8. Future Enhancements
- Implement ProtectedRoute for route protection and role-based access control.
- Enhance search functionality in Navbar.
- Replace mock product data with real API integration.
- Add more detailed user account and order management features.

