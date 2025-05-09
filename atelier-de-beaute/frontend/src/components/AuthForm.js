import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, register } from '../slice/authSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import './AuthForm.css';

const AuthForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Define all possible fields to avoid uncontrolled->controlled issues
  const initialValues = {
    username: '',
    email: '',
    password: '',
  };

  const loginValidationSchema = Yup.object({
    username: Yup.string().required('Email or Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const registerValidationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const filteredValues = isLogin
    ? { username: values.username, password: values.password }
    : values;
    
    try {
    if (isLogin) {
    const user = await dispatch(login(filteredValues)).unwrap();
    const role = user.role ? user.role.toLowerCase() : '';
    switch (role) {
    case 'admin':
    navigate('/admin');
    break;
    case 'sales-representative':
    navigate('/sales-rep');
    break;
    case 'manager':
    navigate('/manager');
    break;
    case 'customer':
    navigate('/my-orders');
    break;
    default:
    navigate('/');
    }
    } else {
    await dispatch(register(filteredValues)).unwrap();
    navigate('/');
    }
    } catch (err) {
    setErrors({ login: err?.error || 'Login failed Invalid credentials' });
    } finally {
    setSubmitting(false);
    }
    };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setShowPassword(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">{isLogin ? 'Login' : 'Create Account'}</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={isLogin ? loginValidationSchema : registerValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, errors }) => (
          <Form className="auth-form">
            {/* Username */}
            <label className="auth-label" htmlFor="username">
              {isLogin ? 'Email or Username:' : 'Username:'}
            </label>
            <Field
              name="username"
              type="text"
              autoComplete="username"
              className="auth-input"
            />
            <ErrorMessage name="username" component="div" className="auth-error" />

            {/* Email field (only used in register) */}
            {!isLogin && (
              <>
                <label className="auth-label" htmlFor="email">Email:</label>
                <Field
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="auth-input"
                />
                <ErrorMessage name="email" component="div" className="auth-error" />
              </>
            )}

            {/* Password */}
            <label className="auth-label" htmlFor="password">
              Password:
            </label>
            <div className="password-input-wrapper" style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
              <Field
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                style={{ paddingRight: '2.5rem' }}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                className="password-toggle-button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: 0,
                  color: '#cc6c9c',
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <ErrorMessage name="password" component="div" className="auth-error" />

            {/* Form-level errors */}
            {errors.login && <div className="auth-error">{errors.login}</div>}

            {/* Submit button */}
            <button type="submit" className="auth-button" disabled={isSubmitting}>
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </Form>
        )}
      </Formik>

      <p className="auth-toggle-text">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
        <button onClick={toggleForm} className="auth-toggle-button" type="button">
          {isLogin ? 'Register here' : 'Login here'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
