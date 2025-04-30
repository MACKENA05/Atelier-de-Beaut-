import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/authSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const { user, loading, error } = auth;

  React.useEffect(() => {
    if (user) {
      toast.success('Login successful!');
      sessionStorage.setItem('userRole', user.role || 'user');
      navigate('/landing');
    }
  }, [user, navigate]);

  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
  });

  const onSubmit = (values) => {
    dispatch(login(values));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Login</h1>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ isSubmitting }) => (
          <Form style={styles.form}>
            <label htmlFor="email">Email</label>
            <Field type="email" name="email" style={styles.input} />
            <ErrorMessage name="email" component="div" style={styles.error} />

            <label htmlFor="password">Password</label>
            <Field type="password" name="password" style={styles.input} />
            <ErrorMessage name="password" component="div" style={styles.error} />

            <button type="submit" style={styles.button} disabled={isSubmitting || loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
            {error && <div style={styles.error}>{error}</div>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#1a1a2e',
    color: '#eaeaea',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: '1.5rem',
    fontWeight: '700',
    fontSize: '2.5rem',
    letterSpacing: '0.1rem',
  },
  form: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    backgroundColor: '#16213e',
    color: '#eaeaea',
    boxShadow: '0 0 8px #0f3460',
    transition: 'box-shadow 0.3s ease',
  },
  button: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#0f3460',
    color: '#eaeaea',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 0 12px #0f3460',
    transition: 'background-color 0.3s ease',
  },
  error: {
    color: 'red',
    fontSize: '0.875rem',
  },
};

export default Login;
