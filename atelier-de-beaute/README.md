# Atelier de Beauté E-Commerce Platform

## Project Overview
Atelier de Beauté is a full-stack e-commerce platform designed for beauty products. It features a React-based frontend and a Flask-based backend API. The platform supports user authentication, product management, order processing, payment integration (including M-Pesa), and analytics.

## Table of Contents
- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Running Tests](#running-tests)
  - [Deployment](#deployment)
- [Team Collaboration](#team-collaboration)
- [License](#license)

## Technologies Used

### Frontend
- React 19
- Figma and Canva (Wireframes, UI Design)
- Redux Toolkit for state management
- React Router DOM for routing
- Axios for API requests
- Formik and Yup for form handling and validation
- React Toastify for notifications
- Recharts for data visualization

### Backend
- Python 3 with Flask framework
- Flask extensions: Flask-JWT-Extended, Flask-SQLAlchemy, Flask-Migrate, Flask-Caching, Flask-Cors, Flask-RESTful, Flask-Session
- PostgreSQL  for database
- M-Pesa payment gateway integration
- Alembic for database migrations

## Getting Started

### Prerequisites
- Python 3.8+
- ReactJs
- PostgreSQL database
- M-Pesa sandbox credentials (for payment integration)

### Backend Setup

1. Clone the repository and navigate to the backend directory:
   ```bash
   cd atelier-de-beaute/Backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the `Backend` directory with the following environment variables:
   ```
   SECRET_KEY=your_secret_key
   DATABASE_URL=your_database_url
   JWT_SECRET_KEY=your_jwt_secret_key
   JWT_ACCESS_TOKEN_EXPIRES=7200
   ADMIN_EMAIL=admin_email@example.com
   ADMIN_PASSWORD=admin_password
   CORS_ORIGINS=https://atelier-de-beaut-1.onrender.com
   MPESA_CONSUMER_KEY=your_mpesa_consumer_key
   MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
   MPESA_PASSKEY=your_mpesa_passkey
   MPESA_SHORTCODE=your_mpesa_shortcode
   MPESA_CALLBACK_URL=your_mpesa_callback_url
   ```

5. Run database migrations:
   ```bash
   flask db upgrade
   ```

6. Start the backend server:
   ```bash
   flask run
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd atelier-de-beaute/frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

### Running Tests

- Backend tests can be run using your preferred test runner (e.g., pytest) in the `Backend/tests` directory.
- Frontend tests can be run with:
  ```bash
  npm test
  ```

### Deployment

- The project was deployed using Render
   - Backend (`WebServices`)
   - Frontend (`Static Site`)
   - Database (`PostgreSQL`)
- Build the frontend for production with:
  ```bash
  npm run build
  ```

## Team Collaboration

This project was a collaboration between 5 members:

- **MACKENA, MONICAH** - Scrum master, Team lead, Back-end developer, Front-end developer assist.
- **Cheruiyot, IAN** - Team member, Back-end developer, Front-end developer assist.
- **SIMBA, FLORENCE** - Team member, Front-end developer.
- **MACHUMA, MARY** - Team member, Back-end developer, Front-end developer assist.
- **KAIRU, GEORGE** - Team member, Front-end developer.

## Future Plans / Enhancements

- 📱 **Mobile Optimization:** Build a mobile app for better user experience.
- 🛒 **Enhanced Features:** Add personalized product recommendations and real-time order tracking.
- 📊 **Advanced Analytics:** Implement AI-driven sales and customer insights.
- 💳 **Payment Integrations:** Integrate Visa and PayPal payment gateways.
- 🌐 **Global Expansion:** Scale the platform for international markets.
- 🔄 **Continuous Improvement:** Regular updates based on user feedback.

## License

This project is licensed under the MIT License.
 
